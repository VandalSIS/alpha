import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { generateReference } from "@/lib/ids";
import { sendSubmissionConfirm, sendSubmissionNotify } from "@/lib/mail";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let submission = await prisma.submission.findUnique({
    where: { invitationId: session.invitationId },
  });

  if (!submission) {
    submission = await prisma.submission.create({
      data: {
        invitationId: session.invitationId,
        reference: generateReference(),
        answers: "{}",
        step: 0,
      },
    });
  }

  const files = await prisma.uploadedFile.findMany({
    where: { invitationId: session.invitationId },
    orderBy: { createdAt: "asc" },
  });

  const answers = JSON.parse(submission.answers || "{}") as Record<string, unknown>;
  // Prefer DB file records over stale name-only metadata
  const fileMeta: Record<string, { id: string; name: string }[]> = {};
  for (const f of files) {
    if (!fileMeta[f.fieldId]) fileMeta[f.fieldId] = [];
    fileMeta[f.fieldId]!.push({ id: f.id, name: f.originalName });
  }
  answers.__files = fileMeta;

  return NextResponse.json({
    name: session.invitation.name,
    email: session.invitation.email,
    status: session.invitation.status,
    step: submission.step,
    done: submission.done,
    reference: submission.reference,
    answers,
    devTools: process.env.EMAIL_DEV_SHOW_LINK === "1",
  });
}

const saveSchema = z.object({
  step: z.number().int().min(0).max(10),
  answers: z.record(z.any()),
  done: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = saveSchema.parse(await req.json());

    const submission = await prisma.submission.upsert({
      where: { invitationId: session.invitationId },
      create: {
        invitationId: session.invitationId,
        reference: generateReference(),
        answers: JSON.stringify(data.answers),
        step: data.step,
        done: !!data.done,
      },
      update: {
        answers: JSON.stringify(data.answers),
        step: data.step,
        done: data.done ?? false,
        ...(data.done ? {} : {}),
      },
    });

    if (data.done) {
      const submittedAt = new Date();
      await prisma.invitation.update({
        where: { id: session.invitationId },
        data: { status: "SUBMITTED", submittedAt },
      });

      const fileCount = await prisma.uploadedFile.count({
        where: { invitationId: session.invitationId },
      });
      const answers = data.answers as Record<string, unknown>;
      const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      await sendSubmissionConfirm({
        name: session.invitation.name,
        email: session.invitation.email,
        reference: submission.reference,
      });
      await sendSubmissionNotify({
        name: session.invitation.name,
        email: session.invitation.email,
        reference: submission.reference,
        title: typeof answers.p_title === "string" ? answers.p_title : undefined,
        organisation: typeof answers.p_org === "string" ? answers.p_org : undefined,
        submittedAt,
        fileCount,
        adminUrl: `${base}/admin?view=${session.invitationId}`,
      });
    } else if (session.invitation.status === "STARTED" || session.invitation.status === "INVITED") {
      await prisma.invitation.update({
        where: { id: session.invitationId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json({
      ok: true,
      step: submission.step,
      done: submission.done,
      reference: submission.reference,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
