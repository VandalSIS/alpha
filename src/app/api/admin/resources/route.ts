import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { removeStoredFile, storeUploadFile, isAllowedUpload } from "@/lib/uploads";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkPw(password: string | null | undefined) {
  return password === process.env.ADMIN_PASSWORD;
}

/** List shared resources (and optionally all personal docs via ?all=1). */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    if (!checkPw(url.searchParams.get("password"))) return unauthorized();

    const resources = await prisma.portalDocument.findMany({
      where: { kind: "resource", invitationId: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(
      resources.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        url: d.url,
        category: d.category,
        hasFile: !!d.storedName,
        originalName: d.originalName,
        size: d.size,
        sortOrder: d.sortOrder,
        createdAt: d.createdAt,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Create shared resource (JSON link) or multipart with file. */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const password = String(form.get("password") || "");
      if (!checkPw(password)) return unauthorized();

      const title = String(form.get("title") || "").trim();
      if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

      const description = String(form.get("description") || "").trim() || null;
      const category = String(form.get("category") || "").trim() || null;
      const url = String(form.get("url") || "").trim() || null;
      const file = form.get("file");

      let stored: Awaited<ReturnType<typeof storeUploadFile>> | null = null;
      if (file instanceof File && file.size > 0) {
        const check = isAllowedUpload(file);
        if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
        stored = await storeUploadFile(file, "resources");
      }

      if (!url && !stored) {
        return NextResponse.json({ error: "Provide a URL or a file." }, { status: 400 });
      }

      const doc = await prisma.portalDocument.create({
        data: {
          kind: "resource",
          invitationId: null,
          title,
          description,
          category,
          url,
          storedName: stored?.storedName,
          originalName: stored?.originalName,
          mimeType: stored?.mimeType,
          size: stored?.size,
        },
      });

      await prisma.auditLog.create({
        data: { action: "resource.created", meta: JSON.stringify({ id: doc.id, title }) },
      });

      return NextResponse.json({ ok: true, id: doc.id });
    }

    const body = z
      .object({
        password: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        url: z.string().url().optional(),
      })
      .parse(await req.json());

    if (!checkPw(body.password)) return unauthorized();
    if (!body.url) {
      return NextResponse.json({ error: "URL required when no file." }, { status: 400 });
    }

    const doc = await prisma.portalDocument.create({
      data: {
        kind: "resource",
        invitationId: null,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        category: body.category?.trim() || null,
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

export async function DELETE(req: Request) {
  try {
    const body = z
      .object({
        password: z.string().min(1),
        id: z.string().min(1),
      })
      .parse(await req.json());

    if (!checkPw(body.password)) return unauthorized();

    const doc = await prisma.portalDocument.findUnique({ where: { id: body.id } });
    if (!doc || doc.kind !== "resource") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (doc.storedName) await removeStoredFile(doc.storedName);
    await prisma.portalDocument.delete({ where: { id: body.id } });
    await prisma.auditLog.create({
      data: { action: "resource.deleted", meta: JSON.stringify({ id: body.id }) },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return unauthorized();
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
