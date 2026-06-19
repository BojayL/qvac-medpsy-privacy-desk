# Performance Notes

| Run | Machine | Model | Docs | Chunks | Query | Latency |
| --- | --- | --- | ---: | ---: | --- | ---: |
| 1 | Windows RTX 5060 | QVAC mock mode | 3 | 13 | appointment prep | API reachable from LAN |
| 2 | Windows RTX 5060 | `LLAMA_3_2_1B_INST_Q4_0` | TBD | TBD | appointment prep | SDK worker started; registry GGUF download timed out before inference |
| 3 | Windows RTX 5060 | local MedPsy 1.7B GGUF + local embeddinggemma 300M GGUF | 3 | 13 | appointment prep | 10,715 ms via production `/api/ask` |

The app logs per-agent latency in `evidence/logs/orchestration.ndjson`.

Final production API result:

- `qvacMode`: `standby` before first query, then lazy-loads local models.
- Retrieval scores after real QVAC embedding seed: `0.7577`, `0.6696`, `0.5756`.
- Safety flags: `sources_present`, `inline_citation_present`, `medical_boundary_ok`.
