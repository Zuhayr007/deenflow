import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes as AdhanTimes,
} from "adhan";
import tzLookup from "tz-lookup";
export const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type Prayer = (typeof PRAYERS)[number];
export type PrayerTimes = Record<Prayer | "Sunrise", string>;
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  timezone?: string;
}
export const METHODS = {
  NorthAmerica: "North America (ISNA)",
  MuslimWorldLeague: "Muslim World League",
  Egyptian: "Egyptian",
  Karachi: "Karachi",
  UmmAlQura: "Umm al-Qura",
  MoonsightingCommittee: "Moonsighting Committee",
  Singapore: "Singapore",
};
export interface PrayerPreferences {
  location: Location | null;
  method: keyof typeof METHODS;
  hanafi: boolean;
  adjustments: Record<Prayer, number>;
  highLatitude: "middle" | "seventh" | "angle";
}
export const DEFAULT_PREFERENCES: PrayerPreferences = {
  location: null,
  method: "NorthAmerica",
  hanafi: false,
  adjustments: { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
  highLatitude: "middle",
};
export interface Schedule {
  date: string;
  timezone: string;
  times: PrayerTimes;
  instants: Record<Prayer | "Sunrise", number>;
}
export function timezoneFor(location: Location) {
  return location.timezone || tzLookup(location.latitude, location.longitude);
}
export function dateInZone(now: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function addDays(date: string, days: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function calculateSchedule(
  location: Location,
  date: string,
  preferences: PrayerPreferences = DEFAULT_PREFERENCES,
): Schedule {
  if (
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude) ||
    Math.abs(location.latitude) > 90 ||
    Math.abs(location.longitude) > 180
  )
    throw Error("Enter valid coordinates.");
  const [y, m, d] = date.split("-").map(Number),
    params = CalculationMethod[preferences.method]();
  params.madhab = preferences.hanafi ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule =
    preferences.highLatitude === "seventh"
      ? HighLatitudeRule.SeventhOfTheNight
      : preferences.highLatitude === "angle"
        ? HighLatitudeRule.TwilightAngle
        : HighLatitudeRule.MiddleOfTheNight;
  for (const p of PRAYERS)
    params.adjustments[p.toLowerCase() as "fajr"] = Math.max(
      -60,
      Math.min(60, Number(preferences.adjustments[p]) || 0),
    );
  // Umm al-Qura uses a longer fixed Isha interval during Ramadan.
  if (preferences.method === "UmmAlQura") {
    const month = new Intl.DateTimeFormat("en", {
      calendar: "islamic-umalqura",
      month: "numeric",
      timeZone: "UTC",
    }).format(new Date(date + "T12:00:00Z"));
    if (month === "9") params.adjustments.isha += 30;
  }
  const calculated = new AdhanTimes(
    new Coordinates(location.latitude, location.longitude),
    new Date(y, m - 1, d),
    params,
  );
  const timezone = timezoneFor(location),
    times = {} as PrayerTimes,
    instants = {} as Schedule["instants"];
  for (const p of [...PRAYERS, "Sunrise"] as const) {
    const value = calculated[p.toLowerCase() as "fajr"];
    if (!Number.isFinite(value.getTime()))
      throw Error(
        "These coordinates need a local high-latitude timetable. Please consult your masjid.",
      );
    times[p] = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(value);
    instants[p] = value.getTime();
  }
  return { date, timezone, times, instants };
}
export function getNextScheduledPrayer(
  schedules: Schedule[],
  now = Date.now(),
) {
  const next = schedules
    .flatMap((s) =>
      PRAYERS.map((name) => ({
        name,
        time: s.times[name],
        at: s.instants[name],
        date: s.date,
        timezone: s.timezone,
      })),
    )
    .filter((e) => e.at > now)
    .sort((a, b) => a.at - b.at)[0];
  return next ? { ...next, remainingMs: next.at - now } : null;
}
export async function getUserLocation(): Promise<Location> {
  if (!navigator.geolocation)
    throw Error(
      "Location is unavailable in this browser. Open DeenFlow in a browser with location access.",
    );
  if (!window.isSecureContext)
    throw Error(
      "Location requires a secure connection. Open DeenFlow over HTTPS.",
    );
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (p) => {
        try {
          resolve({
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
            city: "Current location",
            timezone: tzLookup(p.coords.latitude, p.coords.longitude),
          });
        } catch {
          reject(
            Error(
              "Your device returned an invalid location. Please try again.",
            ),
          );
        }
      },
      (error) =>
        reject(
          Error(
            error.code === 1
              ? "Location permission is blocked. Allow location for DeenFlow in your browser settings, then try again."
              : error.code === 3
                ? "Finding your location took too long. Check that device location services are enabled, then try again."
                : "Your location is unavailable. Enable device location services, then try again.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    ),
  );
}
export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
export function formatTime12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (
    (h % 12 || 12) +
    ":" +
    String(m).padStart(2, "0") +
    " " +
    (h >= 12 ? "PM" : "AM")
  );
}
export function calendarExport(schedules: Schedule[], city: string) {
  const stamp = (ms: number) =>
    new Date(ms)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const clean = (s: string) => s.replace(/[\r\n,;\\]/g, " ");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DeenFlow//Prayer Times//EN",
    "CALSCALE:GREGORIAN",
    ...schedules.flatMap((s) =>
      PRAYERS.flatMap((p) => [
        "BEGIN:VEVENT",
        "UID:" +
          s.date +
          "-" +
          p +
          "-" +
          encodeURIComponent(city) +
          "@deenflow",
        "DTSTAMP:" + stamp(Date.now()),
        "DTSTART:" + stamp(s.instants[p]),
        "DTEND:" + stamp(s.instants[p] + 600000),
        "SUMMARY:" + p + " - " + clean(city),
        "DESCRIPTION:Calculated prayer start. Confirm congregation times with your masjid.",
        "END:VEVENT",
      ]),
    ),
    "END:VCALENDAR",
  ].join("\r\n");
}
