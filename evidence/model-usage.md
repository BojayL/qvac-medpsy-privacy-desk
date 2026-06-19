# Model Usage

Primary target:

- `qvac/MedPsy-1.7B-GGUF`

Fallback:

- Official QVAC SDK quickstart model such as `LLAMA_3_2_1B_INST_Q4_0`, only if MedPsy setup blocks final demo stability.

QVAC SDK usage:

- `loadModel` loads the local LLM.
- `loadModel` also loads `EMBEDDINGGEMMA_300M_Q4_0` as the local embedding model unless overridden.
- `completion` performs intake classification, answer drafting, and verifier review.
- `embed` generates local embeddings for document chunks and questions.
- Local retrieval uses those QVAC-generated embeddings with deterministic cosine similarity over a local JSON vector store.

No OpenAI, Anthropic, cloud embedding, or hosted vector database dependency is used.
