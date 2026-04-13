import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCountdown, getNextPrayer, type PrayerTimes } from "@/lib/prayer-api";

interface Props {
  times: PrayerTimes;
  onNextPrayerChange?: (name: string) => void;
}

export default function CountdownTimer({ times, onNextPrayerChange }: Props) {
  const [remaining, setRemaining] = useState(() => getNextPrayer(times));

  useEffect(() => {
    const tick = () => {
      const next = getNextPrayer(times);
      setRemaining(next);
      onNextPrayerChange?.(next.name);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [times, onNextPrayerChange]);

  const parts = formatCountdown(remaining.remainingMs).split(":");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="gradient-islamic islamic-pattern relative overflow-hidden rounded-3xl p-7 text-center text-primary-foreground glow-primary"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15" />
      <div className="absolute top-3 right-3 h-20 w-20 rounded-full bg-white/5 blur-xl" />
      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          Next Prayer
        </p>
        <h2 className="mt-1.5 text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {remaining.name}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          {parts.map((part, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <span className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-body)' }}>
                  {part}
                </span>
              </div>
              {i < parts.length - 1 && (
                <span className="text-2xl font-light opacity-50">:</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-8">
          {["hours", "min", "sec"].map((label) => (
            <span key={label} className="text-[10px] font-medium uppercase tracking-wider opacity-50" style={{ fontFamily: 'var(--font-body)' }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
