import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSchedule,
  DEFAULT_PREFERENCES,
  getNextScheduledPrayer,
  dateInZone,
  addDays,
  calendarExport,
} from "../src/lib/prayer-api";
import { CITIES } from "../src/lib/cities";
import {
  isQuiet,
  NOTIFICATION_DEFAULTS,
  reminderEvents,
} from "../src/lib/reminders";
import {
  encryptBackup,
  decryptBackup,
  newRecoveryKey,
  validateBackup,
} from "../src/lib/backup";
import { DUAS } from "../src/lib/duas-data";
import { duaContent } from "../src/lib/dua-content";
import { pushSchema, safePushEndpoint } from "../src/server/validation";
import { readFile } from "node:fs/promises";
test("dua transliterations stay readable and remove Arabic diacritics", () => {
  const first = duaContent(DUAS[0]).transliteration;
  const second = duaContent(DUAS[1]).transliteration;
  const prayer = duaContent(DUAS[15]).transliteration;

  assert.match(first, /rabana|zalamna/i);
  assert.match(second, /rabbi|ghfir|tub/i);
  assert.match(prayer, /bismi|allaahi|alaaliymu|allah/i);
  assert.doesNotMatch(first, /[ا-ي]/);
  assert.doesNotMatch(first, /\s{2,}/);
});

test("after Isha uses the actual next-day Fajr instant", () => {
  const schedules = ["2026-09-16", "2026-09-17"].map((date) =>
    calculateSchedule(CITIES[0], date),
  );
  const now = schedules[0].instants.Isha + 60000;
  const next = getNextScheduledPrayer(schedules, now)!;
  assert.equal(next.name, "Fajr");
  assert.equal(next.at, schedules[1].instants.Fajr);
  assert.notEqual(next.at, schedules[0].instants.Fajr + 86400000);
  assert.ok(next.remainingMs > 0);
});
test("location date and month rollover are independent of device timezone", () => {
  assert.equal(
    dateInZone(new Date("2026-09-16T23:30:00Z"), "Africa/Johannesburg"),
    "2026-09-17",
  );
  assert.equal(
    dateInZone(new Date("2026-09-16T23:30:00Z"), "America/New_York"),
    "2026-09-16",
  );
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
  const cape = calculateSchedule(CITIES[0], "2026-09-16");
  const fajr = new Date(cape.instants.Fajr);
  assert.equal(
    cape.times.Fajr,
    String((fajr.getUTCHours() + 2) % 24).padStart(2, "0") +
      ":" +
      String(fajr.getUTCMinutes()).padStart(2, "0"),
  );
});
test("Asr convention and adjustments change only the intended times", () => {
  const a = calculateSchedule(CITIES[0], "2026-09-16");
  const b = calculateSchedule(CITIES[0], "2026-09-16", {
    ...DEFAULT_PREFERENCES,
    hanafi: true,
  });
  assert.ok(b.instants.Asr > a.instants.Asr);
  assert.equal(b.instants.Fajr, a.instants.Fajr);
  const c = calculateSchedule(CITIES[0], "2026-09-16", {
    ...DEFAULT_PREFERENCES,
    adjustments: { ...DEFAULT_PREFERENCES.adjustments, Fajr: 7 },
  });
  assert.equal(c.instants.Fajr - a.instants.Fajr, 7 * 60000);
  assert.equal(c.instants.Dhuhr, a.instants.Dhuhr);
  assert.throws(() =>
    calculateSchedule(
      { city: "Bad", latitude: 91, longitude: 0 },
      "2026-09-16",
    ),
  );
});
test("DST changes formatting without reinterpreting absolute prayer instants", () => {
  const london = {
    city: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: "Europe/London",
  };
  for (const day of ["2026-03-28", "2026-03-29", "2026-10-24", "2026-10-25"]) {
    const s = calculateSchedule(london, day);
    assert.equal(
      s.times.Dhuhr,
      new Intl.DateTimeFormat("en-GB", {
        timeZone: london.timezone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(s.instants.Dhuhr),
    );
  }
});
test("reminders respect per-prayer, advance and overnight quiet settings", () => {
  const schedule = calculateSchedule(CITIES[0], "2026-09-16");
  const settings = {
    ...NOTIFICATION_DEFAULTS,
    enabled: true,
    prayers: ["Fajr"] as const,
  };
  const events = reminderEvents([schedule], {
    ...settings,
    prayers: [...settings.prayers],
  });
  assert.equal(events.length, 2);
  assert.equal(events[0].at - events[1].at, 5 * 60000);
  assert.equal(
    reminderEvents([schedule], {
      ...NOTIFICATION_DEFAULTS,
      enabled: true,
      minutesBefore: 0,
      atTime: false,
    }).length,
    0,
  );
  assert.equal(
    isQuiet(
      Date.parse("2026-09-16T21:30Z"),
      "Africa/Johannesburg",
      "22:00",
      "06:00",
    ),
    true,
  );
  assert.equal(
    isQuiet(
      Date.parse("2026-09-16T10:00Z"),
      "Africa/Johannesburg",
      "22:00",
      "06:00",
    ),
    false,
  );
});
test("calendar export contains five UTC events per day and no injected lines", () => {
  const ics = calendarExport(
    [calculateSchedule(CITIES[0], "2026-09-16")],
    "Cape Town\nBEGIN:EVIL",
  );
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 5);
  assert.match(ics, /DTSTART:\d{8}T\d{6}Z/);
  assert.ok(!ics.includes("\nBEGIN:EVIL"));
});
test("backup validates before import and rejects sensitive/unrecognized keys", () => {
  assert.deepEqual(
    validateBackup({ version: 1, data: { "deenflow-bookmarks": [1, 6236] } }),
    { "deenflow-bookmarks": [1, 6236] },
  );
  assert.throws(() =>
    validateBackup({ version: 1, data: { "deenflow-push-token": "secret" } }),
  );
  assert.throws(() =>
    validateBackup({ version: 1, data: { "deenflow-bookmarks": [9000] } }),
  );
});
test("cloud backup encryption round-trips and rejects wrong recovery keys", async () => {
  const key = newRecoveryKey(),
    data = { version: 1, data: { "deenflow-bookmarks": [1, 99] } };
  const encrypted = await encryptBackup(key, data);
  assert.ok(!encrypted.ciphertext.includes("bookmarks"));
  assert.deepEqual(await decryptBackup(key, encrypted), data);
  await assert.rejects(decryptBackup(newRecoveryKey(), encrypted));
});
test("push subscription validation rejects private and attacker-controlled endpoints", () => {
  assert.equal(
    safePushEndpoint("https://fcm.googleapis.com/fcm/send/example"),
    true,
  );
  for (const endpoint of [
    "http://fcm.googleapis.com/x",
    "https://127.0.0.1/x",
    "https://fcm.googleapis.com.attacker.test/x",
    "https://example.com/x",
    "https://fcm.googleapis.com:444/x",
  ])
    assert.equal(safePushEndpoint(endpoint), false);
  assert.equal(pushSchema.safeParse({}).success, false);
});
test("all Quran editions retain 114 surahs and 6236 aligned verses", async () => {
  let global = 0;
  for (let n = 1; n <= 114; n++) {
    const data = JSON.parse(
      await readFile("src/data/quran/" + n + ".json", "utf8"),
    );
    assert.equal(data.surah.number, n);
    assert.equal(data.ayahs.length, data.surah.numberOfAyahs);
    for (const [i, a] of data.ayahs.entries()) {
      global++;
      assert.equal(a.number, global);
      assert.equal(a.numberInSurah, i + 1);
      for (const key of ["text", "translation", "sahih", "transliteration"])
        assert.ok(a[key].length > 0);
    }
  }
  assert.equal(global, 6236);
});

test("Umm al-Qura Ramadan Isha includes the documented longer interval", () => {
  const location = {
    city: "Makkah",
    latitude: 21.4225,
    longitude: 39.8262,
    timezone: "Asia/Riyadh",
  };
  const settings = { ...DEFAULT_PREFERENCES, method: "UmmAlQura" as const };
  const ramadan = calculateSchedule(location, "2026-03-01", settings);
  const ordinary = calculateSchedule(location, "2026-04-15", settings);
  assert.equal((ramadan.instants.Isha - ramadan.instants.Maghrib) / 60000, 120);
  assert.equal(
    (ordinary.instants.Isha - ordinary.instants.Maghrib) / 60000,
    90,
  );
});
