import { cookies } from "next/headers";
import { prisma } from "./db";

export const SESSION_COOKIE = "pa_session";

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { invitation: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session;
}

export async function requireSession() {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}
