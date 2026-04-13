import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getUserLocation,
  fetchPrayerTimes,
  type PrayerTimes,
  type Location,
} from "@/lib/prayer-api";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import CountdownTimer from "@/components/CountdownTimer";
import { PrayerSkeleton, CountdownSkeleton } from "@/components/SkeletonLoader";
import AppHeader from "@/components/AppHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DeenFlow — Prayer Times & Islamic Companion" },
      { name: "description", content: "Your daily Islamic companion with prayer times, Quran, and duas." },
      { property: "og:title", content: "DeenFlow — Prayer Times & Islamic Companion" },
      { property: "og:description", content: "Your daily Islamic companion with prayer times, Quran, and duas." },
    ],
  }),
  component: PrayerPage,
});

function PrayerPage() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [nextPrayer, setNextPrayer] = useState("Fajr");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loc = await getUserLocation();
      setLocation(loc);
      const t = await fetchPrayerTimes(loc);
      setTimes(t);
      setLoading(false);
    })();
  }, []);

  const handleNextPrayerChange = useCallback((name: string) => {
    setNextPrayer(name);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="safe-bottom min-h-screen">
      <AppHeader />

      <div className="px-5 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {dateStr}
            </p>
            {location && (
              <p className="mt-0.5 text-xs text-muted-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
                📍 {location.city}
              </p>
            )}
          </div>
        </motion.div>

        {loading ? (
          <>
            <CountdownSkeleton />
            <PrayerSkeleton />
          </>
        ) : times ? (
          <>
            <CountdownTimer times={times} onNextPrayerChange={handleNextPrayerChange} />
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                Today's Prayers
              </h3>
              <PrayerTimesCard times={times} nextPrayer={nextPrayer} />
            </div>
          </>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-gold/10 p-5 text-center"
        >
          <div className="absolute inset-0 shimmer" />
          <p className="relative font-arabic text-xl leading-relaxed text-foreground" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="relative mt-2 text-xs font-medium text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </motion.div>
      </div>
    </div>
  );
}
