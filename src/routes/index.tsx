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
import PageHeader from "@/components/PageHeader";

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
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="safe-bottom min-h-screen pb-4">
      <PageHeader title="DeenFlow" subtitle={location ? `📍 ${location.city}` : "Detecting location..."} />

      <div className="px-5 space-y-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-muted-foreground"
        >
          {dateStr}
        </motion.p>

        {loading ? (
          <>
            <CountdownSkeleton />
            <PrayerSkeleton />
          </>
        ) : times ? (
          <>
            <CountdownTimer times={times} onNextPrayerChange={handleNextPrayerChange} />
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Today's Prayers
              </h3>
              <PrayerTimesCard times={times} nextPrayer={nextPrayer} />
            </div>
          </>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center"
        >
          <p className="font-arabic text-lg text-foreground" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </motion.div>
      </div>
    </div>
  );
}
