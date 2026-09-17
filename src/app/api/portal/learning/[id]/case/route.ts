import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { moduleVisibleTo } from "@/lib/learning";

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  body: z.string().trim().min(40, "Write a little more — at least a few sentences."),
});

export async function POST(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const invite = session.invitation;

  const module = await prisma.learningModule.findUnique({ where: { id } });
  if (!module || !module.published || !module.prompt || !moduleVisibleTo(invite.cohortId, module.cohortId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message || "Invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const existing = await prisma.caseResponse.findUnique({
    where: { invitationId_moduleId: { invitationId: invite.id, moduleId: id } },
    include: { feedback: true },
  });
  if (existing?.feedback) {
    return NextResponse.json(
      { error: "Feedback has already been given. This case is closed." },
      { status: 409 }
    );
  }

  const row = existing
    ? await prisma.caseResponse.update({
        where: { id: existing.id },
        data: { body: parsed.body },
      })
    : await prisma.caseResponse.create({
        data: {
          invitationId: invite.id,
          moduleId: id,
          body: parsed.body,
        },
      });

  await prisma.auditLog.create({
    data: {
      action: existing ? "learning.case_updated" : "learning.case_submitted",
      meta: JSON.stringify({ invitationId: invite.id, moduleId: id }),
    },
  });

  return NextResponse.json({
    ok: true,
    submittedAt: row.submittedAt,
  });
}
