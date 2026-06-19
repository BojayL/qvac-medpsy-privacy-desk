# QVAC Hackathon I Project Plan

## 1. Project Overview

### Hackathon Context

QVAC Hackathon I - Unleash Edge AI is a local-first AI hackathon organized by the QVAC team at Tether. The build period runs from June 1 to June 21, 2026, with winners announced on July 3, 2026.

The hackathon asks builders to demonstrate that edge AI applications can run entirely on consumer hardware with privacy, speed, resilience, and cost advantages over centralized cloud AI providers.

Prize structure:

- Global 1st place: USDT 5,000 per team.
- Global 2nd place: USDT 3,500 per team.
- Global 3rd place: USDT 2,000 per team.
- Track 1st place: USDT 1,500 per team.
- Track honor prize: USDT 800 per team.

Mandatory requirements:

- All AI inference and RAG must use the QVAC SDK: `@qvac/sdk`.
- The project must follow participant and hardware constraints for one of the tracks: General Purpose, Tinkerer, or Mobile.
- The project must run on consumer hardware, not a datacenter or inference cluster.
- The application must have zero cloud inference dependencies.
- The project must be fully open-source under MIT or Apache 2.0.
- The repository must include full reproducibility instructions and hardware setup.
- The submission must include complete artifacts: logs, demo video, hardware proof, and related verification materials.
- The team must join the QVAC Discord community.

Judging criteria:

- Early Bird Bonus: only for submissions before June 17. This is no longer available because today is June 19, 2026.
- Innovation: novel edge/P2P AI applications.
- Capabilities: multi-agent workflows with orchestration and tool calling.
- Artifact Quality: consistency of logs, resources, and demo.
- Performance: optimization, P2P load distribution, constrained-device handling, speed, and reliability.
- Complexity & UX: advanced features and real-world usability.
- Model Usage & Coverage: creative use of QVAC Psy models.
- Social Engagement bonus: recognition for building in public.
- Community voting: Discord/Keet crowd voting during the evaluation period.

Available hardware:

- Mac: development machine, frontend/testing machine, documentation and submission work.
- Windows desktop with RTX 5060: primary local inference machine.

Main hardware implication:

- The RTX 5060 is suitable for small or quantized local models, embeddings, lightweight RAG, and possibly small multimodal workloads.
- The project should avoid large-model training, large multimodal models, and anything requiring high VRAM.

### Proposed Project

Project name:

**QVAC MedPsy Privacy Desk**

One-line description:

**A fully local, privacy-preserving mental-health and wellness knowledge workspace for private document ingestion, local RAG, source-grounded answers, and lightweight multi-agent review, powered entirely by QVAC on consumer hardware.**

Core idea:

Users can drop private wellness notes, therapy preparation notes, health education documents, or markdown/text resources into a local app, index them locally, and ask grounded questions without sending sensitive data to any cloud service. The app demonstrates that sensitive health-adjacent personal data can be processed with local-first AI using QVAC.

Important safety boundary:

- This is not a diagnosis or treatment tool.
- It should not claim to replace clinicians, therapists, emergency services, or professional medical advice.
- The demo should frame outputs as educational summaries and private document Q&A.
- The app should include crisis and medical disclaimers where relevant.

The project should demonstrate:

- Local document ingestion.
- Local embeddings and RAG through QVAC SDK / QVAC RAG components.
- Local answer generation through QVAC SDK.
- Creative use of QVAC MedPsy models where practical, especially `qvac/MedPsy-1.7B-GGUF` or `qvac/MedPsy-4B-GGUF`.
- Lightweight local multi-agent orchestration: intake/router, retriever, answer drafter, and safety/source verifier.
- Local tool calling for non-AI tools such as `searchLocalDocs`, `showSources`, `exportBrief`, `hardwareStatus`, and `offlineCheck`.
- A simple dashboard showing indexed documents, source-grounded answers, latency, model name, hardware/runtime evidence, and offline/local status.
- Offline operation after dependencies and models are installed.
- Reproducible setup on consumer hardware.

Target track:

- Primary target: General Purpose track.
- Status: confirmed by the user as having no restrictions that block the current Mac + Windows RTX 5060 plan.
- Reason: the planned demo uses a Mac plus Windows RTX 5060 consumer desktop and focuses on a practical local-first desktop/web application.
- Secondary positioning: if track descriptions allow it, mention constrained-device readiness through small Psy models and CPU fallback, but do not claim Mobile or Tinkerer unless we actually run on that hardware.

### Why This Scope Is Practical

The build period ends on June 21, 2026, and today is June 19, 2026, so the project must be narrow and reliable.

This scope is intentionally focused because:

- It directly matches the hackathon's local-first and privacy-preserving theme.
- It uses the official QVAC SDK surface and QVAC RAG capability instead of a generic local AI stack.
- It can use the QVAC MedPsy collection, which directly supports the Model Usage & Coverage criterion.
- It covers Capabilities with a small but real multi-agent/tool-calling workflow.
- It avoids risky fine-tuning, large model training, and heavy multimodal workloads.
- It can produce strong evidence quickly: network-off demo, local inference logs, latency metrics, and reproducibility steps.
- It gives judges a concrete application rather than only a technical experiment.

### Target User Story

A user has private wellness notes, appointment preparation notes, mental-health education material, PDFs, markdown files, or text documents that they do not want to upload to a cloud AI provider. They run QVAC MedPsy Privacy Desk on their own laptop or desktop, import the documents locally, and ask questions against the private corpus. The application answers using local QVAC inference only and cites local source snippets.

Example demo scenario:

1. Start the app on the Windows RTX 5060 machine.
2. Open the web UI from the Mac or local browser.
3. Import a small private document set.
4. Ask questions about the documents.
5. Show the multi-step local workflow: route request, retrieve context, draft answer, verify source grounding/safety.
6. Show answers with retrieved source snippets.
7. Disconnect the internet.
8. Ask another question successfully.
9. Show that inference is still running locally through QVAC SDK logs and system monitoring.

## 2. Implementation Plan

### Guiding Priorities

Because the remaining timeline is short, priorities are:

1. Make `@qvac/sdk` run locally first.
2. Make QVAC RAG work locally through SDK-compatible components.
3. Build the smallest complete end-to-end workflow.
4. Add a minimal multi-agent/tool-calling layer to satisfy the Capabilities criterion.
5. Add visible evidence that all inference and RAG are local.
6. Write strong documentation and reproducibility instructions.
7. Avoid optional features unless the core path is already stable.

### Minimum Viable Demo

The minimum viable submission should include:

- A local web app.
- A local Node/TypeScript service using `@qvac/sdk`.
- RAG implemented through QVAC SDK and/or QVAC RAG package components.
- Document upload/import for `.txt` and `.md` files.
- Local chunking and indexing.
- Local embedding generation through QVAC.
- Local retrieval.
- Local answer generation through QVAC.
- Display of source snippets.
- A visible local orchestration trace showing route -> retrieve -> answer -> verify.
- A small set of local tools called by the orchestrator.
- Basic latency logging.
- README with setup and reproduction commands.
- Evidence bundle folder.

### Official QVAC Capabilities Confirmed

From the official QVAC repository and package READMEs:

- `@qvac/sdk` is the canonical SDK and runs on Node.js, Bare runtime, and Expo.
- The SDK exposes local LLM completion, text embeddings, translation, transcription, TTS, OCR, image generation, fine-tuning, multimodal inference, RAG, P2P delegated inference, model fetching, blind relays, logging, and download lifecycle utilities.
- The SDK quickstart installs with `npm install @qvac/sdk` and loads a local LLM model through `loadModel`, then calls `completion`.
- `@qvac/rag` provides document ingestion, chunking, embedding generation, vector search, `search`, `infer`, reindexing, deletion, and QVAC runtime LLM adapter support.
- The SDK examples include `quickstart.ts`, `rag`, `delegated-inference`, `tools`, `ocr-fasttext.ts`, logging examples, and multimodal/VLA examples.
- The QVAC MedPsy Hugging Face collection is described as SOTA medical and healthcare text-only small language models for edge deployment and includes:
  - `qvac/MedPsy-1.7B`
  - `qvac/MedPsy-1.7B-GGUF`
  - `qvac/MedPsy-4B`
  - `qvac/MedPsy-4B-GGUF`

### Model Strategy

Primary model target:

- `qvac/MedPsy-1.7B-GGUF`

Reason:

- It is the smallest QVAC MedPsy model in the provided collection.
- It is more likely to run reliably on consumer hardware and within limited VRAM.
- It directly supports the Model Usage & Coverage criterion.

Secondary model target:

- `qvac/MedPsy-4B-GGUF`

Use only if:

- The RTX 5060 machine can run it with acceptable latency.
- Setup does not consume too much remaining time.
- The 1.7B model is already working.

Fallback model:

- Official SDK quickstart model constant such as `LLAMA_3_2_1B_INST_Q4_0`, if MedPsy setup blocks the core demo.

Fallback positioning:

- If MedPsy model loading fails, the project should still demonstrate QVAC local RAG and include MedPsy integration as documented work-in-progress. However, for scoring, using at least one Psy model is strongly preferred.

### Multi-Agent and Tool-Calling Design

The app should not attempt a complex autonomous agent system. It should implement a small deterministic local orchestration workflow that is visible in the UI and evidence logs.

Local agents:

1. **Intake Agent**
   - Classifies the user's request as document Q&A, summary, preparation note, safety-sensitive request, or out-of-scope medical request.
   - Uses QVAC completion.

2. **Retriever Agent**
   - Calls local RAG search over indexed private documents.
   - Uses QVAC embeddings/RAG.

3. **Answer Agent**
   - Generates a source-grounded answer using retrieved snippets.
   - Uses QVAC completion, preferably MedPsy.

4. **Verifier Agent**
   - Checks whether the answer cites local sources and avoids diagnosis/treatment claims.
   - Uses QVAC completion or deterministic checks if time is short.

Local tools:

- `searchLocalDocs(query, topK)`: queries the local vector store.
- `showSources(answerId)`: returns cited snippets and local document metadata.
- `exportBrief(answerId)`: writes a markdown summary to local disk.
- `hardwareStatus()`: collects OS, CPU/GPU/RAM, Node, QVAC package versions.
- `offlineCheck()`: records local network/offline demo state.

Tool-calling rule:

- Tool calls are local application functions.
- Any AI inference used to decide, summarize, classify, answer, or verify must go through QVAC.
- No cloud search or cloud LLM tool may be used.

### Stretch Features

Only add these if the core app is done:

- PDF ingestion.
- Image/OCR or multimodal input if QVAC examples support it cleanly.
- P2P model sharing or delegated compute if the SDK examples are easy to reuse.
- Local model selection.
- Exportable audit log.
- A public demo video with side-by-side network monitor and app behavior.

### Recommended Architecture

Preferred architecture:

```text
Browser UI
  |
  | HTTP
  v
Local App Server
  |
  | @qvac/sdk + @qvac/rag
  v
Local QVAC Inference Runtime
  |
  +--> Local MedPsy / small LLM model
  +--> Local embedding model
  +--> Local RAG vector store
  +--> Local documents and evidence logs
```

Suggested implementation stack:

- Frontend: Vite + React or Next.js.
- Backend: Node.js/TypeScript.
- Core AI: `@qvac/sdk`.
- RAG: QVAC RAG package/components where practical.
- Storage: local filesystem plus QVAC RAG/HyperDB adapter or a minimal local vector store if the SDK example supports it.
- License: MIT or Apache 2.0.

Important rule:

All AI inference and RAG must go through QVAC SDK and QVAC RAG components. Do not use OpenAI API, cloud LLM APIs, hosted embeddings, hosted vector databases, or external inference services.

### Proposed Repository Structure

```text
qvac-medpsy-privacy-desk/
  README.md
  LICENSE
  package.json
  src/
    app/
    components/
    server/
    qvac/
    orchestration/
    storage/
    metrics/
  public/
  examples/
    sample-docs/
  evidence/
    hardware.md
    reproduction.md
    offline-demo.md
    verification-checklist.md
    screenshots/
    logs/
    videos/
  docs/
    PROJECT_PLAN.md
    architecture.md
    submission-notes.md
```

If time is tight, keep a flatter structure:

```text
qvac-medpsy-privacy-desk/
  README.md
  LICENSE
  package.json
  src/
  evidence/
  PROJECT_PLAN.md
```

### Detailed Schedule

#### Phase 0 - Confirm Required Rules and SDK Surface

Target time: 1-2 hours.

Tasks:

- Join QVAC Discord.
- Read QVAC SDK quickstart and RAG docs/examples.
- Clone or inspect official examples.
- Confirm how to install and initialize `@qvac/sdk`.
- Confirm how to run the official SDK `quickstart.ts`.
- Confirm how to run or adapt `packages/sdk/examples/rag` and/or `packages/rag/examples/quickstart.js`.
- Confirm how to load `qvac/MedPsy-1.7B-GGUF` or another official QVAC Psy model.
- Confirm evidence bundle requirements.
- Confirm submission form requirements.

Exit criteria:

- A local QVAC SDK example runs on at least one machine.
- We know the exact commands required to run the SDK.
- We know whether MedPsy model loading works on the Windows RTX 5060 machine.
- We know what files the final submission must include.

#### Phase 1 - Local QVAC Proof of Life

Target time: 2-4 hours.

Tasks:

- Create a minimal Node/TypeScript script using `@qvac/sdk`.
- Run a local text generation or embedding example.
- Prefer MedPsy 1.7B GGUF if it works quickly; otherwise run the official SDK quickstart model.
- Save logs showing model loading and inference.
- Record hardware and OS details for the evidence bundle.

Exit criteria:

- `npm install` works.
- `npm run qvac:smoke` or equivalent produces local inference output.
- No cloud AI API is used.
- The logs identify which model was loaded and where inference ran.

#### Phase 2 - Core RAG Pipeline

Target time: 4-6 hours.

Tasks:

- Implement document import for `.txt` and `.md`.
- Split documents into chunks.
- Generate embeddings using QVAC SDK / QVAC RAG components.
- Store chunks and embeddings locally.
- Implement local retrieval.
- Generate final answers using QVAC.
- Return answer plus source snippets.

Exit criteria:

- The app can ingest at least three sample documents.
- The app can answer questions grounded in those documents.
- The response includes retrieved source snippets.

#### Phase 3 - User Interface

Target time: 4-6 hours.

Tasks:

- Build a compact dashboard.
- Add document list and indexing status.
- Add question input and answer panel.
- Add source snippets panel.
- Add orchestration trace: intake -> retrieve -> answer -> verify.
- Add local tool call trace: `searchLocalDocs`, `showSources`, `exportBrief`, `hardwareStatus`, `offlineCheck`.
- Add local runtime indicators: model name, latency, document count, offline-ready status, hardware label.
- Add error states for missing model, failed indexing, and QVAC runtime errors.
- Add visible safety disclaimer for health/mental-health use.

Exit criteria:

- A judge can run the app and understand the workflow without extra explanation.
- The UI clearly communicates local/private operation.
- The UI shows enough multi-agent/tool-calling evidence to support the Capabilities criterion.

#### Phase 4 - Evidence Bundle

Target time: 3-4 hours.

Tasks:

- Create `evidence/hardware.md`.
- Create `evidence/reproduction.md`.
- Create `evidence/offline-demo.md`.
- Create `evidence/verification-checklist.md`.
- Create `evidence/model-usage.md`.
- Create `evidence/performance.md`.
- Save logs from local inference runs.
- Save orchestration/tool-call logs.
- Capture screenshots.
- Record a short demo video.
- If possible, record a network-off demo.

Exit criteria:

- Evidence files are committed in the repository.
- A reviewer can reproduce the app from README instructions.
- The evidence clearly supports the claim that inference is local.

#### Phase 5 - Submission Polish

Target time: 2-4 hours.

Tasks:

- Finish README.
- Add license.
- Add architecture diagram or explanation.
- Add troubleshooting section.
- Add known limitations.
- Add health/mental-health safety disclaimer.
- Verify fresh install instructions.
- Prepare DoraHacks submission text.
- Prepare Build in Public posts if entering that category.

Exit criteria:

- Repository is public.
- Submission package is complete.
- README includes setup, run, demo, and verification steps.

### Suggested Final-Day Checklist

- [ ] `@qvac/sdk` is the only inference path.
- [ ] QVAC RAG or SDK-compatible RAG is the only RAG path.
- [ ] No cloud AI API keys are required.
- [ ] MedPsy model usage is working or clearly documented with fallback rationale.
- [ ] App can run locally on consumer hardware.
- [ ] README includes exact commands.
- [ ] License is MIT or Apache 2.0.
- [ ] Evidence bundle exists.
- [ ] Hardware specs are documented.
- [ ] Offline demo is documented or recorded.
- [ ] Source snippets are shown for RAG answers.
- [ ] Multi-agent/tool-calling trace is visible in the app and logs.
- [ ] Performance/latency measurements are included.
- [ ] Safety disclaimer is visible.
- [ ] Known limitations are honest and clear.
- [ ] Public repo link works.
- [ ] DoraHacks submission form is complete.
- [ ] Discord/Keet community voting and Build in Public links are prepared if applicable.

## 3. Final Submission Requirements

Based on the hackathon description, the final submission should include the following.

### Mandatory Alignment Summary

The submission must explicitly state:

- Track: General Purpose.
- All AI inference uses `@qvac/sdk`.
- All RAG uses QVAC SDK / QVAC RAG components.
- No cloud inference, cloud embeddings, or hosted vector databases are used.
- Hardware: Mac plus Windows RTX 5060 consumer desktop.
- License: MIT or Apache 2.0.
- Evidence bundle: logs, demo video, hardware proof, reproducibility instructions, and performance artifacts.

### Public Repository

Required:

- Full source code.
- MIT or Apache 2.0 license.
- Clear README.
- Reproducibility instructions.
- No hidden cloud dependency.
- No private model/API key required for inference.

Recommended README sections:

- Project overview.
- Hackathon track or category.
- Why this is local-first and privacy-preserving.
- How QVAC SDK is used for every AI inference path.
- How QVAC RAG is used for local document retrieval.
- MedPsy model usage.
- Multi-agent/tool-calling workflow.
- Architecture.
- Hardware used.
- Setup instructions.
- Run instructions.
- Demo workflow.
- Evidence bundle overview.
- Verification notes.
- Known limitations.

### Working Application

Required:

- Runs locally on available consumer hardware.
- Uses `@qvac/sdk` for inference.
- Uses QVAC SDK / QVAC RAG for RAG.
- Demonstrates a real user workflow.
- Does not depend on cloud inference.

Recommended:

- One-command startup if possible.
- Sample documents included.
- Clear error messages.
- Basic metrics and logs.
- Local orchestration trace.
- Local source-grounded answer view.
- Exportable local brief.

### Evidence Bundle

The hackathon mentions a three-stage verification process. The exact linked requirements still need to be checked, but we should prepare the following evidence by default:

```text
evidence/
  hardware.md
  reproduction.md
  offline-demo.md
  model-usage.md
  performance.md
  orchestration.md
  verification-checklist.md
  logs/
  screenshots/
  videos/
```

Suggested contents:

- Hardware specs: Mac model, Windows CPU/GPU/RAM/OS, GPU driver version.
- Dependency versions: Node version, package manager version, QVAC SDK version.
- Model details: model names, sizes, quantization format if applicable.
- Local inference logs.
- RAG ingestion/search/inference logs.
- Multi-agent/tool-calling logs.
- Performance measurements: ingest time, query latency, tokens/sec if available, memory/GPU observations.
- Screenshots of the app.
- Short demo video.
- Offline demo notes or video.
- Reproduction commands from a fresh checkout.
- Notes proving no cloud AI endpoint is used.

### Demo Video

Recommended structure:

1. Introduce the problem: private wellness and health-adjacent notes should not be uploaded to cloud AI.
2. Show hardware: Windows RTX 5060 machine and Mac/browser client.
3. Start the app.
4. Import sample private wellness/education documents.
5. Ask a question.
6. Show orchestration trace: intake, retrieval, answer, verifier.
7. Show answer and source snippets.
8. Show MedPsy/QVAC model usage and local latency/runtime metrics.
9. Disable network or show no cloud calls.
10. Ask another question.
11. End with the value proposition: privacy, resilience, no API bills, runs on consumer hardware.

### DoraHacks Submission Text

Prepare these fields:

- Project name: QVAC MedPsy Privacy Desk.
- Short description.
- Long description.
- GitHub repository URL.
- Demo video URL.
- Evidence bundle location.
- Track/category.
- Team members.
- License.
- Hardware used.
- QVAC SDK usage summary.
- QVAC RAG usage summary.
- MedPsy model usage summary.
- Multi-agent/tool-calling summary.
- Evidence bundle summary.
- Known limitations.

### Build in Public Materials

If entering the Build in Public category:

- Follow QVAC on X.
- Post initial build announcement.
- Post progress update with screenshot.
- Post local inference proof.
- Post final demo video.
- Include links in submission if the form allows it.

Suggested post themes:

- "Building a fully local private MedPsy RAG workspace for QVAC Hackathon I."
- "First local inference through `@qvac/sdk` running on consumer hardware."
- "Offline demo: private wellness document Q&A without cloud inference."
- "Final demo and open-source repo."

## 4. Information Needed From the User

Please send the following links or paste the relevant content.

### Already Provided or Verified

The following information has been provided or verified from official sources:

- QVAC GitHub repository: `https://github.com/tetherto/qvac`
- SDK quickstart: `npm install @qvac/sdk`, `loadModel`, `completion`, and local model inference.
- QVAC SDK supports Node.js, Bare runtime, and Expo.
- QVAC SDK examples include quickstart, RAG, delegated inference, tools, logging, OCR, transcription, translation, TTS, and diffusion examples.
- QVAC RAG package supports document ingestion, embeddings, vector search, `search`, `infer`, reindexing, and QVAC runtime LLM adapters.
- MedPsy collection: `https://huggingface.co/collections/qvac/medpsy`
- MedPsy models include 1.7B and 4B text-generation models, including GGUF variants.
- Prize and judging criteria have been provided.

### Non-Blocking Final-Submission Content

The user indicated that track constraints do not block development and the remaining official links should not materially affect implementation. We will not wait for these before building. They should still be checked once before final submission.

1. **Three-stage verification / evidence bundle requirements**

Needed content:

- Exact required files.
- Required log format, if any.
- Whether a video is mandatory.
- Whether offline operation must be proven.
- Whether hardware screenshots are required.
- Whether network logs are required.
- Whether there is a template or checklist.

2. **DoraHacks submission form requirements**

Needed content:

- Required fields.
- Maximum text lengths.
- Required video or image uploads.
- Required repository/license settings.
- Track selection rules.
- Submission deadline exact time and timezone.

3. **Terms of Participation**

Needed content:

- Eligibility.
- Open-source requirements.
- IP/license requirements.
- Prize conditions.
- Prohibited behavior.
- Any medical/healthcare-specific restrictions, if present.

4. **Discord or Keet announcements**

Needed content:

- Any updates after the hackathon page was written.
- SDK changes or known bugs.
- Recommended examples.
- Submission clarifications.
- Community voting rules.

### Useful Hardware Details

Please provide:

- Windows CPU model.
- Windows RAM size.
- Exact GPU model: RTX 5060 or RTX 5060 Ti, and VRAM size.
- Windows version.
- NVIDIA driver version.
- Mac model and chip.
- Mac RAM size.
- Whether both machines can be on the same LAN.

## 5. Open Questions

These do not block development, but should be checked before final submission:

- What is the exact submission deadline time and timezone on June 21, 2026?
- What exact artifacts are required for the three-stage verification process?
- Does the evidence bundle require network traces or only logs/videos?
- Does the submission form require a hosted video link, uploaded video, or both?
- Is using `@qvac/rag` alongside `@qvac/sdk` acceptable for the "all AI inference and RAG must use QVAC SDK" requirement? It should be, because it is a QVAC package, but confirm if the wording is strict.
- Which local embedding model is recommended by QVAC for MedPsy RAG?
- Does the QVAC SDK currently support Windows RTX GPU acceleration for the intended model path, or will this run CPU/Metal/CUDA depending on runtime support?
- Are local non-AI preprocessing steps allowed, such as text parsing, chunk metadata, deterministic safety checks, and exporting markdown?

Resolved or mostly resolved:

- Track target: General Purpose, with no development-blocking restrictions.
- QVAC supports local embeddings and RAG through official SDK/RAG components.
- Official Psy model target: MedPsy 1.7B GGUF first, MedPsy 4B GGUF if stable.
- A browser UI is acceptable as long as backend inference/RAG is local.

## 6. Risk Management

### Risk: QVAC SDK Setup Takes Too Long

Mitigation:

- Start from official examples.
- Use the SDK quickstart first.
- Use the simplest supported model first.
- Keep UI and storage minimal until inference works.

Fallback:

- Submit a minimal text-only local Q&A demo if full RAG is too risky.

### Risk: MedPsy Model Setup Blocks Progress

Mitigation:

- Try `qvac/MedPsy-1.7B-GGUF` before `qvac/MedPsy-4B-GGUF`.
- Keep the SDK quickstart model as a fallback.
- Isolate model loading in a smoke-test script before wiring the UI.

Fallback:

- Ship the local QVAC RAG app with the official quickstart model and document MedPsy support as partially implemented. This is weaker for scoring, so it should only happen if MedPsy setup blocks the deadline.

### Risk: Windows GPU Support Is Unstable

Mitigation:

- Test on Windows first.
- If Windows GPU fails, test CPU or Mac runtime if QVAC supports it.

Fallback:

- Use a smaller model that runs acceptably on CPU, while documenting the hardware constraint.

### Risk: Evidence Requirements Are More Strict Than Expected

Mitigation:

- Read the verification link before coding too much.
- Create evidence files throughout development.
- Save logs and screenshots from the beginning.
- Save raw terminal output for SDK quickstart, RAG ingest, RAG query, and offline demo.

### Risk: Too Many Features

Mitigation:

- Do not implement P2P load distribution, fine-tuning, multimodal, or delegated compute until core local RAG works.
- Keep the app focused on one polished workflow.

### Risk: Health Domain Overclaiming

Mitigation:

- Use "wellness education" and "private document Q&A" language.
- Do not claim diagnosis, treatment, triage, or clinical decision support.
- Include a visible safety disclaimer.
- Keep answers grounded in user-provided documents and retrieved snippets.

## 7. Definition of Done

The project is ready to submit when:

- A fresh checkout can run using documented commands.
- A sample document can be indexed locally.
- A question can be answered using local QVAC inference.
- The answer includes source snippets.
- The app has no cloud inference dependency.
- The repo includes license, README, and evidence bundle.
- The demo video clearly shows the core workflow.
- The submission text explicitly explains how QVAC SDK is used.

## 8. Official Source Notes

Information incorporated into this plan comes from:

- QVAC GitHub repository: `https://github.com/tetherto/qvac`
- QVAC SDK README: `packages/sdk/README.md` in the official QVAC repository.
- QVAC RAG README: `packages/rag/README.md` in the official QVAC repository.
- QVAC SDK examples directory: `packages/sdk/examples` in the official QVAC repository.
- QVAC MedPsy Hugging Face collection: `https://huggingface.co/collections/qvac/medpsy`
- User-provided DoraHacks hackathon description, prize structure, mandatory requirements, and judging criteria.

## 9. Immediate Next Actions

1. Run the official SDK quickstart locally.
2. Run or adapt the official RAG example.
3. Test MedPsy 1.7B GGUF loading.
4. Create the project skeleton and evidence folder from the beginning.
5. Build the local RAG workflow and UI.
6. Before final submission, do one pass over verification/submission/terms details and adjust evidence naming if needed.
