import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSurah, toggleBookmark, getBookmarks, setLastRead, type Ayah, type Surah } from "@/lib/quran-api";

export const Route = createFileRoute("/quran/$surahId")({
  head: () => ({
    meta: [
      { title: "Reading — DeenFlow" },
      { name: "description", content: "Read Quran with Arabic text and English translation on DeenFlow." },
    ],
  }),
  component: SurahReader,
});

function SurahReader() {
  const { surahId } = Route.useParams();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>(getBookmarks());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSurah(Number(surahId)).then(({ surah: s, ayahs: a }) => {
      setSurah(s);
      setAyahs(a);
      setLoading(false);
      setLastRead(Number(surahId), 1);
    });
  }, [surahId]);

  const handleBookmark = (ayahNumber: number) => {
    const updated = toggleBookmark(ayahNumber);
    setBookmarks([...updated]);
  };

  if (loading) {
    return (
      <div className="safe-bottom min-h-screen">
        <div className="px-5 pt-12">
          <Link to="/quran" className="text-sm text-primary">← Back to Surahs</Link>
          <div className="mt-8 space-y-6 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-3/4 rounded bg-muted ml-auto" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-bottom min-h-screen">
      <div className="px-5 pt-12 pb-4">
        <Link to="/quran" className="text-sm font-medium text-primary">← Back to Surahs</Link>
      </div>

      {surah && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-islamic islamic-pattern mx-5 rounded-2xl p-5 text-center text-primary-foreground shadow-lg"
        >
          <p className="font-arabic text-2xl">{surah.name}</p>
          <h2 className="mt-1 text-lg font-bold">{surah.englishName}</h2>
          <p className="text-sm opacity-80">{surah.englishNameTranslation}</p>
          <p className="mt-1 text-xs opacity-60">
            {surah.numberOfAyahs} Ayahs • {surah.revelationType}
          </p>
        </motion.div>
      )}

      {Number(surahId) !== 9 && (
        <div className="mt-6 text-center">
          <p className="font-arabic text-xl text-foreground" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4 px-5">
        {ayahs.map((ayah, i) => {
          const isBookmarked = bookmarks.includes(ayah.number);
          return (
            <motion.div
              key={ayah.number}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.03, 1) }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {ayah.numberInSurah}
                </span>
                <button
                  onClick={() => handleBookmark(ayah.number)}
                  className="text-lg transition-transform active:scale-90"
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this ayah"}
                >
                  {isBookmarked ? "🔖" : "🏷️"}
                </button>
              </div>
              <p className="font-arabic text-right text-xl leading-[2.4] text-foreground" dir="rtl">
                {ayah.text}
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-foreground/70">
                {ayah.transliteration}
              </p>
              <p className="mt-2 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                {ayah.translation}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
