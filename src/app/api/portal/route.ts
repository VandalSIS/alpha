import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { STAGE_LABELS, STAGE_ORDER, resolveNextSteps } from "@/lib/portal";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invite = session.invitation;

  const [personalDocs, resources] = await Promise.all([
    prisma.portalDocument.findMany({
      where: { invitationId: invite.id, kind: "personal" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.portalDocument.findMany({
      where: { invitationId: null, kind: "resource" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const mapDoc = (d: (typeof personalDocs)[number]) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    url: d.url,
    category: d.category,
    hasFile: !!d.storedName,
    originalName: d.originalName,
    size: d.size,
  });

  return NextResponse.json({
    name: invite.name,
    email: invite.email,
    status: invite.status,
    stageLabel: STAGE_LABELS[invite.status],
    stages: STAGE_ORDER.map((s) => ({
      id: s,
      label: STAGE_LABELS[s],
      current: s === invite.status,
    })),
    nextSteps: resolveNextSteps(invite.status, invite.nextSteps),
    documents: personalDocs.map(mapDoc),
    resources: resources.map(mapDoc),
    workbookPath: "/workbook",
  });
}
