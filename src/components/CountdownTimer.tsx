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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="gradient-islamic islamic-pattern relative overflow-hidden rounded-2xl p-6 text-center text-primary-foreground shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
      <div className="relative z-10">
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">
          Next Prayer
        </p>
        <h2 className="mt-1 text-2xl font-bold">{remaining.name}</h2>
        <p className="mt-3 font-mono text-4xl font-bold tracking-wider">
          {formatCountdown(remaining.remainingMs)}
        </p>
        <p className="mt-2 text-xs opacity-70">hours : minutes : seconds</p>
      </div>
    </motion.div>
  );
}
