import type { PrayerPreferences } from "./prayer-api";
import type { NotificationSettings } from "./reminders";
import { readLocal, writeLocal } from "./storage";
export async function serviceWorker() {
  if (!("serviceWorker" in navigator))
    throw Error("This browser does not support background notifications.");
  const registration = await navigator.serviceWorker.register("/sw.js");
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              Error(
                "The app is still preparing offline support. Try again shortly.",
              ),
            ),
          12000,
        );
      }),
    ]);
    return registration;
  } finally {
    clearTimeout(timer);
  }
}
export async function showReminder(
  title: string,
  options: NotificationOptions,
) {
  if ("serviceWorker" in navigator) {
    const sw = await serviceWorker();
    await sw.showNotification(title, {
      ...options,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });
  } else new Notification(title, options);
}
export async function configurePush(
  preferences: PrayerPreferences,
  settings: NotificationSettings,
) {
  const sw = await serviceWorker();
  const response = await fetch("/api/push-config");
  if (!response.ok)
    throw Error(
      "Background reminders are not enabled on this server. Foreground reminders still work.",
    );
  const config = await response.json();
  if (!config.publicKey)
    throw Error(
      "Background reminders need server setup. Foreground reminders still work.",
    );
  const key = Uint8Array.from(
    atob(config.publicKey.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
  const subscription =
    (await sw.pushManager.getSubscription()) ||
    (await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    }));
  let token = readLocal<string>("deenflow-push-token", "");
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
      n.toString(16).padStart(2, "0"),
    ).join("");
    writeLocal("deenflow-push-token", token);
  }
  const saved = await fetch("/api/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      preferences,
      settings,
    }),
  });
  if (!saved.ok)
    throw Error("Background reminders could not be saved. Please retry.");
  writeLocal("deenflow-push-active", true);
}
export async function disablePush() {
  if (!("serviceWorker" in navigator)) return;
  const sw = await navigator.serviceWorker.getRegistration();
  const subscription = await sw?.pushManager.getSubscription();
  if (subscription) {
    // Unsubscribe at the push provider even when the application server is offline.
    const endpoint = subscription.endpoint;
    if (!(await subscription.unsubscribe()))
      throw Error(
        "Could not disable background reminders. Retry while online.",
      );
    await fetch("/api/push", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + readLocal("deenflow-push-token", ""),
      },
      body: JSON.stringify({ endpoint }),
    }).catch(() => undefined);
  }
  writeLocal("deenflow-push-active", false);
}
