import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchSurah, toggleBookmark, getBookmarks, setLastRead, type Ayah, type Surah } from "@/lib/quran-api";
import QuranAudioPlayer from "@/components/QuranAudioPlayer";

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
  const [highlightedAyah, setHighlightedAyah] = useState<number>(1);

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
        <div className="px-5 pt-14">
          <Link to="/quran" className="text-sm font-medium text-primary" style={{ fontFamily: 'var(--font-body)' }}>← Back to Surahs</Link>
          <div className="mt-8 space-y-6 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-3/4 rounded-xl bg-muted ml-auto" />
                <div className="h-4 w-full rounded-xl bg-muted" />
                <div className="h-4 w-2/3 rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-bottom min-h-screen">
      <div className="px-5 pt-14 pb-4">
        <Link to="/quran" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80" style={{ fontFamily: 'var(--font-body)' }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Surahs
        </Link>
      </div>

      {surah && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-islamic islamic-pattern mx-5 rounded-3xl p-6 text-center text-primary-foreground shadow-lg glow-primary"
        >
          <p className="font-arabic text-3xl">{surah.name}</p>
          <h2 className="mt-2 text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{surah.englishName}</h2>
          <p className="text-sm opacity-80 mt-1" style={{ fontFamily: 'var(--font-body)' }}>{surah.englishNameTranslation}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-medium">
              {surah.numberOfAyahs} Ayahs
            </span>
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-medium">
              {surah.revelationType}
            </span>
          </div>
        </motion.div>
      )}

      {Number(surahId) !== 9 && (
        <div className="mt-6 text-center">
          <p className="font-arabic text-xl text-foreground" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3 px-5">
        {ayahs.map((ayah, i) => {
          const isBookmarked = bookmarks.includes(ayah.number);
          return (
            <motion.div
              key={ayah.number}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.03, 1) }}
              className="rounded-2xl bg-card p-5 card-elevated"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8 text-xs font-bold text-primary" style={{ fontFamily: 'var(--font-body)' }}>
                  {ayah.numberInSurah}
                </span>
                <button
                  onClick={() => handleBookmark(ayah.number)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-lg transition-all active:scale-90 hover:bg-accent"
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this ayah"}
                >
                  {isBookmarked ? "🔖" : "🏷️"}
                </button>
              </div>
              <p className="font-arabic text-right text-xl leading-[2.5] text-foreground" dir="rtl">
                {ayah.text}
              </p>
              <p className="mt-3 text-sm italic leading-relaxed text-foreground/60" style={{ fontFamily: 'var(--font-body)' }}>
                {ayah.transliteration}
              </p>
              <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                {ayah.translation}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
