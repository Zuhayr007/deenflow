import { useState } from "react";
import {
  addDays,
  calculateSchedule,
  calendarExport,
  dateInZone,
  DEFAULT_PREFERENCES,
  METHODS,
  PRAYERS,
  timezoneFor,
  type Location,
  type PrayerPreferences,
} from "@/lib/prayer-api";
export function saveDownload(name: string, data: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function Timetable({
  location,
  preferences = DEFAULT_PREFERENCES,
}: {
  location: Location;
  preferences?: PrayerPreferences;
}) {
  const today = dateInZone(new Date(), timezoneFor(location));
  const [month, setMonth] = useState(today.slice(0, 7));
  const first = month + "-01";
  const days = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5)),
    0,
  ).getDate();
  let error = "";
  const schedules: ReturnType<typeof calculateSchedule>[] = [];
  try {
    for (let n = 0; n < days; n++)
      schedules.push(
        calculateSchedule(location, addDays(first, n), preferences),
      );
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <section className="space-y-4">
      <label className="field">
        Timetable month
        <input
          type="month"
          min="2020-01"
          max="2100-12"
          value={month}
          onChange={(e) => {
            if (/^\d{4}-\d{2}$/.test(e.target.value)) setMonth(e.target.value);
          }}
        />
      </label>
      <p className="text-xs text-muted-foreground">
        {location.city} · {timezoneFor(location)} ·{" "}
        {METHODS[preferences.method]} ·{" "}
        {preferences.hanafi ? "Hanafi" : "Standard"} Asr
      </p>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-xs tabular-nums">
              <caption className="sr-only">
                {location.city} prayer timetable for {month}
              </caption>
              <thead>
                <tr>
                  {[
                    "Day",
                    "Fajr",
                    "Sunrise",
                    "Dhuhr",
                    "Asr",
                    "Maghrib",
                    "Isha",
                  ].map((h) => (
                    <th className="p-2 text-left" key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr
                    key={s.date}
                    className={
                      s.date === today ? "bg-primary/10 font-bold" : "border-t"
                    }
                  >
                    <th scope="row" className="p-2">
                      {s.date.slice(-2)}
                    </th>
                    {(
                      [
                        "Fajr",
                        "Sunrise",
                        "Dhuhr",
                        "Asr",
                        "Maghrib",
                        "Isha",
                      ] as const
                    ).map((p) => (
                      <td className="p-2" key={p}>
                        {s.times[p]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button
              className="action"
              onClick={() =>
                saveDownload(
                  "deenflow-" + month + ".ics",
                  calendarExport(schedules, location.city),
                  "text/calendar",
                )
              }
            >
              Export calendar
            </button>
            <button className="action secondary" onClick={() => window.print()}>
              Print timetable
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Calendar exports contain the {PRAYERS.length} daily prayer start
            times for this month. Export a new calendar when your location or
            settings change.
          </p>
        </>
      )}
    </section>
  );
}
