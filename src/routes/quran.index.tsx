import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSurahs, getLastRead, type Surah } from "@/lib/quran-api";
import { SurahListSkeleton } from "@/components/SkeletonLoader";
import AppHeader from "@/components/AppHeader";

export const Route = createFileRoute("/quran/")({
  head: () => ({
    meta: [
      { title: "Quran — DeenFlow" },
      { name: "description", content: "Read the Holy Quran with Arabic text and English translation." },
      { property: "og:title", content: "Quran — DeenFlow" },
      { property: "og:description", content: "Read the Holy Quran with Arabic text and English translation." },
    ],
  }),
  component: QuranPage,
});

function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const lastRead = getLastRead();

  useEffect(() => {
    fetchSurahs().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
  );

  return (
    <div className="safe-bottom min-h-screen">
      <AppHeader />

      <div className="px-5 pb-2">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Quran</h2>
        <p className="mt-0.5 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          114 Surahs • Arabic & English
        </p>
      </div>

      <div className="px-5 space-y-4 mt-2">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search surahs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 card-elevated"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        {lastRead && (
          <Link
            to="/quran/$surahId"
            params={{ surahId: String(lastRead.surah) }}
            className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-lg">📖</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary" style={{ fontFamily: 'var(--font-body)' }}>Continue Reading</p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                Surah {lastRead.surah}, Ayah {lastRead.ayah}
              </p>
            </div>
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}

        {loading ? (
          <SurahListSkeleton />
        ) : (
          <div className="space-y-1.5">
            {filtered.map((surah, i) => (
              <motion.div
                key={surah.number}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.4), duration: 0.35 }}
              >
                <Link
                  to="/quran/$surahId"
                  params={{ surahId: String(surah.number) }}
                  className="flex items-center gap-4 rounded-2xl bg-card p-4 transition-all duration-200 hover:shadow-md active:scale-[0.98] card-elevated"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-body)' }}>
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>{surah.englishName}</p>
                      <p className="font-arabic text-base text-foreground" dir="rtl">{surah.name}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                      {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
