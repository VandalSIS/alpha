import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  isAllowedUpload,
  storeUploadFile,
  removeStoredFile,
  useBlobStorage,
} from "@/lib/uploads";

/** Upload CV / supporting docs for the signed-in participant. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // On Vercel, disk uploads do not persist — Blob is required.
  if (process.env.VERCEL && !useBlobStorage()) {
    return NextResponse.json(
      {
        error:
          "File storage is not configured (missing BLOB_READ_WRITE_TOKEN). Add Vercel Blob in the project Storage tab.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const fieldId = String(form.get("fieldId") || "");
    const file = form.get("file");

    if (!fieldId || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file or fieldId" }, { status: 400 });
    }

    const check = isAllowedUpload(file);
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

    const existing = await prisma.uploadedFile.count({
      where: { invitationId: session.invitationId, fieldId },
    });
    const max = fieldId === "u_opt" ? 4 : 1;
    if (existing >= max) {
      return NextResponse.json(
        { error: `You can upload at most ${max} file(s) here.` },
        { status: 400 }
      );
    }

    const stored = await storeUploadFile(file, session.invitationId);
    const row = await prisma.uploadedFile.create({
      data: {
        invitationId: session.invitationId,
        fieldId,
        originalName: stored.originalName,
        storedName: stored.storedName,
        mimeType: stored.mimeType,
        size: stored.size,
      },
    });

    return NextResponse.json({
      ok: true,
      file: {
        id: row.id,
        name: row.originalName,
        fieldId: row.fieldId,
        size: row.size,
      },
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg || "Upload failed" }, { status: 500 });
  }
}

/** Remove an uploaded file belonging to this session. */
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const row = await prisma.uploadedFile.findFirst({
      where: { id, invitationId: session.invitationId },
    });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await removeStoredFile(row.storedName);
    await prisma.uploadedFile.delete({ where: { id: row.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
