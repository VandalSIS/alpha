import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { moduleVisibleTo, SESSION_KIND_LABEL } from "@/lib/learning";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const invite = session.invitation;

  const module = await prisma.learningModule.findUnique({
    where: { id },
    include: { session: true },
  });
  if (!module || !module.published || !moduleVisibleTo(invite.cohortId, module.cohortId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const caseRow = await prisma.caseResponse.findUnique({
    where: { invitationId_moduleId: { invitationId: invite.id, moduleId: id } },
    include: { feedback: true },
  });

  return NextResponse.json({
    id: module.id,
    title: module.title,
    summary: module.summary,
    body: module.body,
    prompt: module.prompt,
    relevantFor: module.relevantFor,
    session: module.session
      ? {
          title: module.session.title,
          kindLabel: SESSION_KIND_LABEL[module.session.kind] || "Session",
          startsAt: module.session.startsAt,
          location: module.session.location,
        }
      : null,
    caseResponse: caseRow
      ? {
          body: caseRow.body,
          submittedAt: caseRow.submittedAt,
          locked: !!caseRow.feedback,
          feedback: caseRow.feedback
            ? {
                body: caseRow.feedback.body,
                authorName: caseRow.feedback.authorName,
                createdAt: caseRow.feedback.createdAt,
              }
            : null,
        }
      : null,
  });
}
