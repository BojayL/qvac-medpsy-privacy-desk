# Verification Checklist

- [ ] `@qvac/sdk` is installed.
- [ ] Final runtime dependencies were installed with `scripts/install-qvac-runtime.ps1`.
- [ ] `QVAC_RUNTIME_NODE_MODULES` points to the isolated runtime `node_modules`.
- [ ] Final run does not set `QVAC_ALLOW_MOCK=1`.
- [ ] QVAC model loads on consumer hardware.
- [ ] Embeddings are generated locally.
- [ ] Answers are generated locally.
- [ ] Local retrieval uses QVAC-generated embeddings only.
- [ ] Source snippets are shown.
- [ ] Agent trace is visible.
- [ ] Hardware status is recorded.
- [ ] Offline check is recorded.
- [ ] README setup works on a clean checkout.
- [ ] Repository is public.
- [ ] License is MIT.
