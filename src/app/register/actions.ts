"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function register(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (username.length < 3) redirect("/register?error=username_short");
  if (password.length < 6) redirect("/register?error=password_short");
  if (password !== confirm) redirect("/register?error=mismatch");

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) redirect("/register?error=taken");

  await db.user.create({
    data: { username, passwordHash: await hashPassword(password) },
  });

  redirect("/login?registered=1");
}
