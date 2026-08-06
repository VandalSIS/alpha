import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const authSchema = z.object({
  password: z.string().min(1),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type Ctx = { params: Promise<{ id: string }> };

/** Full invite + submission answers for admin review. */
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const url = new URL(req.url);
    const password = url.searchParams.get("password") || "";
    if (password !== process.env.ADMIN_PASSWORD) return unauthorized();

    const invite = await prisma.invitation.findUnique({
      where: { id },
      include: {
        submission: true,
        files: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let answers: Record<string, unknown> = {};
    if (invite.submission?.answers) {
      try {
        answers = JSON.parse(invite.submission.answers);
      } catch {
        answers = {};
      }
    }

    return NextResponse.json({
      id: invite.id,
      name: invite.name,
      email: invite.email,
      code: invite.code,
      status: invite.status,
      createdAt: invite.createdAt,
      startedAt: invite.startedAt,
      submittedAt: invite.submittedAt,
      files: invite.files.map((f) => ({
        id: f.id,
        fieldId: f.fieldId,
        name: f.originalName,
        size: f.size,
        mimeType: f.mimeType,
        createdAt: f.createdAt,
      })),
      submission: invite.submission
        ? {
            reference: invite.submission.reference,
            step: invite.submission.step,
            done: invite.submission.done,
            updatedAt: invite.submission.updatedAt,
            answers,
          }
        : null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = authSchema.parse(await req.json());
    if (body.password !== process.env.ADMIN_PASSWORD) return unauthorized();

    await prisma.invitation.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { action: "invite.deleted", meta: JSON.stringify({ id }) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return unauthorized();
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Reopen a submitted workbook so the participant can enter again with the same code. */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const json = await req.json();
    const body = z
      .object({
        password: z.string().min(1),
        action: z.enum(["reopen", "resend"]).default("reopen"),
      })
      .parse(json);

    if (body.password !== process.env.ADMIN_PASSWORD) return unauthorized();

    const invite = await prisma.invitation.findUnique({ where: { id } });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.action === "reopen") {
      await prisma.invitation.update({
        where: { id },
        data: {
          status: "IN_PROGRESS",
          submittedAt: null,
        },
      });
      await prisma.submission.updateMany({
        where: { invitationId: id },
        data: { done: false },
      });
      await prisma.auditLog.create({
        data: { action: "invite.reopened", meta: JSON.stringify({ id }) },
      });
      return NextResponse.json({ ok: true, status: "IN_PROGRESS" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    if (e instanceof z.ZodError) return unauthorized();
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
