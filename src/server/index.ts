import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AskRequest, IngestRequest, RuntimeStatus } from "../shared/types.js";
import { PrivacyDeskOrchestrator } from "./orchestrator.js";
import { QvacRuntime } from "./qvac.js";
import { LocalStore } from "./storage.js";
import { hardwareLabel, hardwareStatus } from "./hardware.js";
import { appendEvidenceLog } from "./logger.js";

const port = Number(process.env.PORT ?? 8787);
const store = new LocalStore();
const qvac = new QvacRuntime({
  llmModel: process.env.QVAC_LLM_MODEL ?? "qvac/MedPsy-1.7B-GGUF",
  embeddingModel: process.env.QVAC_EMBEDDING_MODEL ?? "EMBEDDINGGEMMA_300M_Q4_0",
  allowMock: process.env.QVAC_ALLOW_MOCK === "1"
});
const orchestrator = new PrivacyDeskOrchestrator(store, qvac);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const distDir = path.join(projectRoot, "dist");

await store.load();

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(url.pathname, res);
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`QVAC MedPsy Privacy Desk listening on http://127.0.0.1:${port}\n`);
});

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (req.method === "GET" && url.pathname === "/api/status") {
    const counts = store.counts();
    const label = await hardwareLabel();
    const status: RuntimeStatus = {
      ok: qvac.status.qvacMode !== "unavailable",
      ...qvac.status,
      hardwareLabel: label,
      nodeVersion: process.version,
      platform: process.platform,
      documents: counts.documents,
      chunks: counts.chunks,
      message:
        qvac.status.qvacMode === "mock"
          ? "Mock mode enabled. Use @qvac/sdk before submission."
          : "Local QVAC runtime status is reported by the server."
    };
    sendJson(res, 200, status);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/documents") {
    sendJson(res, 200, { documents: store.listDocuments(), answers: store.latestAnswers() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/hardware") {
    const status = await hardwareStatus();
    await appendEvidenceLog("hardwareStatus", status);
    sendJson(res, 200, status);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ingest") {
    const body = await readJson<IngestRequest>(req);
    const document = await orchestrator.ingest(body);
    sendJson(res, 200, { document });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ask") {
    const body = await readJson<AskRequest>(req);
    const answer = await orchestrator.ask(body);
    sendJson(res, 200, { answer });
    return;
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/export/")) {
    const answerId = decodeURIComponent(url.pathname.replace("/api/export/", ""));
    const answer = store.getAnswer(answerId);
    if (!answer) {
      sendJson(res, 404, { error: "Answer not found" });
      return;
    }
    const fileName = `brief-${answer.id}.md`;
    const filePath = path.join(store.rootDir, fileName);
    await writeFile(filePath, renderBrief(answer), "utf8");
    await appendEvidenceLog("exportBrief", { answerId, filePath });
    sendJson(res, 200, { filePath });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/offline-check") {
    const payload = {
      ts: new Date().toISOString(),
      note: "Manual offline/local check recorded from the UI.",
      qvac: qvac.status
    };
    await appendEvidenceLog("offlineCheck", payload);
    sendJson(res, 200, payload);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

async function readJson<T>(req: IncomingMessage) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}") as T;
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

async function serveStatic(pathname: string, res: ServerResponse) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(distDir, normalized);
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    res.writeHead(200, { "content-type": contentType(filePath) });
    res.end(await readFile(filePath));
  } catch {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(await readFile(path.join(distDir, "index.html"), "utf8"));
  }
}

function contentType(filePath: string) {
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "text/plain; charset=utf-8";
}

function renderBrief(answer: { question: string; answer: string; sources: { documentName: string; text: string }[] }) {
  return [
    "# QVAC MedPsy Privacy Desk Brief",
    "",
    `Question: ${answer.question}`,
    "",
    "## Answer",
    "",
    answer.answer,
    "",
    "## Local Sources",
    "",
    ...answer.sources.map((source, index) => `### Source ${index + 1}: ${source.documentName}\n\n${source.text}`)
  ].join("\n");
}
