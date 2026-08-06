import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXT_OK = new Set([".pdf", ".doc", ".docx"]);

export function isAllowedUpload(file: { name: string; type: string; size: number }) {
  const ext = path.extname(file.name).toLowerCase();
  if (!EXT_OK.has(ext)) return { ok: false as const, error: "Only PDF or Word files are accepted." };
  if (file.size > 15 * 1024 * 1024) return { ok: false as const, error: "Each file must be 15 MB or smaller." };
  // Some browsers send empty type — allow by extension
  if (file.type && !ALLOWED.has(file.type) && file.type !== "application/octet-stream") {
    return { ok: false as const, error: "Only PDF or Word files are accepted." };
  }
  return { ok: true as const };
}

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function storeUploadFile(file: File, invitationId: string) {
  await ensureUploadDir();
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const storedName = `${invitationId}-${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const dest = path.join(UPLOAD_DIR, storedName);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buf);
  return {
    storedName,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: buf.length,
    absolutePath: dest,
  };
}

export function uploadAbsolutePath(storedName: string) {
  // Prevent path traversal
  const base = path.basename(storedName);
  return path.join(UPLOAD_DIR, base);
}

export async function removeStoredFile(storedName: string) {
  try {
    await unlink(uploadAbsolutePath(storedName));
  } catch {
    /* ignore missing */
  }
}
