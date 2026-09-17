import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ensureStarterLearning, moduleVisibleTo, SESSION_KIND_LABEL } from "@/lib/learning";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureStarterLearning();

  const invite = session.invitation;
  const cohortId = invite.cohortId;

  const [cohort, modules, programmeSessions, cases] = await Promise.all([
    cohortId
      ? prisma.cohort.findUnique({ where: { id: cohortId } })
      : Promise.resolve(null),
    prisma.learningModule.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { session: true },
    }),
    prisma.programmeSession.findMany({
      where: {
        startsAt: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) },
        OR: cohortId ? [{ cohortId: null }, { cohortId }] : [{ cohortId: null }],
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.caseResponse.findMany({
      where: { invitationId: invite.id },
      include: { feedback: true },
    }),
  ]);

  const caseByModule = new Map(cases.map((c) => [c.moduleId, c]));
  const visible = modules.filter((m) => moduleVisibleTo(cohortId, m.cohortId));

  return NextResponse.json({
    name: invite.name,
    cohort: cohort ? { id: cohort.id, name: cohort.name, summary: cohort.summary } : null,
    nextSession: programmeSessions[0]
      ? {
          id: programmeSessions[0].id,
          title: programmeSessions[0].title,
          kind: programmeSessions[0].kind,
          kindLabel: SESSION_KIND_LABEL[programmeSessions[0].kind] || "Session",
          startsAt: programmeSessions[0].startsAt,
          location: programmeSessions[0].location,
          notes: programmeSessions[0].notes,
        }
      : null,
    sessions: programmeSessions.map((s) => ({
      id: s.id,
      title: s.title,
      kind: s.kind,
      kindLabel: SESSION_KIND_LABEL[s.kind] || "Session",
      startsAt: s.startsAt,
      location: s.location,
      notes: s.notes,
    })),
    modules: visible.map((m) => {
      const c = caseByModule.get(m.id);
      return {
        id: m.id,
        title: m.title,
        summary: m.summary,
        relevantFor: m.relevantFor,
        prompt: !!m.prompt,
        sessionTitle: m.session?.title || null,
        caseStatus: c ? (c.feedback ? "feedback" : "submitted") : "open",
      };
    }),
  });
}
