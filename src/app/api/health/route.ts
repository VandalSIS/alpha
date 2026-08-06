import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Lightweight diagnostics for deploy/email setup (no secrets). */
export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message : "DB error";
  }

  return NextResponse.json({
    ok: dbOk,
    db: dbOk ? "up" : "down",
    dbError,
    hasResendKey: !!process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM || null,
    hasOverride: !!process.env.EMAIL_OVERRIDE,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
    hasBlob: !!(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN),
  });
}
