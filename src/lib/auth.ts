import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "dsa_auth";
const SESSION_PAYLOAD = "authenticated";

function getSecret() {
  const secret = process.env.APP_PASSCODE;
  if (!secret) throw new Error("APP_PASSCODE is not set");
  return secret;
}

export function isValidPasscode(passcode: string) {
  return passcode === getSecret();
}

export function getSessionToken() {
  return createHmac("sha256", getSecret()).update(SESSION_PAYLOAD).digest("hex");
}

export function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const expected = getSessionToken();
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
