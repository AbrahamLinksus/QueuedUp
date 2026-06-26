"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const RESET_CODE = process.env.RESET_CODE ?? "pleaseresetme";

export async function resetPassword(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (code !== RESET_CODE) redirect("/reset?error=code");
  if (password.length < 6) redirect("/reset?error=short");
  if (password !== confirm) redirect("/reset?error=match");

  const user = await db.user.findUnique({ where: { username } });
  if (!user) redirect("/reset?error=user");

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password) },
  });

  redirect("/login?reset=1");
}
