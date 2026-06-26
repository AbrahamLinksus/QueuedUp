import webpush from "web-push";
import { db } from "@/lib/db";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // Find users with reviews due today
  const usersWithDue = await db.user.findMany({
    where: {
      problems: {
        some: {
          reviews: {
            some: { status: "PENDING", scheduledFor: { lte: endOfToday } },
          },
        },
      },
      pushSubscriptions: { some: {} },
    },
    select: {
      id: true,
      pushSubscriptions: { select: { endpoint: true, p256dh: true, auth: true } },
      problems: {
        select: {
          reviews: {
            where: { status: "PENDING", scheduledFor: { lte: endOfToday } },
            select: { id: true },
          },
        },
      },
    },
  });

  const results = await Promise.allSettled(
    usersWithDue.flatMap((u) => {
      const dueCount = u.problems.flatMap((p) => p.reviews).length;
      const payload = JSON.stringify({
        title: "QueuedUp",
        body: `You have ${dueCount} review${dueCount !== 1 ? "s" : ""} due today.`,
        url: "/review",
      });
      return u.pushSubscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
      );
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return Response.json({ sent, failed });
}
