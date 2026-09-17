import { prisma } from "@/lib/db";

export const SESSION_KIND_LABEL: Record<string, string> = {
  fireside: "Fireside",
  mock_board: "Mock board",
  peer: "Peer group",
  other: "Session",
};

export async function ensureStarterLearning() {
  const existing = await prisma.learningModule.count();
  if (existing > 0) return;

  const cohort = await prisma.cohort.create({
    data: {
      name: "Project Alpha cohort",
      summary:
        "Executives from different industries and functions. After positioning work, the cohort meets for firesides, then mock boards, then smaller groups of three or four.",
    },
  });

  const session = await prisma.programmeSession.create({
    data: {
      title: "Opening fireside",
      kind: "fireside",
      startsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      location: "To be confirmed",
      notes: "Guided conversation with peers whose operating backgrounds differ from your own.",
      cohortId: cohort.id,
    },
  });

  await prisma.learningModule.createMany({
    data: [
      {
        title: "From operating record to board contribution",
        summary:
          "How boards read an executive career — and how to state the problem you are equipped to help solve.",
        relevantFor: "All participants · board positioning",
        sortOrder: 1,
        published: true,
        prompt:
          "In 400–600 words, state the board-level problem you are equipped to help an organisation solve. Name the evidence from your operating record, the environments where that contribution is most relevant, and one question you want pressure-tested in the next fireside.",
        body: `Boards do not appoint a résumé. They appoint a director whose experience answers a question the organisation is already facing.

This module is the learning counterpart to the workbook. Use your contribution thesis as the starting point. Tighten it until a chair or nominating committee can repeat it without you in the room.

Work through:
1. The decision or tension a board is living with (growth, succession, capital, risk, technology, reputation).
2. The operating proof you can bring — not a catalogue of achievements, a single line of judgement.
3. The ownership environments where that proof is actually useful.

Bring a draft to your cohort. The fireside is not a presentation. It is a test of whether the thesis holds when someone from another industry asks a precise question.`,
        sessionId: session.id,
        cohortId: null,
      },
      {
        title: "Preparation for fireside discussion",
        summary: "How to show up in a mixed-industry cohort: questions, listening, and a usable contribution.",
        relevantFor: "Your cohort · upcoming fireside",
        sortOrder: 2,
        published: true,
        prompt:
          "Write a short case note (250–400 words) you would be willing to table in the next fireside: the situation, your proposed contribution, and the counter-argument you expect from a peer in a different function.",
        body: `Project Alpha brings together executives from different industries and functions on purpose. The value is not a room of the same role.

Before the next fireside:
- Re-read your thesis in one paragraph.
- Prepare one question you want asked of you, not only questions you will ask others.
- Note where your experience might not travel — a board will find that faster than you will.

Later stages of the programme move from this conversation into in-person mock boards, then into a smaller ongoing group of three or four. This module is the preparation step.`,
        sessionId: session.id,
        cohortId: null,
      },
    ],
  });
}

export function moduleVisibleTo(cohortId: string | null | undefined, moduleCohortId: string | null) {
  if (!moduleCohortId) return true;
  return moduleCohortId === cohortId;
}
