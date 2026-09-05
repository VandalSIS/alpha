import { NextResponse } from "next/server";
import { z } from "zod";
import { InviteStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAllowedUpload, removeStoredFile, storeUploadFile } from "@/lib/uploads";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type Ctx = { params: Promise<{ id: string }> };

const statuses = [
  "INVITED",
  "STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "IN_REVIEW",
  "COMPLETE",
] as const;

/** Update portal fields: status + nextSteps. */
export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = z
      .object({
        password: z.string().min(1),
        status: z.enum(statuses).optional(),
        nextSteps: z.string().nullable().optional(),
      })
      .parse(await req.json());

    if (body.password !== process.env.ADMIN_PASSWORD) return unauthorized();

    const invite = await prisma.invitation.findUnique({ where: { id } });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: { status?: InviteStatus; nextSteps?: string | null } = {};
    if (body.status) data.status = body.status as InviteStatus;
    if (body.nextSteps !== undefined) {
      data.nextSteps = body.nextSteps?.trim() || null;
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: "invite.portal_updated",
        meta: JSON.stringify({ id, status: updated.status, hasNextSteps: !!updated.nextSteps }),
      },
    });

    return NextResponse.json({
      ok: true,
      status: updated.status,
      nextSteps: updated.nextSteps,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** List personal portal docs for an invite. */
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const url = new URL(req.url);
    if (url.searchParams.get("password") !== process.env.ADMIN_PASSWORD) return unauthorized();

    const docs = await prisma.portalDocument.findMany({
      where: { invitationId: id, kind: "personal" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(
      docs.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        url: d.url,
        hasFile: !!d.storedName,
        originalName: d.originalName,
        size: d.size,
        createdAt: d.createdAt,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Add personal doc (link and/or file). */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const password = String(form.get("password") || "");
      if (password !== process.env.ADMIN_PASSWORD) return unauthorized();

      const invite = await prisma.invitation.findUnique({ where: { id } });
      if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const title = String(form.get("title") || "").trim();
      if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

      const description = String(form.get("description") || "").trim() || null;
      const link = String(form.get("url") || "").trim() || null;
      const file = form.get("file");

      let stored: Awaited<ReturnType<typeof storeUploadFile>> | null = null;
      if (file instanceof File && file.size > 0) {
        const check = isAllowedUpload(file);
        if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
        stored = await storeUploadFile(file, id);
      }

      if (!link && !stored) {
        return NextResponse.json({ error: "Provide a URL or a file." }, { status: 400 });
      }

      const doc = await prisma.portalDocument.create({
        data: {
          kind: "personal",
          invitationId: id,
          title,
          description,
          url: link,
          storedName: stored?.storedName,
          originalName: stored?.originalName,
          mimeType: stored?.mimeType,
          size: stored?.size,
        },
      });

      return NextResponse.json({ ok: true, id: doc.id });
    }

    const body = z
      .object({
        password: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        url: z.string().url(),
      })
      .parse(await req.json());

    if (body.password !== process.env.ADMIN_PASSWORD) return unauthorized();

    const invite = await prisma.invitation.findUnique({ where: { id } });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const doc = await prisma.portalDocument.create({
      data: {
        kind: "personal",
        invitationId: id,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        url: body.url,
      },
    });

    return NextResponse.json({ ok: true, id: doc.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id: invitationId } = await ctx.params;
    const body = z
      .object({
        password: z.string().min(1),
        docId: z.string().min(1),
      })
      .parse(await req.json());

    if (body.password !== process.env.ADMIN_PASSWORD) return unauthorized();

    const doc = await prisma.portalDocument.findFirst({
      where: { id: body.docId, invitationId, kind: "personal" },
    });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (doc.storedName) await removeStoredFile(doc.storedName);
    await prisma.portalDocument.delete({ where: { id: doc.id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return unauthorized();
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
