import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSessionToken } from "@/lib/ids";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Consumes a magic link (signin or resume) and sets the session cookie.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(new URL("/enter?error=missing", base));
  }

  const link = await prisma.magicLink.findUnique({
    where: { token },
    include: { invitation: true },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/enter?error=invalid", base));
  }

  if (link.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/enter?error=expired", base));
  }

  // Sign-in links are one-use; resume links are reusable until expiry
  if (link.purpose === "signin" && link.usedAt) {
    return NextResponse.redirect(new URL("/enter?error=used", base));
  }

  if (link.purpose === "signin") {
    await prisma.magicLink.update({
      where: { id: link.id },
      data: { usedAt: new Date() },
    });
  }

  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.session.create({
    data: {
      token: sessionToken,
      invitationId: link.invitationId,
      expiresAt,
    },
  });

  if (link.invitation.status === "INVITED") {
    await prisma.invitation.update({
      where: { id: link.invitationId },
      data: { status: "STARTED", startedAt: new Date() },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: "magic.consumed",
      meta: JSON.stringify({
        invitationId: link.invitationId,
        purpose: link.purpose,
      }),
    },
  });

  const res = NextResponse.redirect(new URL("/workbook", base));
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return res;
}
