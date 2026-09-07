import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** Check whether the participant session cookie is still valid. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    name: session.invitation.name,
    email: session.invitation.email,
    status: session.invitation.status,
  });
}
