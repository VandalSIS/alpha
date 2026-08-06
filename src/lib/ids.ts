import { randomBytes } from "crypto";
import { prisma } from "./db";
import { appUrl } from "./mail";

/** Invite codes like PA-7K2M9Q */
export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) body += alphabet[bytes[i]! % alphabet.length];
  return `PA-${body}`;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateMagicToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateReference(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `PA-${new Date().getFullYear()}-${n}`;
}

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;

export async function createMagicLink(opts: {
  invitationId: string;
  purpose: "signin" | "resume";
}) {
  const token = generateMagicToken();
  const expiresAt =
    opts.purpose === "signin"
      ? new Date(Date.now() + HOUR_MS) // 60 minutes, one-use
      : new Date(Date.now() + 30 * DAY_MS); // 30 days

  await prisma.magicLink.create({
    data: {
      token,
      invitationId: opts.invitationId,
      purpose: opts.purpose,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
    url: appUrl(`/auth/magic?token=${token}`),
  };
}

export function invitationStillValid(invitedAt: Date): boolean {
  return Date.now() - invitedAt.getTime() <= 30 * DAY_MS;
}
