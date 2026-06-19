import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnswerRecord, DocumentRecord, SourceSnippet } from "../shared/types.js";

export type ChunkRecord = {
  id: string;
  documentId: string;
  documentName: string;
  text: string;
  embedding: number[];
};

type Database = {
  documents: DocumentRecord[];
  chunks: ChunkRecord[];
  answers: AnswerRecord[];
};

export class LocalStore {
  private data: Database = { documents: [], chunks: [], answers: [] };
  private readonly dataFile: string;
  readonly rootDir: string;

  constructor(rootDir = path.join(process.cwd(), ".qvac-data")) {
    this.rootDir = rootDir;
    this.dataFile = path.join(rootDir, "store.json");
  }

  async load() {
    await mkdir(this.rootDir, { recursive: true });
    try {
      const raw = await readFile(this.dataFile, "utf8");
      this.data = JSON.parse(raw) as Database;
    } catch {
      await this.save();
    }
  }

  listDocuments() {
    return this.data.documents;
  }

  counts() {
    return {
      documents: this.data.documents.length,
      chunks: this.data.chunks.length
    };
  }

  async addDocument(record: DocumentRecord, chunks: ChunkRecord[]) {
    const removedIds = new Set(this.data.documents.filter((doc) => doc.name === record.name).map((doc) => doc.id));
    this.data.documents = this.data.documents.filter((doc) => doc.name !== record.name);
    this.data.chunks = this.data.chunks.filter((chunk) => !removedIds.has(chunk.documentId));
    this.data.documents.push(record);
    this.data.chunks.push(...chunks);
    await this.save();
  }

  async addAnswer(answer: AnswerRecord) {
    this.data.answers.unshift(answer);
    this.data.answers = this.data.answers.slice(0, 50);
    await this.save();
  }

  latestAnswers() {
    return this.data.answers.slice(0, 10);
  }

  getAnswer(answerId: string) {
    return this.data.answers.find((answer) => answer.id === answerId);
  }

  searchByVector(queryEmbedding: number[], topK: number): SourceSnippet[] {
    return this.data.chunks
      .map((chunk) => ({
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        chunkId: chunk.id,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
        text: chunk.text
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private async save() {
    await mkdir(this.rootDir, { recursive: true });
    await writeFile(this.dataFile, `${JSON.stringify(this.data, null, 2)}\n`, "utf8");
  }
}

export function chunkText(text: string, maxWords = 180, overlapWords = 35) {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chunks: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    if (words.length <= maxWords) {
      chunks.push(paragraph);
      continue;
    }
    for (let start = 0; start < words.length; start += maxWords - overlapWords) {
      chunks.push(words.slice(start, start + maxWords).join(" "));
    }
  }

  return chunks.length ? chunks : [text.trim()].filter(Boolean);
}

function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let index = 0; index < length; index += 1) {
    dot += a[index] * b[index];
    aNorm += a[index] * a[index];
    bNorm += b[index] * b[index];
  }
  return dot / ((Math.sqrt(aNorm) || 1) * (Math.sqrt(bNorm) || 1));
}
