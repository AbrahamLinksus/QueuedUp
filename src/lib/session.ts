import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, getUserIdFromToken } from "@/lib/auth";

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = getUserIdFromToken(token);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}
