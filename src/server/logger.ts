import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

export async function appendEvidenceLog(event: string, payload: unknown) {
  const dir = path.join(process.cwd(), "evidence", "logs");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "orchestration.ndjson"),
    `${JSON.stringify({ ts: new Date().toISOString(), event, payload })}\n`,
    "utf8"
  );
}
