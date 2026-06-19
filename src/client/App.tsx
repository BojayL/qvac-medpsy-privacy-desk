import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Download,
  FileText,
  HardDrive,
  Play,
  ShieldCheck,
  Upload
} from "lucide-react";
import type { AnswerRecord, DocumentRecord, RuntimeStatus } from "../shared/types";

const SAMPLE_QUESTION = "What should I prepare before a wellness appointment, based only on my local notes?";

type DocumentsPayload = {
  documents: DocumentRecord[];
  answers: AnswerRecord[];
};

export function App() {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [question, setQuestion] = useState(SAMPLE_QUESTION);
  const [draftName, setDraftName] = useState("private-note.md");
  const [draftContent, setDraftContent] = useState("");
  const [activeAnswer, setActiveAnswer] = useState<AnswerRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedAnswer = activeAnswer ?? answers[0] ?? null;

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    const [statusData, docsData] = await Promise.all([
      api<RuntimeStatus>("/api/status"),
      api<DocumentsPayload>("/api/documents")
    ]);
    setStatus(statusData);
    setDocuments(docsData.documents);
    setAnswers(docsData.answers);
  }

  async function ingestDraft() {
    setBusy(true);
    setNotice("");
    try {
      await api("/api/ingest", {
        method: "POST",
        body: JSON.stringify({ name: draftName, content: draftContent })
      });
      setDraftContent("");
      setNotice("Document indexed locally.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function ask() {
    setBusy(true);
    setNotice("");
    try {
      const payload = await api<{ answer: AnswerRecord }>("/api/ask", {
        method: "POST",
        body: JSON.stringify({ question, topK: 4 })
      });
      setActiveAnswer(payload.answer);
      setNotice("Local QVAC workflow complete.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function exportBrief(answerId: string) {
    const payload = await api<{ filePath: string }>(`/api/export/${answerId}`, { method: "POST" });
    setNotice(`Brief exported to ${payload.filePath}`);
  }

  async function offlineCheck() {
    await api("/api/offline-check", { method: "POST" });
    setNotice("Offline/local evidence check recorded.");
  }

  async function loadFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setDraftName(file.name);
    setDraftContent(await file.text());
  }

  const runtimeTone = useMemo(() => {
    if (!status) return "pending";
    if (status.qvacMode === "qvac") return "good";
    if (status.qvacMode === "mock") return "warn";
    return "bad";
  }, [status]);

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">QVAC Hackathon I / General Purpose</p>
          <h1>QVAC MedPsy Privacy Desk</h1>
        </div>
        <div className={`runtime-pill ${runtimeTone}`}>
          <ShieldCheck size={18} />
          <span>{status?.qvacMode ?? "checking"}</span>
        </div>
      </header>

      <section className="status-grid" aria-label="Runtime status">
        <StatusTile icon={<Cpu />} label="Runtime" value={status?.llmModel ?? "QVAC model pending"} />
        <StatusTile icon={<HardDrive />} label="Hardware" value={status?.hardwareLabel ?? "Checking local machine"} />
        <StatusTile icon={<FileText />} label="Corpus" value={`${status?.documents ?? 0} docs / ${status?.chunks ?? 0} chunks`} />
        <StatusTile icon={<Activity />} label="Evidence" value="logs, hardware, offline checks" />
      </section>

      <section className="safety-strip">
        <AlertTriangle size={18} />
        <span>Educational document Q&A only. Not diagnosis, treatment, crisis response, or professional medical advice.</span>
      </section>

      <div className="main-grid">
        <section className="ingest-panel" aria-label="Document ingestion">
          <div className="panel-heading">
            <h2>Private Documents</h2>
            <label className="icon-button" title="Upload a local markdown or text file">
              <Upload size={18} />
              <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => void loadFiles(event.target.files)} />
            </label>
          </div>
          <input value={draftName} onChange={(event) => setDraftName(event.target.value)} aria-label="Document name" />
          <textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            placeholder="Paste private wellness notes, appointment prep, or health education excerpts."
            aria-label="Document content"
          />
          <button className="primary" onClick={() => void ingestDraft()} disabled={busy || !draftContent.trim()}>
            <Upload size={17} />
            Index with QVAC embeddings
          </button>

          <div className="document-list">
            {documents.map((document) => (
              <article key={document.id} className="document-row">
                <FileText size={17} />
                <div>
                  <strong>{document.name}</strong>
                  <span>{document.chunkCount} chunks / {Math.round(document.size / 1024 * 10) / 10} KB</span>
                </div>
              </article>
            ))}
            {!documents.length && <p className="empty">No documents indexed yet.</p>}
          </div>
        </section>

        <section className="ask-panel" aria-label="Local QVAC question answering">
          <div className="panel-heading">
            <h2>Source-Grounded Question</h2>
            <button className="secondary" onClick={() => void offlineCheck()}>
              <CheckCircle2 size={17} />
              Offline check
            </button>
          </div>
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} aria-label="Question" />
          <button className="primary ask-button" onClick={() => void ask()} disabled={busy || !question.trim()}>
            <Play size={18} />
            Run local workflow
          </button>

          {notice && <p className="notice">{notice}</p>}

          {selectedAnswer ? (
            <article className="answer-block">
              <div className="answer-meta">
                <span>{selectedAnswer.latencyMs} ms</span>
                <button className="ghost" onClick={() => void exportBrief(selectedAnswer.id)} title="Export brief">
                  <Download size={17} />
                </button>
              </div>
              <p>{selectedAnswer.answer}</p>
            </article>
          ) : (
            <div className="answer-placeholder">Ask a question after indexing local notes.</div>
          )}
        </section>

        <section className="trace-panel" aria-label="Workflow trace">
          <h2>Agent and Tool Trace</h2>
          <div className="trace-list">
            {(selectedAnswer?.trace ?? []).map((step) => (
              <article key={step.id} className={`trace-step ${step.status}`}>
                <div>
                  <strong>{step.agent}</strong>
                  <span>{step.label}</span>
                </div>
                <p>{step.detail}</p>
                <small>{step.latencyMs ?? 0} ms</small>
              </article>
            ))}
            {!selectedAnswer && <p className="empty">Trace appears after route to retrieve to answer to verify.</p>}
          </div>
        </section>

        <section className="sources-panel" aria-label="Local source snippets">
          <h2>Local Sources</h2>
          <div className="sources-list">
            {(selectedAnswer?.sources ?? []).map((source, index) => (
              <article key={source.chunkId} className="source-card">
                <div>
                  <strong>Source {index + 1}</strong>
                  <span>{source.documentName} / score {source.score.toFixed(3)}</span>
                </div>
                <p>{source.text}</p>
              </article>
            ))}
            {!selectedAnswer?.sources.length && <p className="empty">Retrieved snippets will stay local and appear here.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusTile({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return (
    <article className="status-tile">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...init
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Request failed");
  return payload as T;
}
