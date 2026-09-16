import { z } from "zod";
import { METHODS, PRAYERS } from "../lib/prayer-api";
const clock = z.union([
  z.literal(""),
  z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
]);
export const preferencesSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    city: z.string().min(1).max(80),
    timezone: z.string().max(80).optional(),
  }),
  method: z.enum(
    Object.keys(METHODS) as [keyof typeof METHODS, ...(keyof typeof METHODS)[]],
  ),
  hanafi: z.boolean(),
  highLatitude: z.enum(["middle", "seventh", "angle"]),
  adjustments: z.object({
    Fajr: z.number().int().min(-60).max(60),
    Dhuhr: z.number().int().min(-60).max(60),
    Asr: z.number().int().min(-60).max(60),
    Maghrib: z.number().int().min(-60).max(60),
    Isha: z.number().int().min(-60).max(60),
  }),
});
export const notificationSchema = z.object({
  enabled: z.boolean(),
  sound: z.boolean(),
  minutesBefore: z.number().int().min(0).max(60),
  prayers: z.array(z.enum(PRAYERS)).max(5),
  atTime: z.boolean(),
  quietStart: clock,
  quietEnd: clock,
  adhkar: z.boolean(),
});
export function safePushEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint);
    return (
      url.protocol === "https:" &&
      !url.port &&
      !url.username &&
      !url.password &&
      /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9-]+\.notify\.windows\.com)$/.test(
        url.hostname,
      )
    );
  } catch {
    return false;
  }
}
export const pushSchema = z.object({
  subscription: z.object({
    endpoint: z.string().max(2048).refine(safePushEndpoint),
    expirationTime: z.number().nullable().optional(),
    keys: z.object({
      p256dh: z.string().regex(/^[A-Za-z0-9_-]{80,100}$/),
      auth: z.string().regex(/^[A-Za-z0-9_-]{20,30}$/),
    }),
  }),
  preferences: preferencesSchema,
  settings: notificationSchema,
});
export function bearer(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw Error("A valid recovery token is required.");
  return token;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
export async function readBody(request: Request, max = 100000) {
  if (Number(request.headers.get("content-length")) > max)
    throw Error("Request is too large.");
  const text = await request.text();
  if (text.length > max) throw Error("Request is too large.");
  return JSON.parse(text);
}
