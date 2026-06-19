export type Role = "user" | "assistant";

export type RuntimeStatus = {
  ok: boolean;
  qvacMode: "qvac" | "mock" | "standby" | "unavailable";
  llmModel: string;
  embeddingModel: string;
  hardwareLabel: string;
  nodeVersion: string;
  platform: string;
  documents: number;
  chunks: number;
  lastLatencyMs?: number;
  message?: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  type: "text/markdown" | "text/plain";
  createdAt: string;
  chunkCount: number;
  size: number;
};

export type SourceSnippet = {
  documentId: string;
  documentName: string;
  chunkId: string;
  score: number;
  text: string;
};

export type TraceStep = {
  id: string;
  agent: "Intake Agent" | "Retriever Agent" | "Answer Agent" | "Verifier Agent" | "Local Tool";
  label: string;
  status: "queued" | "running" | "complete" | "warning" | "error";
  detail: string;
  latencyMs?: number;
};

export type AnswerRecord = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  latencyMs: number;
  sources: SourceSnippet[];
  trace: TraceStep[];
  safety: {
    disclaimer: string;
    flags: string[];
  };
};

export type IngestRequest = {
  name: string;
  content: string;
};

export type AskRequest = {
  question: string;
  topK?: number;
};
