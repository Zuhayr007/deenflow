import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import { z } from "zod";
import { bearer, readBody, sameOrigin } from "../../src/server/validation";
const envelope = z.object({
  iv: z.string().regex(/^[A-Za-z0-9+/]{16}$/),
  ciphertext: z
    .string()
    .min(24)
    .max(100000)
    .regex(/^[A-Za-z0-9+/]+=*$/),
});
export default async function (request: Request) {
  if (process.env.SYNC_ENABLED !== "true")
    return new Response("Cloud backup is not enabled", { status: 503 });
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (!["GET", "PUT", "DELETE"].includes(request.method))
    return new Response("Method not allowed", { status: 405 });
  try {
    const key = createHash("sha256").update(bearer(request)).digest("hex");
    const store = getStore({ name: "deenflow-vaults", consistency: "strong" });
    if (request.method === "DELETE") {
      await store.delete(key);
      return new Response(null, { status: 204 });
    }
    if (request.method === "PUT") {
      await store.setJSON(key, envelope.parse(await readBody(request, 110000)));
      return new Response(null, { status: 204 });
    }
    const value = await store.get(key, { type: "json" });
    return value
      ? Response.json(value, { headers: { "Cache-Control": "no-store" } })
      : new Response("Backup not found", { status: 404 });
  } catch {
    return new Response("Invalid backup request", { status: 400 });
  }
}
export const config = {
  path: "/api/sync",
  rateLimit: { windowLimit: 15, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
