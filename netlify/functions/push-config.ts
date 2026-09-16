export default async function () {
  return Response.json(
    {
      publicKey:
        process.env.VAPID_PUBLIC_KEY &&
        process.env.VAPID_PRIVATE_KEY &&
        process.env.VAPID_SUBJECT
          ? process.env.VAPID_PUBLIC_KEY
          : null,
      syncEnabled: process.env.SYNC_ENABLED === "true",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export const config = { path: "/api/push-config" };
