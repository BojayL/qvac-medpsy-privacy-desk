# Architecture

QVAC MedPsy Privacy Desk is a local web application with a browser UI and a Node.js server. The server owns all document ingestion, embeddings, retrieval, answer generation, and evidence logging.

## Components

- Browser UI: operational dashboard for ingestion, asking questions, reviewing sources, and recording offline checks.
- Local App Server: HTTP API, orchestration, local tools, evidence logs.
- QVAC Runtime Adapter: wraps `@qvac/sdk` `loadModel`, `completion`, and `embed`.
- Local Store: JSON-backed local corpus, chunks, QVAC-generated embeddings, and recent answers.
- Evidence Bundle: markdown files and NDJSON logs for reproducibility.

## Agent Flow

1. Intake Agent classifies the request.
2. Retriever Agent calls `searchLocalDocs` over local chunks.
3. Answer Agent drafts a grounded response from retrieved snippets.
4. Verifier Agent checks citations and safety boundaries.

All classification, answer drafting, verification, and embeddings are intended to run through QVAC. Mock mode is development-only.
