"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

export async function deleteUser(targetUsername: string) {
  const userId = await getCurrentUserId();
  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) {
    throw new Error("Unauthorized");
  }
  if (targetUsername.toLowerCase() === OWNER_USERNAME) {
    throw new Error("Cannot delete the owner account");
  }
  await db.user.delete({ where: { username: targetUsername } });
  revalidatePath("/admin");
}

export async function setUserAccess(
  targetUsername: string,
  field: "lldAccess" | "scheduleAccess",
  value: boolean,
) {
  const userId = await getCurrentUserId();
  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) {
    throw new Error("Unauthorized");
  }
  await db.user.update({ where: { username: targetUsername }, data: { [field]: value } });
  revalidatePath("/admin");
}
