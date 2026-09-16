import { useEffect, useState } from "react";
import {
  formatCountdown,
  getNextScheduledPrayer,
  formatTime12h,
  dateInZone,
  type Schedule,
} from "@/lib/prayer-api";
export default function CountdownTimer({
  schedules,
  onNextPrayerChange,
}: {
  schedules: Schedule[];
  onNextPrayerChange?: (name: string) => void;
}) {
  const [now, setNow] = useState(Date.now());
  const next = getNextScheduledPrayer(schedules, now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const nextName = next?.date === schedules[0]?.date ? next?.name : "";
  useEffect(() => {
    onNextPrayerChange?.(nextName || "");
  }, [nextName, onNextPrayerChange]);
  if (!next) return null;
  return (
    <div className="gradient-islamic islamic-pattern rounded-3xl p-7 text-center text-primary-foreground shadow-lg">
      <p className="text-xs uppercase tracking-widest">Next prayer</p>
      <h2 className="text-3xl mt-2">{next.name}</h2>
      <p className="text-sm mt-2 opacity-90">
        {next.date === dateInZone(new Date(now), next.timezone)
          ? "Today"
          : "Tomorrow"}{" "}
        at {formatTime12h(next.time)}
      </p>
      <p
        className="text-4xl font-bold tabular-nums mt-5"
        aria-label={"Time until " + next.name}
      >
        {formatCountdown(next.remainingMs)}
      </p>
      <p className="text-xs mt-3 opacity-80">hours · minutes · seconds</p>
    </div>
  );
}
