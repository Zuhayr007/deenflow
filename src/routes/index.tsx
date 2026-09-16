import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePrayer } from "@/hooks/use-prayer";
import LocationStatus from "@/components/LocationStatus";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import CountdownTimer from "@/components/CountdownTimer";
import Page from "@/components/Page";
import { DUAS } from "@/lib/duas-data";
import { METHODS, formatTime12h } from "@/lib/prayer-api";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Prayer Times, Quran & Daily Duas",
      "Your daily Islamic companion: local salah times, Quran reading and audio, sourced duas, Qibla and offline tools.",
      "/",
    ),
  component: PrayerPage,
});
function PrayerPage() {
  const { preferences, schedules, error, locationStatus } = usePrayer(),
    [next, setNext] = useState("Fajr"),
    [showPrayerContent, setShowPrayerContent] = useState(false);
  const today = schedules[0];
  const isLoading = locationStatus === "locating" || (!error && !today);

  useEffect(() => {
    if (!isLoading && today) {
      const frame = requestAnimationFrame(() => setShowPrayerContent(true));
      return () => cancelAnimationFrame(frame);
    }
    setShowPrayerContent(false);
    return undefined;
  }, [isLoading, today]);

  const daily =
    DUAS[
      (today ? Math.floor(Date.parse(today.date) / 86400000) : 0) % DUAS.length
    ];

  return (
    <Page
      title="Your daily salah"
      intro="A little space for your deen, every day."
    >
      <LocationStatus />
      {error && (
        <p role="alert" className="panel">
          {error}
        </p>
      )}
      {isLoading ? (
        <div className="panel prayer-loading-shell">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="prayer-loader-ring absolute inset-0 rounded-full border border-primary/10" />
              <div className="prayer-loader-orbit absolute inset-1.5 rounded-full border-2 border-primary/15 border-t-primary border-r-primary/60" />
              <div className="prayer-loader-orbit-alt absolute inset-3 rounded-full border border-primary/20 border-b-primary/70 border-l-primary/40" />
              <div className="absolute inset-6 rounded-full bg-linear-to-br from-primary/20 via-primary/8 to-transparent" />
              <div className="relative h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Calculating your prayer times...
            </p>
          </div>
        </div>
      ) : (
        today && (
          <div
            className={`prayer-card-enter ${showPrayerContent ? "is-visible" : "is-hidden"}`}
          >
            <div className="space-y-4 py-1">
              <div className="flex justify-between text-sm">
                <span>{preferences.location?.city}</span>
                <time>{today.date}</time>
              </div>
              <CountdownTimer schedules={schedules} onNextPrayerChange={setNext} />
              <h2 className="text-lg font-semibold pt-1">Today's prayer times</h2>
              <div className="pt-1 pb-1">
                <PrayerTimesCard times={today.times} nextPrayer={next} />
              </div>
            </div>
          </div>
        )
      )}

      <article
        className={`panel bg-gold/10 text-center prayer-card-enter ${
          showPrayerContent ? "is-visible" : "is-hidden"
        }`}
      >
        <h2 className="text-xs uppercase tracking-widest mb-4">
          Daily dua · {daily.category}
        </h2>
        <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose">
          {daily.arabic}
        </p>
        <p className="text-sm mt-3">{daily.english}</p>
        <p className="text-xs mt-3 text-muted-foreground">{daily.reference}</p>
        <Link to="/duas" className="text-primary text-sm inline-block mt-3">
          Explore duas →
        </Link>
      </article>
    </Page>
  );
}
