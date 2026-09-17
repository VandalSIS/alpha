import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAdminPassword } from "@/lib/admin-auth";
import { ensureStarterLearning, SESSION_KIND_LABEL } from "@/lib/learning";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!isAdminPassword(url.searchParams.get("password"))) return unauthorized();

  await ensureStarterLearning();

  const [cohorts, modules, sessions, invites, cases] = await Promise.all([
    prisma.cohort.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.learningModule.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { session: true, cohort: true },
    }),
    prisma.programmeSession.findMany({ orderBy: { startsAt: "asc" }, include: { cohort: true } }),
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, cohortId: true, status: true },
    }),
    prisma.caseResponse.findMany({
      orderBy: { submittedAt: "desc" },
      include: {
        invitation: { select: { id: true, name: true, email: true } },
        module: { select: { id: true, title: true } },
        feedback: true,
      },
    }),
  ]);

  return NextResponse.json({
    cohorts,
    modules: modules.map((m) => ({
      id: m.id,
      title: m.title,
      summary: m.summary,
      body: m.body,
      prompt: m.prompt,
      relevantFor: m.relevantFor,
      published: m.published,
      sortOrder: m.sortOrder,
      cohortId: m.cohortId,
      sessionId: m.sessionId,
      sessionTitle: m.session?.title || null,
      cohortName: m.cohort?.name || null,
    })),
    sessions: sessions.map((s) => ({
      id: s.id,
      title: s.title,
      kind: s.kind,
      kindLabel: SESSION_KIND_LABEL[s.kind] || "Session",
      startsAt: s.startsAt,
      location: s.location,
      notes: s.notes,
      cohortId: s.cohortId,
      cohortName: s.cohort?.name || null,
    })),
    invites,
    cases: cases.map((c) => ({
      id: c.id,
      body: c.body,
      submittedAt: c.submittedAt,
      participantName: c.invitation.name,
      participantEmail: c.invitation.email,
      moduleTitle: c.module.title,
      feedback: c.feedback
        ? { body: c.feedback.body, authorName: c.feedback.authorName, createdAt: c.feedback.createdAt }
        : null,
    })),
  });
}

export async function POST(req: Request) {
  let json: Record<string, unknown>;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isAdminPassword(typeof json.password === "string" ? json.password : "")) {
    return unauthorized();
  }

  const action = json.action;
  try {
    if (action === "cohort") {
      const data = z
        .object({ name: z.string().trim().min(2), summary: z.string().trim().optional() })
        .parse(json);
      const row = await prisma.cohort.create({
        data: { name: data.name, summary: data.summary || null },
      });
      return NextResponse.json(row);
    }

    if (action === "session") {
      const data = z
        .object({
          title: z.string().trim().min(2),
          kind: z.enum(["fireside", "mock_board", "peer", "other"]),
          startsAt: z.string().min(1),
          location: z.string().trim().optional(),
          notes: z.string().trim().optional(),
          cohortId: z.string().nullable().optional(),
        })
        .parse(json);
      const row = await prisma.programmeSession.create({
        data: {
          title: data.title,
          kind: data.kind,
          startsAt: new Date(data.startsAt),
          location: data.location || null,
          notes: data.notes || null,
          cohortId: data.cohortId || null,
        },
      });
      return NextResponse.json(row);
    }

    if (action === "module") {
      const data = z
        .object({
          title: z.string().trim().min(2),
          summary: z.string().trim().min(8),
          body: z.string().trim().min(20),
          prompt: z.string().trim().optional(),
          relevantFor: z.string().trim().optional(),
          sortOrder: z.coerce.number().int().optional(),
          cohortId: z.string().nullable().optional(),
          sessionId: z.string().nullable().optional(),
        })
        .parse(json);
      const row = await prisma.learningModule.create({
        data: {
          title: data.title,
          summary: data.summary,
          body: data.body,
          prompt: data.prompt || null,
          relevantFor: data.relevantFor || null,
          sortOrder: data.sortOrder ?? 0,
          cohortId: data.cohortId || null,
          sessionId: data.sessionId || null,
          published: true,
        },
      });
      return NextResponse.json(row);
    }

    if (action === "assign") {
      const data = z
        .object({
          invitationId: z.string().min(1),
          cohortId: z.string().nullable(),
        })
        .parse(json);
      const updated = await prisma.invitation.update({
        where: { id: data.invitationId },
        data: { cohortId: data.cohortId },
      });
      return NextResponse.json({ ok: true, cohortId: updated.cohortId });
    }

    if (action === "feedback") {
      const data = z
        .object({
          caseId: z.string().min(1),
          body: z.string().trim().min(8),
          authorName: z.string().trim().optional(),
        })
        .parse(json);
      const existing = await prisma.caseResponse.findUnique({
        where: { id: data.caseId },
        include: { feedback: true },
      });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (existing.feedback) {
        const fb = await prisma.caseFeedback.update({
          where: { caseResponseId: existing.id },
          data: {
            body: data.body,
            authorName: data.authorName || existing.feedback.authorName,
          },
        });
        return NextResponse.json(fb);
      }
      const fb = await prisma.caseFeedback.create({
        data: {
          caseResponseId: existing.id,
          body: data.body,
          authorName: data.authorName || "Project Alpha team",
        },
      });
      return NextResponse.json(fb);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message || "Invalid" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
