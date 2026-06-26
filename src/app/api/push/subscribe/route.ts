import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }
  await db.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth, userId },
    create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await getCurrentUserId();
  const { endpoint } = await req.json();
  if (!endpoint) return Response.json({ error: "Missing endpoint" }, { status: 400 });
  await db.pushSubscription.deleteMany({ where: { endpoint, userId } });
  return Response.json({ ok: true });
}
