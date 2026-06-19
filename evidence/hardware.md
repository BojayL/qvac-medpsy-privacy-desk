# Hardware Evidence

Primary inference machine:

- OS: Windows_NT 10.0.26200 x64.
- GPU: NVIDIA GeForce RTX 5060, 8151 MiB, driver 591.86.
- Memory: 31.9 GB RAM.
- Node.js: v24.16.0.
- Role: QVAC local inference and RAG runtime.

Development and documentation machine:

- macOS development workstation.
- Role: frontend development, documentation, GitHub publishing, and remote control.

Final evidence includes:

- Production API status reported the RTX 5060 hardware label from `http://192.168.50.223:8787/api/status`.
- `@qvac/sdk@0.13.5` installed in `C:\qvac-full-runtime`.
- Local models stored in `C:\qvac-models`.
- App startup logs in `evidence/logs/windows-real-server.out.log` and `evidence/logs/windows-real-server.err.log`.
