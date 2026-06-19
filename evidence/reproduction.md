# Reproduction

1. Install Node.js 22.17 or newer.
2. Clone the public repository.
3. Run `npm install`.
4. For final QVAC inference on Windows, run:

```powershell
.\scripts\install-qvac-runtime.ps1 -RuntimeDir C:\qvac-full-runtime -Flavor full
$env:QVAC_RUNTIME_NODE_MODULES="C:\qvac-full-runtime\node_modules"
$env:QVAC_SDK_FLAVOR="full"
```
5. Configure QVAC model environment variables if needed:

```powershell
$env:QVAC_LLM_MODEL="C:\qvac-models\MedPsy-1.7B-Q4_K_M.gguf"
$env:QVAC_EMBEDDING_MODEL="EMBEDDINGGEMMA_300M_Q4_0"
```

For a stable fallback demo, set `$env:QVAC_LLM_MODEL="LLAMA_3_2_1B_INST_Q4_0"` after the official model is downloaded or cached. The MedPsy repository name alone is not a model file path; download a GGUF first when using MedPsy.

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

```powershell
$env:QVAC_ALLOW_MOCK="1"
npm run dev
```

Mock mode is not acceptable as final inference evidence.
