import { PrivacyDeskOrchestrator } from "./orchestrator.js";
import { QvacRuntime } from "./qvac.js";
import { LocalStore } from "./storage.js";

const store = new LocalStore();
await store.load();
const qvac = new QvacRuntime({
  llmModel: process.env.QVAC_LLM_MODEL ?? "qvac/MedPsy-1.7B-GGUF",
  embeddingModel: process.env.QVAC_EMBEDDING_MODEL ?? "qvac/MedPsy-1.7B-GGUF",
  allowMock: process.env.QVAC_ALLOW_MOCK === "1"
});
const orchestrator = new PrivacyDeskOrchestrator(store, qvac);

const answer = await orchestrator.ask({
  question: process.argv.slice(2).join(" ") || "What should I prepare before a wellness appointment?",
  topK: 3
});

process.stdout.write(JSON.stringify(answer, null, 2));
process.stdout.write("\n");
