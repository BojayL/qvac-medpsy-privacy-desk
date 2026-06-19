# QVAC MedPsy Privacy Desk

A fully local, privacy-preserving wellness document workspace for private note ingestion, local RAG, source-grounded answers, and lightweight multi-agent review powered by QVAC on consumer hardware.

This project targets **QVAC Hackathon I / General Purpose**. It is not a diagnosis or treatment tool.

## What It Demonstrates

- Local `.txt` and `.md` document ingestion.
- Embeddings generated through `@qvac/sdk`.
- Local vector retrieval over private chunks using QVAC-generated embeddings.
- Answers generated through `@qvac/sdk`, with source snippets shown in the UI.
- Visible workflow trace: Intake Agent -> Retriever Agent -> Answer Agent -> Verifier Agent.
- Local tool calls: `searchLocalDocs`, `showSources`, `exportBrief`, `hardwareStatus`, and `offlineCheck`.
- Evidence bundle for hardware, reproduction, performance, offline operation, and model usage.

## Safety Boundary

QVAC MedPsy Privacy Desk is for educational private document Q&A only. It does not diagnose, prescribe treatment, replace clinicians, provide crisis response, or offer professional medical advice.

## Architecture

```text
Browser UI
  |
  | HTTP /api
  v
Node.js local app server
  |
  +--> @qvac/sdk loadModel / completion / embed
  +--> local chunk store and vector retrieval
  +--> evidence logs and exported briefs
```

The project does not use cloud inference, hosted embeddings, hosted vector databases, or external LLM APIs.

## Requirements

- Node.js 22.17 or newer.
- npm 10.9 or newer.
- Consumer hardware capable of running a QVAC local model.
- QVAC SDK model access and runtime dependencies.

The planned primary demo machine is a Windows desktop with an NVIDIA GeForce RTX 5060.

## Setup

Install the app shell and local workflow dependencies:

```bash
npm install
```

Enable final local QVAC inference:

```bash
npm install @qvac/sdk b4a @qvac/llm-llamacpp @qvac/embed-llamacpp --save
```

Seed sample local documents:

```bash
QVAC_ALLOW_MOCK=1 npm run seed
```

For real submission runs, do not use mock mode. Configure QVAC model sources if needed:

```bash
export QVAC_LLM_MODEL="qvac/MedPsy-1.7B-GGUF"
export QVAC_EMBEDDING_MODEL="qvac/MedPsy-1.7B-GGUF"
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
npm start
```

## Verification Workflow

1. Start the app on the local machine.
2. Index the sample documents or your own private `.md` / `.txt` notes.
3. Ask a question.
4. Confirm the UI shows retrieved local source snippets.
5. Confirm the trace shows intake, retrieval, answer, and verifier steps.
6. Click Offline check.
7. Review `evidence/logs/orchestration.ndjson`.
8. Disconnect network and repeat a local query after the QVAC model is available locally.

## Evidence Bundle

- `evidence/hardware.md`: machine and runtime proof.
- `evidence/reproduction.md`: setup and reproduction notes.
- `evidence/offline-demo.md`: offline demo protocol.
- `evidence/model-usage.md`: QVAC SDK and model usage.
- `evidence/performance.md`: latency and run notes.
- `evidence/verification-checklist.md`: final submission checklist.
- `evidence/logs/`: runtime orchestration logs.

## Known Limitations

- PDF ingestion is not included in the core demo.
- The current local vector store is intentionally simple and transparent; embeddings and answer generation remain QVAC-powered through `@qvac/sdk`.
- `@qvac/rag` was evaluated, but its current HyperDB/RocksDB dependency path made Windows installation less reliable for the demo machine. A future adapter can replace the transparent JSON vector store after the core QVAC SDK path is stable.
- `@qvac/sdk` is installed as an explicit final-runtime step because its native runtime packages can be slow or network-sensitive on fresh Windows machines.
- `QVAC_ALLOW_MOCK=1` exists only to develop and test the interface without a loaded model. It must be disabled for final judging evidence.

## License

MIT
