import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrivacyDeskOrchestrator } from "./orchestrator.js";
import { QvacRuntime } from "./qvac.js";
import { LocalStore } from "./storage.js";

const store = new LocalStore();
await store.load();

const qvac = new QvacRuntime({
  llmModel: process.env.QVAC_LLM_MODEL ?? "qvac/MedPsy-1.7B-GGUF",
  embeddingModel: process.env.QVAC_EMBEDDING_MODEL ?? "EMBEDDINGGEMMA_300M_Q4_0",
  allowMock: process.env.QVAC_ALLOW_MOCK === "1"
});
const orchestrator = new PrivacyDeskOrchestrator(store, qvac);

try {
  for (const fileName of ["appointment-prep.md", "sleep-hygiene.md", "stress-grounding.md"]) {
    const content = await readFile(path.join(process.cwd(), "examples", "sample-docs", fileName), "utf8");
    const document = await orchestrator.ingest({ name: fileName, content });
    process.stdout.write(`Indexed ${document.name} (${document.chunkCount} chunks)\n`);
  }
} finally {
  await qvac.unload();
}
