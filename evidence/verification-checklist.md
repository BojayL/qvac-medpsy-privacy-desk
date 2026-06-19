# Verification Checklist

- [ ] `@qvac/sdk` is installed.
- [ ] Final runtime dependencies were installed with `npm install @qvac/sdk b4a --save`.
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
