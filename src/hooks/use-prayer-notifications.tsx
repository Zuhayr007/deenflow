import { useCallback, useEffect, useState } from "react";
import { readLocal, writeLocal } from "@/lib/storage";
import {
  NOTIFICATION_DEFAULTS,
  reminderEvents,
  type NotificationSettings,
} from "@/lib/reminders";
import { showReminder, configurePush, disablePush } from "@/lib/push";
import { usePrayer } from "./use-prayer";
export type { NotificationSettings } from "@/lib/reminders";
export function readSettings(): NotificationSettings {
  return {
    ...NOTIFICATION_DEFAULTS,
    ...readLocal<Partial<NotificationSettings>>("deenflow-notifications", {}),
  };
}
export function useNotificationSettings() {
  const [settings, setSettings] = useState(NOTIFICATION_DEFAULTS),
    [permission, setPermission] = useState<
      NotificationPermission | "unsupported"
    >("default"),
    [error, setError] = useState("");
  useEffect(() => {
    const sync = () => {
      setSettings((previous) => {
        const next = readSettings();
        return JSON.stringify(previous) === JSON.stringify(next)
          ? previous
          : next;
      });
      setPermission(
        typeof Notification === "undefined"
          ? "unsupported"
          : Notification.permission,
      );
    };
    sync();
    window.addEventListener("deenflow-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("deenflow-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const update = useCallback((patch: Partial<NotificationSettings>) => {
    const next = { ...readSettings(), ...patch };
    writeLocal("deenflow-notifications", next);
    setSettings(next);
  }, []);
  const toggleEnabled = useCallback(async () => {
    setError("");
    try {
      if (readSettings().enabled) {
        await disablePush();
        update({ enabled: false });
        return;
      }
      if (typeof Notification === "undefined") {
        setPermission("unsupported");
        return;
      }
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p === "granted") {
        update({ enabled: true });
        await showReminder("DeenFlow reminders enabled", {
          body: "Keep DeenFlow open for foreground reminders. Enable background reminders in settings.",
          silent: !readSettings().sound,
        });
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, [update]);
  return { settings, permission, update, toggleEnabled, error };
}
export function PrayerReminders() {
  const { settings } = useNotificationSettings(),
    { schedules, preferences } = usePrayer();
  useEffect(() => {
    if (
      !settings.enabled ||
      !preferences.location ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    )
      return;
    let cancelled = false;
    // Synchronize active background subscriptions whenever prayer or alert preferences change.
    if (readLocal("deenflow-push-active", false))
      void configurePush(preferences, settings).catch(() => {
        window.dispatchEvent(new CustomEvent("deenflow-push-error"));
      });
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const event of reminderEvents(schedules, settings)) {
      const delay = event.at - Date.now();
      if (delay <= 0 || delay > 86400000) continue;
      timers.push(
        setTimeout(() => {
          if (cancelled || readLocal("deenflow-push-active", false)) return;
          const fired = readLocal<Record<string, number>>("deenflow-fired", {});
          if (fired[event.tag]) return;
          const recent = Object.fromEntries(
            Object.entries(fired).filter(
              ([, at]) => at > Date.now() - 172800000,
            ),
          );
          recent[event.tag] = Date.now();
          try {
            localStorage.setItem("deenflow-fired", JSON.stringify(recent));
          } catch {
            /* Storage is optional. */
          }
          void showReminder(event.title, {
            body: event.body,
            tag: event.tag,
            silent: !settings.sound,
          }).catch(() => undefined);
        }, delay),
      );
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [schedules, preferences, settings]);
  return null;
}
