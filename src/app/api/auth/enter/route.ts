import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateSessionToken } from "@/lib/ids";
import { SESSION_COOKIE } from "@/lib/session";

const bodySchema = z.object({
  code: z.string().min(4),
  email: z.string().email(),
});

/**
 * Code + email → open workbook (session cookie).
 * Works anytime, as many times as needed — including after SUBMITTED.
 * Magic links remain only for "Save and continue later" resume emails.
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

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30-day session

    await prisma.session.create({
      data: { token, invitationId: invite.id, expiresAt },
    });

    if (invite.status === "INVITED") {
      await prisma.invitation.update({
        where: { id: invite.id },
        data: { status: "STARTED", startedAt: new Date() },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "session.created",
        meta: JSON.stringify({ invitationId: invite.id, email }),
      },
    });

    const res = NextResponse.json({
      ok: true,
      redirect: "/workbook",
      name: invite.name,
      status: invite.status,
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    return res;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid code or email." }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
