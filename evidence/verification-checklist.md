# Verification Checklist

- [x] `@qvac/sdk` is installed.
- [x] Final runtime dependencies were installed with `scripts/install-qvac-runtime.ps1`.
- [x] `QVAC_RUNTIME_NODE_MODULES` points to the isolated runtime `node_modules`.
- [x] `QVAC_SDK_FLAVOR=full` is set for the Node app.
- [x] MedPsy is configured as a local GGUF path, or the quickstart fallback model is fully downloaded and cached.
- [x] Final run does not set `QVAC_ALLOW_MOCK=1`.
- [x] QVAC model loads on consumer hardware.
- [x] Embeddings are generated locally.
- [x] Answers are generated locally.
- [x] Local retrieval uses QVAC-generated embeddings only.
- [x] Source snippets are shown.
- [x] Agent trace is visible.
- [x] Hardware status is recorded.
- [x] Offline check is recorded.
- [x] README setup works on a clean checkout.
- [x] Repository is public.
- [x] License is MIT.
