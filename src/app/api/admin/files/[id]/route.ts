import { NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { prisma } from "@/lib/db";
import { uploadAbsolutePath } from "@/lib/uploads";
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
