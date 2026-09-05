import { NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { Readable } from "stream";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  blobAuthOptions,
  isRemoteStored,
  uploadAbsolutePath,
  useBlobStorage,
} from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

/** Participant download for portal docs they own, or shared resources. */
export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doc = await prisma.portalDocument.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const allowed =
      (doc.kind === "resource" && !doc.invitationId) ||
      (doc.kind === "personal" && doc.invitationId === session.invitationId);

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Link-only resource / doc
    if (doc.url && !doc.storedName) {
      return NextResponse.redirect(doc.url, 302);
    }

    if (!doc.storedName) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const filename = (doc.originalName || "document.pdf").replace(/"/g, "");
    const mime = doc.mimeType || "application/octet-stream";

    if (isRemoteStored(doc.storedName) && useBlobStorage()) {
      const result = await get(doc.storedName, {
        access: "private",
        ...blobAuthOptions(),
      });
      if (!result || !result.stream) {
        return NextResponse.json({ error: "File missing" }, { status: 404 });
      }
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": mime,
          "Content-Disposition": `attachment; filename="${filename}"`,
          ...(doc.size ? { "Content-Length": String(doc.size) } : {}),
        },
      });
    }

    if (isRemoteStored(doc.storedName)) {
      return NextResponse.redirect(doc.storedName, 302);
    }

    const abs = uploadAbsolutePath(doc.storedName);
    if (!existsSync(abs)) {
      return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
    }

    const stream = createReadStream(abs);
    const webStream = Readable.toWeb(stream) as unknown as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
        ...(doc.size ? { "Content-Length": String(doc.size) } : {}),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
