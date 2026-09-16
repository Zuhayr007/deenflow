import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  fetchSurah,
  SURAHS,
  getLastRead,
  setLastRead,
  getBookmarks,
  toggleBookmark,
} from "@/lib/quran-api";
import { readLocal, writeLocal } from "@/lib/storage";
import { seo } from "@/lib/seo";
import QuranAudioPlayer from "@/components/QuranAudioPlayer";
import Page from "@/components/Page";
export const Route = createFileRoute("/quran/$surahId")({
  beforeLoad: ({ params }) => {
    if (!/^[1-9]\d*$/.test(params.surahId) || Number(params.surahId) > 114)
      throw notFound();
  },
  loader: ({ params }) => fetchSurah(Number(params.surahId)),
  head: ({ params }) => {
    const s = SURAHS[Number(params.surahId) - 1];
    return seo(
      s
        ? "Surah " + s.englishName + ": Arabic, Translation & Audio"
        : "Surah not found",
      s
        ? "Read " +
            s.englishName +
            " (" +
            s.englishNameTranslation +
            ") with Arabic, English translations, transliteration and verse-by-verse recitation."
        : "Surah not found.",
      "/quran/" + params.surahId,
    );
  },
  component: SurahReader,
});
function SurahReader() {
  const { surah, ayahs } = Route.useLoaderData();
  return <Reader key={surah.number} surah={surah} ayahs={ayahs} />;
}
function Reader({ surah, ayahs }: Awaited<ReturnType<typeof fetchSurah>>) {
  const [bookmarks, setBookmarks] = useState<number[]>([]),
    [current, setCurrent] = useState(1),
    [size, setSize] = useState(26),
    [translation, setTranslation] = useState("asad"),
    [translit, setTranslit] = useState(true),
    [query, setQuery] = useState("");
  const ready = useRef(false),
    root = useRef<HTMLDivElement>(null),
    suppress = useRef(0);
  useEffect(() => {
    setBookmarks(getBookmarks());
    const prefs = readLocal("deenflow-reader", {
      size: 26,
      translation: "asad",
      translit: true,
    });
    setSize(prefs.size);
    setTranslation(prefs.translation);
    setTranslit(prefs.translit);
    const hash = Number(window.location.hash.replace("#ayah-", ""));
    const last = getLastRead();
    const target =
      Number.isInteger(hash) && hash > 0 && hash <= surah.numberOfAyahs
        ? hash
        : last?.surah === surah.number
          ? last.ayah
          : 1;
    setCurrent(target);
    setLastRead(surah.number, target);
    const timer = setTimeout(() => {
      if (target > 1)
        document
          .getElementById("ayah-" + target)
          ?.scrollIntoView({ block: "center" });
      ready.current = true;
    }, 150);
    return () => clearTimeout(timer);
  }, [surah.number, surah.numberOfAyahs]);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!ready.current || Date.now() < suppress.current) return;
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (first)
          setLastRead(
            surah.number,
            Number(first.target.getAttribute("data-ayah")),
          );
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    root.current
      .querySelectorAll("[data-ayah]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [surah.number, query]);
  const go = (n: number) => {
    setCurrent(n);
    setLastRead(surah.number, n);
    suppress.current = Date.now() + 1200;
    document.getElementById("ayah-" + n)?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  };
  return (
    <Page
      title={surah.englishName}
      intro={
        surah.englishNameTranslation +
        " · " +
        surah.numberOfAyahs +
        " ayahs · " +
        surah.revelationType
      }
    >
      <Link to="/quran" className="text-primary">
        ← All surahs
      </Link>
      <p lang="ar" dir="rtl" className="font-arabic text-4xl text-center">
        {surah.name}
      </p>
      <details className="panel">
        <summary>Reading preferences</summary>
        <div className="space-y-3 mt-3">
          <label className="field">
            Arabic text size
            <input
              type="range"
              min="20"
              max="44"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                writeLocal("deenflow-reader", {
                  size: Number(e.target.value),
                  translation,
                  translit,
                });
              }}
            />
          </label>
          <label className="field">
            English translation
            <select
              value={translation}
              onChange={(e) => {
                setTranslation(e.target.value);
                writeLocal("deenflow-reader", {
                  size,
                  translation: e.target.value,
                  translit,
                });
              }}
            >
              <option value="asad">Muhammad Asad</option>
              <option value="sahih">Saheeh International</option>
            </select>
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={translit}
              onChange={(e) => {
                setTranslit(e.target.checked);
                writeLocal("deenflow-reader", {
                  size,
                  translation,
                  translit: e.target.checked,
                });
              }}
            />
            Show transliteration
          </label>
        </div>
      </details>
      <label className="field">
        Find within this surah
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Verse number, Arabic or English"
        />
      </label>
      <div ref={root} className="space-y-4 pb-48">
        {ayahs
          .filter(
            (a) =>
              !query ||
              [
                a.text,
                a.translation,
                a.sahih,
                a.transliteration,
                String(a.numberInSurah),
              ].some((t) => t.toLowerCase().includes(query.toLowerCase())),
          )
          .map((a) => (
            <article
              key={a.number}
              id={"ayah-" + a.numberInSurah}
              data-ayah={a.numberInSurah}
              className={
                "panel scroll-mt-8 " +
                (current === a.numberInSurah ? "ring-2 ring-primary/40" : "")
              }
            >
              <div className="flex justify-between gap-2 text-sm">
                <a
                  href={"#ayah-" + a.numberInSurah}
                  onClick={() => go(a.numberInSurah)}
                >
                  {surah.number}:{a.numberInSurah}
                </a>
                <div className="flex gap-3">
                  <button
                    aria-label={"Select ayah " + a.numberInSurah + " for audio"}
                    onClick={() => go(a.numberInSurah)}
                  >
                    Select audio
                  </button>
                  <button
                    aria-pressed={bookmarks.includes(a.number)}
                    aria-label={
                      bookmarks.includes(a.number)
                        ? "Remove bookmark"
                        : "Bookmark ayah"
                    }
                    onClick={() => setBookmarks(toggleBookmark(a.number))}
                  >
                    {bookmarks.includes(a.number) ? "★" : "☆"}
                  </button>
                </div>
              </div>
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic leading-[2.3] mt-4"
                style={{ fontSize: size }}
              >
                {a.text}
              </p>
              {translit && (
                <p className="mt-3 text-sm italic text-muted-foreground">
                  {a.transliteration}
                </p>
              )}
              <p className="mt-4 border-t pt-3 text-sm leading-relaxed">
                {translation === "sahih" ? a.sahih : a.translation}
              </p>
            </article>
          ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Arabic: Uthmani edition. Translation:{" "}
        {translation === "sahih" ? "Saheeh International" : "Muhammad Asad"}.
        Text and recitation supplied by AlQuran Cloud / Islamic Network.{" "}
        <a href="/about/sources" className="underline">
          Sources
        </a>
      </p>
      <QuranAudioPlayer
        key={surah.number}
        surahNumber={surah.number}
        surahName={surah.englishName}
        totalAyahs={surah.numberOfAyahs}
        currentAyah={current}
        onAyahChange={go}
      />
    </Page>
  );
}
