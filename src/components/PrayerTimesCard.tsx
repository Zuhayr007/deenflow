import { motion } from "framer-motion";
import { formatTime12h, type PrayerTimes } from "@/lib/prayer-api";

interface Props {
  times: PrayerTimes;
  nextPrayer: string;
}

const PRAYER_META: Record<string, { icon: string; gradient: string }> = {
  Fajr: { icon: "🌅", gradient: "from-amber-500/10 to-orange-500/5" },
  Dhuhr: { icon: "☀️", gradient: "from-yellow-500/10 to-amber-500/5" },
  Asr: { icon: "🌤️", gradient: "from-sky-500/10 to-blue-500/5" },
  Maghrib: { icon: "🌇", gradient: "from-orange-500/10 to-rose-500/5" },
  Isha: { icon: "🌙", gradient: "from-indigo-500/10 to-purple-500/5" },
};

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function PrayerTimesCard({ times, nextPrayer }: Props) {
  return (
    <div className="space-y-2">
      {PRAYERS.map((prayer, i) => {
        const isNext = prayer === nextPrayer;
        const meta = PRAYER_META[prayer];
        return (
          <motion.div
            key={prayer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
            className={`group flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
              isNext
                ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                : "bg-card card-elevated hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isNext ? "bg-white/15" : `bg-gradient-to-br ${meta.gradient}`
              }`}>
                <span className="text-lg">{meta.icon}</span>
              </div>
              <div>
                <span className={`text-sm font-semibold ${isNext ? "" : "text-foreground"}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {prayer}
                </span>
                {isNext && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 animate-pulse" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                      Up Next
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className={`text-base font-semibold tabular-nums ${isNext ? "" : "text-foreground"}`} style={{ fontFamily: 'var(--font-body)' }}>
              {formatTime12h(times[prayer as keyof PrayerTimes])}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
