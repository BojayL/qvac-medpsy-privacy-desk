# Reproduction

1. Install Node.js 22.17 or newer.
2. Clone the public repository.
3. Run `npm install`.
4. For final QVAC inference, run `npm install @qvac/sdk b4a --save`.
5. Configure QVAC model environment variables if needed:

```bash
export QVAC_LLM_MODEL="qvac/MedPsy-1.7B-GGUF"
export QVAC_EMBEDDING_MODEL="qvac/MedPsy-1.7B-GGUF"
```

6. Seed local sample documents:

```bash
npm run seed
```

7. Start the app:

```bash
npm run dev
```

8. Open `http://localhost:5173`.
9. Ask a source-grounded question.
10. Inspect `evidence/logs/orchestration.ndjson`.

Development-only mock mode:

```bash
QVAC_ALLOW_MOCK=1 npm run dev
```

Mock mode is not acceptable as final inference evidence.
