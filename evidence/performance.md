# Performance Notes

Record final run measurements here.

Suggested table:

| Run | Machine | Model | Docs | Chunks | Query | Latency |
| --- | --- | --- | ---: | ---: | --- | ---: |
| 1 | Windows RTX 5060 | QVAC mock mode | 3 | 13 | appointment prep | API reachable from LAN |
| 2 | Windows RTX 5060 | `LLAMA_3_2_1B_INST_Q4_0` | TBD | TBD | appointment prep | SDK worker started; registry GGUF download timed out before inference |
| 3 | Windows RTX 5060 | local MedPsy GGUF or cached quickstart GGUF | TBD | TBD | appointment prep | TBD |

The app logs per-agent latency in `evidence/logs/orchestration.ndjson`.
