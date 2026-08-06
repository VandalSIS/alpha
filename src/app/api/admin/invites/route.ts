import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateInviteCode } from "@/lib/ids";
import { sendInviteEmail } from "@/lib/mail";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    if (data.password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = data.email.trim().toLowerCase();
    const existing = await prisma.invitation.findFirst({
      where: { email, status: { not: "SUBMITTED" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An open invitation already exists for this email", code: existing.code },
        { status: 409 }
      );
    }

    let code = generateInviteCode();
    for (let i = 0; i < 5; i++) {
      const clash = await prisma.invitation.findUnique({ where: { code } });
      if (!clash) break;
      code = generateInviteCode();
    }

    const invite = await prisma.invitation.create({
      data: { name: data.name.trim(), email, code },
    });

    let emailSent = true;
    let emailError: string | null = null;
    try {
      await sendInviteEmail({
        name: invite.name,
        email: invite.email,
        code: invite.code,
      });
    } catch (mailErr) {
      emailSent = false;
      emailError = mailErr instanceof Error ? mailErr.message : "Email send failed";
      console.error("Invite email failed:", mailErr);
    }

    await prisma.auditLog.create({
      data: {
        action: "invite.created",
        meta: JSON.stringify({
          id: invite.id,
          email: invite.email,
          code: invite.code,
          emailSent,
          emailError,
        }),
      },
    });

    return NextResponse.json({
      id: invite.id,
      name: invite.name,
      email: invite.email,
      code: invite.code,
      status: invite.status,
      emailSent,
      emailError,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    console.error(e);
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password") || "";
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { submission: { select: { reference: true, done: true, updatedAt: true } } },
  });
  return NextResponse.json(list);
}
