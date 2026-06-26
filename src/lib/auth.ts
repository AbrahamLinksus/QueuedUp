import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

export const AUTH_COOKIE_NAME = "dsa_auth";
const BCRYPT_ROUNDS = 12;

function getSecret() {
  const secret = process.env.APP_SECRET ?? process.env.APP_PASSCODE;
  if (!secret) throw new Error("APP_SECRET is not set");
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(userId: string) {
  const hmac = createHmac("sha256", getSecret()).update(userId).digest("hex");
  return `${userId}.${hmac}`;
}

export function getUserIdFromToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return null;
  const userId = token.slice(0, dotIdx);
  const givenHmac = token.slice(dotIdx + 1);
  const expected = createHmac("sha256", getSecret()).update(userId).digest("hex");
  if (givenHmac.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(givenHmac), Buffer.from(expected))) return null;
  return userId;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  return getUserIdFromToken(token) !== null;
}
