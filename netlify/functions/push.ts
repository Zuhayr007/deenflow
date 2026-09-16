import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import {
  bearer,
  pushSchema,
  readBody,
  sameOrigin,
  safePushEndpoint,
} from "../../src/server/validation";
import {
  calculateSchedule,
  dateInZone,
  timezoneFor,
} from "../../src/lib/prayer-api";
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export default async function (request: Request) {
  if (!["POST", "DELETE"].includes(request.method))
    return new Response("Method not allowed", { status: 405 });
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (
    !process.env.VAPID_PRIVATE_KEY ||
    !process.env.VAPID_PUBLIC_KEY ||
    !process.env.VAPID_SUBJECT
  )
    return new Response("Background push is not configured", { status: 503 });
  try {
    const tokenHash = hash(bearer(request));
    const input = await readBody(request, 12000);
    const store = getStore({ name: "deenflow-push", consistency: "strong" });
    const parsed = request.method === "POST" ? pushSchema.parse(input) : null;
    const endpoint = parsed?.subscription.endpoint || input.endpoint;
    if (typeof endpoint !== "string" || !safePushEndpoint(endpoint))
      return new Response("Invalid subscription", { status: 400 });
    const key = hash(endpoint);
    const existing = await store.get(key, { type: "json" });
    if (existing && existing.tokenHash !== tokenHash)
      return new Response("Forbidden", { status: 403 });
    if (request.method === "DELETE") {
      await store.delete(key);
      return new Response(null, { status: 204 });
    }
    const p = parsed!.preferences;
    calculateSchedule(
      p.location,
      dateInZone(new Date(), timezoneFor(p.location)),
      p,
    );
    const value = { ...parsed, tokenHash, expires: Date.now() + 90 * 86400000 };
    if (existing) await store.setJSON(key, value);
    else {
      const result = await store.setJSON(key, value, { onlyIfNew: true });
      if (!result.modified)
        return new Response("Retry subscription", { status: 409 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response("Invalid reminder settings", { status: 400 });
  }
}
export const config = {
  path: "/api/push",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
