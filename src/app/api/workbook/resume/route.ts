import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createMagicLink } from "@/lib/ids";
import { sendResumeLinkEmail } from "@/lib/mail";

/** Email 3 — resume link after "Save and continue later". */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const link = await createMagicLink({
      invitationId: session.invitationId,
      purpose: "resume",
    });

    await sendResumeLinkEmail({
      name: session.invitation.name,
      email: session.invitation.email,
      resumeUrl: link.url,
    });

    const payload: Record<string, unknown> = {
      ok: true,
      message: "Your answers are saved. We have emailed a link that returns you to this step.",
    };
    if (!process.env.RESEND_API_KEY) {
      payload.devLink = link.url;
    }
    return NextResponse.json(payload);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not send resume email" }, { status: 500 });
  }
}
