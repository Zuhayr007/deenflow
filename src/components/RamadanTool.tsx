import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePrayer } from "@/hooks/use-prayer";
import { formatCountdown, formatTime12h } from "@/lib/prayer-api";
import { readLocal, writeLocal } from "@/lib/storage";
import Timetable from "./Timetable";
import LocationStatus from "./LocationStatus";
export default function RamadanTool() {
  const { preferences, schedules } = usePrayer();
  const [now, setNow] = useState(Date.now()),
    [offset, setOffset] = useState(0),
    [completed, setCompleted] = useState<number[]>([]);
  useEffect(() => {
    setOffset(readLocal("deenflow-hijri-offset", 0));
    setCompleted(readLocal("deenflow-reading-plan", []));
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const today = schedules[0];
  const nextFajr = schedules.find((s) => s.instants.Fajr > now),
    nextMaghrib = schedules.find((s) => s.instants.Maghrib > now);
  const hijri = new Intl.DateTimeFormat("en", {
    calendar: "islamic-umalqura",
    timeZone: today?.timezone || "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(now + offset * 86400000));
  return (
    <>
      <LocationStatus />
      <div className="panel space-y-3">
        <h2 className="text-xl">{hijri}</h2>
        <p className="text-xs text-muted-foreground">
          Estimated Hijri date (Umm al-Qura). Follow local moon-sighting
          announcements for Ramadan and Eid.
        </p>
        <label className="field">
          Local calendar adjustment
          <select
            value={offset}
            onChange={(e) => {
              setOffset(Number(e.target.value));
              writeLocal("deenflow-hijri-offset", Number(e.target.value));
            }}
          >
            {[-2, -1, 0, 1, 2].map((n) => (
              <option key={n} value={n}>
                {n > 0 ? "+" : ""}
                {n} days
              </option>
            ))}
          </select>
        </label>
      </div>
      {today && (
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Next Fajr", nextFajr, "Fajr"],
            ["Next Maghrib", nextMaghrib, "Maghrib"],
          ].map(([label, schedule, prayer]) => {
            const s = schedule as typeof today | undefined;
            const p = prayer as "Fajr" | "Maghrib";
            return (
              s && (
                <div className="panel text-center" key={String(label)}>
                  <h2>{String(label)}</h2>
                  <p className="text-lg font-bold tabular-nums mt-2">
                    {formatCountdown(s.instants[p] - now)}
                  </p>
                  <p className="text-xs">
                    {s.date} · {formatTime12h(s.times[p])}
                  </p>
                </div>
              )
            );
          })}
        </div>
      )}
      <p className="text-sm">
        Use the Fajr countdown to prepare for the start of fasting and Maghrib
        for iftar on fasting days. Confirm your local timetable; this tool does
        not determine which days you should fast.
      </p>
      <section className="panel space-y-3">
        <h2 className="text-xl">30-day Quran reading plan</h2>
        <p className="text-sm">
          Read one juz each day. Mark your own progress; there are no public
          streaks.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
            <button
              className={"action " + (completed.includes(n) ? "" : "secondary")}
              key={n}
              aria-pressed={completed.includes(n)}
              aria-label={
                "Juz " + n + (completed.includes(n) ? " complete" : "")
              }
              onClick={() => {
                const next = completed.includes(n)
                  ? completed.filter((d) => d !== n)
                  : [...completed, n];
                setCompleted(next);
                writeLocal("deenflow-reading-plan", next);
              }}
            >
              {n}
              {completed.includes(n) ? " ✓" : ""}
            </button>
          ))}
        </div>
        <Link to="/quran" className="text-primary">
          Open Quran →
        </Link>
      </section>
      {preferences.location && (
        <Timetable location={preferences.location} preferences={preferences} />
      )}
    </>
  );
}
