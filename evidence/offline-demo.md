# Offline Demo Protocol

Goal: demonstrate local-first operation after dependencies and models are installed.

1. Start the app while online.
2. Confirm the QVAC model is loaded locally.
3. Index sample private documents.
4. Ask one question and confirm source snippets.
5. Disable network access.
6. Ask a second question from the indexed corpus.
7. Click Offline check in the UI.
8. Save logs and screenshots in `evidence/logs` and `evidence/screenshots`.

Expected result: the app continues to answer from local documents without cloud inference, hosted embeddings, or hosted vector databases.
