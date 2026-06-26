"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME, createSessionToken, hashPassword } from "@/lib/auth";

export async function register(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (username.length < 3) redirect("/register?error=username_short");
  if (password.length < 6) redirect("/register?error=password_short");
  if (password !== confirm) redirect("/register?error=mismatch");

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) redirect("/register?error=taken");

  const user = await db.user.create({
    data: { username, passwordHash: await hashPassword(password) },
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/");
}
