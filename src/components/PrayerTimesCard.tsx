import { motion } from "framer-motion";
import { formatTime12h, type PrayerTimes } from "@/lib/prayer-api";

interface Props {
  times: PrayerTimes;
  nextPrayer: string;
}

const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌙",
};

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function PrayerTimesCard({ times, nextPrayer }: Props) {
  return (
    <div className="space-y-2">
      {PRAYERS.map((prayer, i) => {
        const isNext = prayer === nextPrayer;
        return (
          <motion.div
            key={prayer}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`flex items-center justify-between rounded-xl px-4 py-3.5 transition-all ${
              isNext
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{PRAYER_ICONS[prayer]}</span>
              <span className={`font-medium ${isNext ? "" : "text-foreground"}`}>{prayer}</span>
              {isNext && (
                <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  Next
                </span>
              )}
            </div>
            <span className={`font-semibold tabular-nums ${isNext ? "" : "text-foreground"}`}>
              {formatTime12h(times[prayer as keyof PrayerTimes])}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
