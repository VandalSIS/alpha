import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { put, del } from "@vercel/blob";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

/** Vercel serverless request body limit is ~4.5 MB — keep under that for server uploads. */
export const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXT_OK = new Set([".pdf", ".doc", ".docx"]);

export function isAllowedUpload(file: { name: string; type: string; size: number }) {
  const ext = path.extname(file.name).toLowerCase();
  if (!EXT_OK.has(ext)) return { ok: false as const, error: "Only PDF or Word files are accepted." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false as const,
      error: "Each file must be 4.5 MB or smaller on this server. Compress the PDF or upload a lighter copy.",
    };
  }
  if (file.type && !ALLOWED.has(file.type) && file.type !== "application/octet-stream") {
    return { ok: false as const, error: "Only PDF or Word files are accepted." };
  }
  return { ok: true as const };
}

export function useBlobStorage() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function storeUploadFile(file: File, invitationId: string) {
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const key = `pa/${invitationId}/${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";

  if (useBlobStorage()) {
    const blob = await put(key, buf, {
      access: "private",
      contentType: mimeType,
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return {
      storedName: blob.url,
      originalName: file.name,
      mimeType,
      size: buf.length,
      via: "blob" as const,
    };
  }

  // Local / non-Vercel: write to disk
  await ensureUploadDir();
  const storedName = path.basename(key);
  const dest = path.join(UPLOAD_DIR, storedName);
  await writeFile(dest, buf);
  return {
    storedName,
    originalName: file.name,
    mimeType,
    size: buf.length,
    via: "disk" as const,
  };
}

export function uploadAbsolutePath(storedName: string) {
  const base = path.basename(storedName);
  return path.join(UPLOAD_DIR, base);
}

export function isRemoteStored(storedName: string) {
  return /^https?:\/\//i.test(storedName);
}

export async function removeStoredFile(storedName: string) {
  if (isRemoteStored(storedName) && useBlobStorage()) {
    try {
      await del(storedName, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    await unlink(uploadAbsolutePath(storedName));
  } catch {
    /* ignore missing */
  }
}
