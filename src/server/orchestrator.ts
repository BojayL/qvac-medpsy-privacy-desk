import { randomUUID } from "node:crypto";
import type { AnswerRecord, AskRequest, IngestRequest, TraceStep } from "../shared/types.js";
import { buildGroundedPrompt, QvacRuntime } from "./qvac.js";
import { chunkText, LocalStore, type ChunkRecord } from "./storage.js";
import { appendEvidenceLog } from "./logger.js";

const DISCLAIMER =
  "Educational document Q&A only. This app does not diagnose, prescribe treatment, replace clinicians, or handle emergencies.";

export class PrivacyDeskOrchestrator {
  constructor(
    private readonly store: LocalStore,
    private readonly qvac: QvacRuntime
  ) {}

  async ingest(request: IngestRequest) {
    const started = Date.now();
    if (!request.content.trim()) throw new Error("Document content is empty.");

    const documentId = randomUUID();
    const rawChunks = chunkText(request.content);
    const chunks: ChunkRecord[] = [];

    for (let index = 0; index < rawChunks.length; index += 1) {
      const text = rawChunks[index];
      const embedding = await this.qvac.embed(text);
      chunks.push({
        id: `${documentId}:${index + 1}`,
        documentId,
        documentName: request.name,
        text,
        embedding
      });
    }

    const record = {
      id: documentId,
      name: request.name,
      type: request.name.toLowerCase().endsWith(".md") ? "text/markdown" as const : "text/plain" as const,
      createdAt: new Date().toISOString(),
      chunkCount: chunks.length,
      size: Buffer.byteLength(request.content, "utf8")
    };

    await this.store.addDocument(record, chunks);
    await appendEvidenceLog("ingest", {
      document: record,
      latencyMs: Date.now() - started,
      qvac: this.qvac.status
    });
    return record;
  }

  async ask(request: AskRequest): Promise<AnswerRecord> {
    const started = Date.now();
    const trace: TraceStep[] = [];
    const question = request.question.trim();
    if (!question) throw new Error("Question is required.");

    const intake = await timed("Intake Agent", "Classify request", async () => {
      return await this.qvac.complete([
        {
          role: "system",
          content:
            "Classify the user request for a local wellness document assistant. Return one short label: document_qa, summary, preparation_note, safety_sensitive, or out_of_scope."
        },
        { role: "user", content: `classify: ${question}` }
      ]);
    });
    trace.push(intake.step);

    const retrieval = await timed("Retriever Agent", "searchLocalDocs", async () => {
      const queryEmbedding = await this.qvac.embed(question);
      return this.store.searchByVector(queryEmbedding, request.topK ?? 4);
    });
    trace.push({
      ...retrieval.step,
      detail: `Retrieved ${retrieval.value.length} local chunks for ${intake.value.trim() || "document_qa"}.`
    });

    const answer = await timed("Answer Agent", "Draft grounded answer", async () => {
      return await this.qvac.complete([
        {
          role: "system",
          content:
            "You produce concise, source-grounded educational answers from local documents. Include inline source markers."
        },
        { role: "user", content: buildGroundedPrompt(question, retrieval.value) }
      ]);
    });
    trace.push(answer.step);

    const verifier = await timed("Verifier Agent", "Check sources and safety boundary", async () => {
      const deterministicFlags = [
        retrieval.value.length ? "sources_present" : "no_sources",
        /\[source\s+\d+(?:\]|:)/i.test(answer.value) ? "inline_citation_present" : "inline_citation_missing",
        /diagnos|prescrib|treatment plan/i.test(answer.value) ? "medical_claim_review" : "medical_boundary_ok"
      ];
      const qvacReview = await this.qvac.complete([
        {
          role: "system",
          content: "verify whether an answer is source-grounded and avoids diagnosis or treatment claims. Be brief."
        },
        { role: "user", content: `verify:\nQuestion: ${question}\nAnswer:\n${answer.value}` }
      ]);
      return { deterministicFlags, qvacReview };
    });
    trace.push({
      ...verifier.step,
      detail: `${verifier.value.deterministicFlags.join(", ")}. ${verifier.value.qvacReview}`.slice(0, 500)
    });

    const record: AnswerRecord = {
      id: randomUUID(),
      question,
      answer: answer.value,
      createdAt: new Date().toISOString(),
      latencyMs: Date.now() - started,
      sources: retrieval.value,
      trace,
      safety: {
        disclaimer: DISCLAIMER,
        flags: verifier.value.deterministicFlags
      }
    };

    await this.store.addAnswer(record);
    await appendEvidenceLog("ask", {
      answerId: record.id,
      question,
      latencyMs: record.latencyMs,
      trace,
      sourceCount: record.sources.length,
      qvac: this.qvac.status
    });
    return record;
  }
}

async function timed<T>(
  agent: TraceStep["agent"],
  label: string,
  fn: () => Promise<T>
): Promise<{ value: T; step: TraceStep }> {
  const started = Date.now();
  try {
    const value = await fn();
    return {
      value,
      step: {
        id: randomUUID(),
        agent,
        label,
        status: "complete",
        detail: summarize(value),
        latencyMs: Date.now() - started
      }
    };
  } catch (error) {
    throw error;
  }
}

function summarize(value: unknown) {
  if (typeof value === "string") return value.slice(0, 220);
  if (Array.isArray(value)) return `${value.length} item(s)`;
  return JSON.stringify(value).slice(0, 220);
}
