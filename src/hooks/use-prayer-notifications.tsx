import { useCallback, useEffect, useState } from "react";
import type { PrayerTimes } from "@/lib/prayer-api";

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  minutesBefore: number;
}

const KEY = "deenflow-notifications";
const EVENT = "deenflow-notifications-change";

const DEFAULTS: NotificationSettings = { enabled: false, sound: true, minutesBefore: 5 };

export function readSettings(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function writeSettings(s: NotificationSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Settings state, synced across components. */
export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULTS);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setSettings(readSettings());
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
    const sync = () => setSettings(readSettings());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const update = useCallback((patch: Partial<NotificationSettings>) => {
    const next = { ...readSettings(), ...patch };
    writeSettings(next);
    setSettings(next);
  }, []);

  const toggleEnabled = useCallback(async () => {
    const current = readSettings();
    if (current.enabled) {
      update({ enabled: false });
      return;
    }
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      return;
    }
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;
    update({ enabled: true });
    new Notification("DeenFlow reminders on", {
      body: `You'll be alerted ${current.minutesBefore} minutes before each salah.`,
      icon: "/icon-192.png",
      silent: !current.sound,
    });
  }, [update]);

  return { settings, permission, update, toggleEnabled };
}

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

/** Schedules a reminder before each remaining prayer today (while the app is open). */
export function usePrayerNotifications(times: PrayerTimes | null) {
  const { settings } = useNotificationSettings();

  useEffect(() => {
    if (!times || !settings.enabled) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = Date.now();

    const schedule = (delay: number, title: string, body: string, tag: string) => {
      if (delay <= 0 || delay > 24 * 60 * 60_000) return;
      timers.push(
        setTimeout(() => {
          new Notification(title, {
            body,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag,
            silent: !settings.sound,
          });
        }, delay)
      );
    };

    for (const prayer of PRAYERS) {
      const [h, m] = times[prayer].split(":").map(Number);
      const at = new Date();
      at.setHours(h, m, 0, 0);
      const startAt = at.getTime();

      schedule(
        startAt - settings.minutesBefore * 60_000 - now,
        `${prayer} in ${settings.minutesBefore} minutes`,
        `${prayer} begins at ${times[prayer]}. Time to prepare for salah.`,
        `deenflow-${prayer}-before`
      );

      schedule(
        startAt - now,
        `It's time for ${prayer}`,
        `${prayer} has begun at ${times[prayer]}. Hayya 'ala-s-Salah.`,
        `deenflow-${prayer}-start`
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [times, settings.enabled, settings.sound, settings.minutesBefore]);
}
