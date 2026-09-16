import { z } from "zod";
import { readLocal, writeLocal } from "./storage";
const bounded = z.string().max(1000);
export const backupSchemas = {
  "deenflow-bookmarks": z.array(z.number().int().min(1).max(6236)).max(6236),
  "deenflow-lastread": z
    .object({
      surah: z.number().int().min(1).max(114),
      ayah: z.number().int().min(1).max(286),
    })
    .nullable(),
  "deenflow-dua-favourites": z.array(z.number().int().min(1).max(58)).max(58),
  "deenflow-theme": z.enum(["light", "dark", "system"]),
  "deenflow-reader": z.object({
    size: z.number().min(20).max(44),
    translation: z.enum(["asad", "sahih"]),
    translit: z.boolean(),
  }),
  "deenflow-hijri-offset": z.number().int().min(-2).max(2),
  "deenflow-reading-plan": z.array(z.number().int().min(1).max(30)).max(30),
  "deenflow-masjid": z.object({
    name: bounded,
    address: bounded,
    source: bounded,
    confirmed: z.string().max(10),
    jummah: bounded,
    times: z
      .record(z.string().max(20), z.string().regex(/^\d{2}:\d{2}$/))
      .refine((v) => Object.keys(v).length <= 5),
  }),
};
export function exportBackup() {
  return {
    version: 1,
    exported: new Date().toISOString(),
    data: Object.fromEntries(
      Object.keys(backupSchemas)
        .map((key) => [key, readLocal(key, null)])
        .filter(([, value]) => value !== null),
    ),
  };
}
export function validateBackup(input: unknown) {
  const envelope = z
    .object({ version: z.literal(1), data: z.record(z.unknown()) })
    .parse(input);
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(envelope.data)) {
    const schema = backupSchemas[key as keyof typeof backupSchemas];
    if (!schema) throw Error("Backup contains unsupported settings.");
    data[key] = schema.parse(value);
  }
  return data;
}
export function restoreBackup(input: unknown) {
  const data = validateBackup(input);
  for (const [key, value] of Object.entries(data)) {
    if (!writeLocal(key, value))
      throw Error(
        "Device storage is unavailable. Your backup file is unchanged.",
      );
  }
}
const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
export function newRecoveryKey() {
  return hex(crypto.getRandomValues(new Uint8Array(32)));
}
async function derive(recovery: string, purpose: string) {
  if (!/^[a-f0-9]{64}$/.test(recovery))
    throw Error("Enter the 64-character recovery key.");
  return await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(purpose + ":" + recovery),
  );
}
export async function vaultToken(recovery: string) {
  return hex(new Uint8Array(await derive(recovery, "auth")));
}
export async function encryptBackup(recovery: string, value: unknown) {
  const key = await crypto.subtle.importKey(
    "raw",
    await derive(recovery, "encryption"),
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bytes = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(value)),
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(bytes))),
  };
}
export async function decryptBackup(
  recovery: string,
  envelope: { iv: string; ciphertext: string },
) {
  const key = await crypto.subtle.importKey(
    "raw",
    await derive(recovery, "encryption"),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const decode = (s: string) =>
    Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const bytes = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decode(envelope.iv) },
    key,
    decode(envelope.ciphertext),
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}
