import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";

const execFileAsync = promisify(execFile);

export async function hardwareStatus() {
  const gpu = await readGpu();
  return {
    platform: `${os.type()} ${os.release()} ${os.arch()}`,
    cpu: os.cpus()[0]?.model ?? "unknown CPU",
    cores: os.cpus().length,
    memoryGb: Math.round((os.totalmem() / 1024 ** 3) * 10) / 10,
    nodeVersion: process.version,
    gpu
  };
}

export async function hardwareLabel() {
  const status = await hardwareStatus();
  return [
    status.gpu !== "unavailable" ? status.gpu : status.cpu,
    `${status.memoryGb} GB RAM`,
    status.platform
  ].join(" / ");
}

async function readGpu() {
  try {
    const { stdout } = await execFileAsync("nvidia-smi", ["--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"], {
      timeout: 3000
    });
    return stdout.trim() || "unavailable";
  } catch {
    return "unavailable";
  }
}
