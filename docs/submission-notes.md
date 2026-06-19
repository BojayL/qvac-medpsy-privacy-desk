# Submission Notes

Track: General Purpose

Core claim: QVAC MedPsy Privacy Desk lets users query private wellness notes locally, with QVAC-powered embeddings and answer generation, no cloud inference, local source citations, and visible evidence logs.

Submission checklist:

- Public GitHub repository: `https://github.com/BojayL/qvac-medpsy-privacy-desk`.
- MIT license.
- README with setup, run, and verification steps.
- Hardware proof for the Windows RTX 5060 machine.
- Demo video showing local inference and source-grounded answers.
- Offline check evidence.
- Clear medical safety disclaimer.
- No cloud LLM API keys or hosted vector database dependency.

Final validated demo path:

- Full `@qvac/sdk@0.13.5` runtime in `C:\qvac-full-runtime`.
- Local MedPsy GGUF: `C:\qvac-models\medpsy-1.7b-q4_k_m-imat.gguf`.
- Local embedding GGUF: `C:\qvac-models\embeddinggemma-300m-Q4_0.gguf`.
- Production API endpoint: `http://192.168.50.223:8787`.
- Final `/api/ask` latency: 10,715 ms with source citations and safety verifier flags green.
