import { getStore } from "@netlify/blobs";
import webpush from "web-push";
import {
  addDays,
  calculateSchedule,
  dateInZone,
  timezoneFor,
} from "../../src/lib/prayer-api";
import { reminderEvents } from "../../src/lib/reminders";
import { pushSchema } from "../../src/server/validation";
export default async function () {
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY)
    return new Response("Push not configured", { status: 503 });
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  const store = getStore({ name: "deenflow-push", consistency: "strong" }),
    sent = getStore({ name: "deenflow-push-sent", consistency: "strong" });
  const now = Date.now();
  let delivered = 0,
    failed = 0;
  for await (const page of store.list({ paginate: true }))
    for (let offset = 0; offset < page.blobs.length; offset += 10) {
      await Promise.all(
        page.blobs.slice(offset, offset + 10).map(async ({ key }) => {
          try {
            const record = await store.get(key, { type: "json" });
            if (!record) return;
            if (record.expires < now) {
              await store.delete(key);
              return;
            }
            const parsed = pushSchema.safeParse(record);
            if (!parsed.success) {
              failed++;
              return;
            }
            const { subscription, preferences, settings } = parsed.data;
            if (!settings.enabled) return;
            const date = dateInZone(
              new Date(now),
              timezoneFor(preferences.location),
            );
            const schedules = [-1, 0, 1].map((n) =>
              calculateSchedule(
                preferences.location,
                addDays(date, n),
                preferences,
              ),
            );
            const due = reminderEvents(schedules, settings).filter(
              (e) => e.at <= now && e.at > now - 90000,
            );
            for (const event of due) {
              const marker =
                new Date(event.at).toISOString().slice(0, 10) +
                "/" +
                key +
                "/" +
                event.tag;
              if (
                !(await sent.setJSON(marker, { at: now }, { onlyIfNew: true }))
                  .modified
              )
                continue;
              try {
                await webpush.sendNotification(
                  subscription,
                  JSON.stringify({ ...event, silent: !settings.sound }),
                  { TTL: 90, urgency: "high", timeout: 8000 },
                );
                delivered++;
              } catch (error) {
                const status = (error as { statusCode?: number }).statusCode;
                if (status === 404 || status === 410) await store.delete(key);
                else {
                  await sent.delete(marker);
                  failed++;
                }
              }
            }
          } catch {
            failed++;
          }
        }),
      );
    }
  // Remove old delivery markers once daily to keep deduplication storage bounded.
  if (new Date(now).getUTCHours() === 3 && new Date(now).getUTCMinutes() === 0)
    for await (const page of sent.list({ paginate: true }))
      for (const { key } of page.blobs)
        if (
          key.slice(0, 10) <
          addDays(new Date(now).toISOString().slice(0, 10), -3)
        )
          await sent.delete(key);
  return Response.json({ delivered, failed });
}
export const config = { schedule: "* * * * *" };
