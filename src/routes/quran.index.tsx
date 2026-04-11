import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSurahs, getLastRead, type Surah } from "@/lib/quran-api";
import { SurahListSkeleton } from "@/components/SkeletonLoader";
import PageHeader from "@/components/PageHeader";

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
      <PageHeader title="Quran" subtitle="114 Surahs • Arabic & English" />

      <div className="px-5 space-y-4">
        <input
          type="text"
          placeholder="Search surahs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {lastRead && (
          <Link
            to="/quran/$surahId"
            params={{ surahId: String(lastRead.surah) }}
            className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 transition-colors hover:bg-primary/10"
          >
            <span className="text-primary">📖</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-primary">Continue Reading</p>
              <p className="text-xs text-muted-foreground">
                Surah {lastRead.surah}, Ayah {lastRead.ayah}
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
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
                transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
              >
                <Link
                  to="/quran/$surahId"
                  params={{ surahId: String(surah.number) }}
                  className="flex items-center gap-4 rounded-xl bg-card p-3.5 transition-all hover:bg-secondary active:scale-[0.98]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{surah.englishName}</p>
                      <p className="font-arabic text-base text-foreground" dir="rtl">{surah.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs • {surah.revelationType}
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
