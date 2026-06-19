# Model Usage

Primary target:

- MedPsy 1.7B GGUF loaded from a local `.gguf` file path, for example `C:\qvac-models\MedPsy-1.7B-Q4_K_M.gguf`.

Fallback:

- Official QVAC SDK quickstart model such as `LLAMA_3_2_1B_INST_Q4_0`, only if MedPsy setup blocks final demo stability.

Windows runtime validation:

- Full `@qvac/sdk@0.13.5` installed in an isolated runtime directory starts the Bare worker successfully.
- The MedPsy Hugging Face repository name is not passed directly to `loadModel`; the SDK expects a concrete model source such as a local GGUF path.
- The official quickstart model descriptor began downloading from the QVAC registry, but the initial run timed out during the large GGUF download. The next final run should use already-downloaded local model files when possible.

QVAC SDK usage:

- `loadModel` loads the local LLM.
- `loadModel` also loads `EMBEDDINGGEMMA_300M_Q4_0` as the local embedding model unless overridden.
- `completion` performs intake classification, answer drafting, and verifier review.
- `embed` generates local embeddings for document chunks and questions.
- Local retrieval uses those QVAC-generated embeddings with deterministic cosine similarity over a local JSON vector store.

No OpenAI, Anthropic, cloud embedding, or hosted vector database dependency is used.
