import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createMagicLink, invitationStillValid } from "@/lib/ids";
import { sendSignInLinkEmail } from "@/lib/mail";

const bodySchema = z.object({
  code: z.string().min(4),
  email: z.string().email(),
});

/**
 * Validates invite code + email, then emails a one-use sign-in link (60 min).
 * Does not open the workbook directly — per Project-Alpha-Emails.docx.
 */
export async function POST(req: Request) {
  try {
    const data = bodySchema.parse(await req.json());
    const code = data.code.trim().toUpperCase();
    const email = data.email.trim().toLowerCase();

    const invite = await prisma.invitation.findFirst({
      where: { code, email },
    });

    if (!invite) {
      return NextResponse.json(
        {
          error:
            "We could not match that code and email address. Check both and try again, or write to projectalpha@christian-timbers.com.",
        },
        { status: 404 }
      );
    }

    if (!invitationStillValid(invite.invitedAt)) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired (valid for 30 days). Write to projectalpha@christian-timbers.com for a new code.",
        },
        { status: 410 }
      );
    }

    const link = await createMagicLink({
      invitationId: invite.id,
      purpose: "signin",
    });

    await sendSignInLinkEmail({
      name: invite.name,
      email: invite.email,
      signInUrl: link.url,
    });

    await prisma.auditLog.create({
      data: {
        action: "signin.requested",
        meta: JSON.stringify({ invitationId: invite.id, email }),
      },
    });

    const payload: Record<string, unknown> = {
      ok: true,
      emailed: true,
      message:
        "If that code and email match an invitation, we have sent a secure sign-in link. It works once and expires in 60 minutes.",
    };

    // Local / stub mode: surface the link so you can test without Resend
    if (!process.env.RESEND_API_KEY || process.env.EMAIL_DEV_SHOW_LINK === "1") {
      payload.devLink = link.url;
    }

    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid code or email." }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
