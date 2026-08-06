import { NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { uploadAbsolutePath, isRemoteStored, useBlobStorage } from "@/lib/uploads";
import { Readable } from "stream";

type Ctx = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Admin download of an uploaded CV / document. */
export async function GET(req: Request, ctx: Ctx) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password") || "";
  if (password !== process.env.ADMIN_PASSWORD) return unauthorized();

  const { id } = await ctx.params;
  const row = await prisma.uploadedFile.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Private Vercel Blob — stream through this authenticated admin route
  if (isRemoteStored(row.storedName) && useBlobStorage()) {
    const result = await get(row.storedName, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || !result.stream) {
      return NextResponse.json({ error: "File missing in Blob" }, { status: 404 });
    }
    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": row.mimeType || result.blob?.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${row.originalName.replace(/"/g, "")}"`,
        ...(row.size ? { "Content-Length": String(row.size) } : {}),
      },
    });
  }

  // Legacy public blob URL (redirect) or local disk
  if (isRemoteStored(row.storedName)) {
    return NextResponse.redirect(row.storedName, 302);
  }

  const abs = uploadAbsolutePath(row.storedName);
  if (!existsSync(abs)) {
    return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
  }

  const stream = createReadStream(abs);
  const webStream = Readable.toWeb(stream) as unknown as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": row.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${row.originalName.replace(/"/g, "")}"`,
      "Content-Length": String(row.size),
    },
  });
}
