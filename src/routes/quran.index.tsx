import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  SURAHS,
  getLastRead,
  getBookmarks,
  verseLocation,
  fetchSurah,
  type Ayah,
} from "@/lib/quran-api";
import Page from "@/components/Page";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/quran/")({
  head: () =>
    seo(
      "Quran: Arabic, English Translation & Audio",
      "Read all 114 surahs, listen to recitation, search verses and continue your reading.",
      "/quran",
    ),
  component: QuranPage,
});
function QuranPage() {
  const [search, setSearch] = useState(""),
    [last, setLast] = useState<ReturnType<typeof getLastRead>>(null),
    [bookmarks, setBookmarks] = useState<number[]>([]),
    [results, setResults] = useState<{ surah: number; ayah: Ayah }[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setLast(getLastRead());
    setBookmarks(getBookmarks());
  }, []);
  const filtered = SURAHS.filter((s) =>
    [s.englishName, s.englishNameTranslation, s.name, String(s.number)].some(
      (v) => v.toLowerCase().includes(search.toLowerCase()),
    ),
  );
  return (
    <Page title="Quran" intro="114 surahs · Arabic, English & recitation">
      {last && (
        <Link
          className="panel block text-primary"
          to="/quran/$surahId"
          params={{ surahId: String(last.surah) }}
          hash={"ayah-" + last.ayah}
        >
          Continue reading · {SURAHS[last.surah - 1].englishName}, ayah{" "}
          {last.ayah} →
        </Link>
      )}
      <details className="panel">
        <summary>Saved verses ({bookmarks.length})</summary>
        <div className="space-y-3 mt-3">
          {bookmarks.length === 0 ? (
            <p className="text-sm">Tap the star beside a verse to save it.</p>
          ) : (
            bookmarks.map((n) => {
              const v = verseLocation(n);
              return (
                v && (
                  <Link
                    key={n}
                    className="block text-primary"
                    to="/quran/$surahId"
                    params={{ surahId: String(v.surah.number) }}
                    hash={"ayah-" + v.ayah}
                  >
                    {v.surah.englishName} {v.surah.number}:{v.ayah}
                  </Link>
                )
              );
            })
          )}
        </div>
      </details>
      <label className="field">
        Search surahs or verses
        <input
          type="search"
          disabled={busy}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setResults([]);
          }}
          placeholder="Surah name, number or verse text"
        />
      </label>
      <button
        className="action secondary"
        disabled={busy || search.trim().length < 3}
        onClick={async () => {
          const q = search.trim().toLowerCase();
          setBusy(true);
          setError("");
          try {
            const matches = [];
            for (const s of SURAHS) {
              const data = await fetchSurah(s.number);
              for (const a of data.ayahs)
                if (
                  [a.text, a.translation, a.sahih, a.transliteration].some(
                    (t) => t.toLowerCase().includes(q),
                  )
                )
                  matches.push({ surah: s.number, ayah: a });
              if (matches.length >= 100) break;
            }
            setResults(matches.slice(0, 100));
            if (!matches.length) setError("No matching verses found.");
          } catch {
            setError(
              "Some chapters are unavailable offline. Reconnect and try again.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Searching…" : "Search verse text (up to 100 results)"}
      </button>
      {error && <p role="status">{error}</p>}
      {results.map((r) => (
        <Link
          key={r.ayah.number}
          to="/quran/$surahId"
          params={{ surahId: String(r.surah) }}
          hash={"ayah-" + r.ayah.numberInSurah}
          className="panel block text-sm"
        >
          <strong>
            {r.surah}:{r.ayah.numberInSurah}
          </strong>
          <p>{r.ayah.translation}</p>
        </Link>
      ))}
      {filtered.map((s) => (
        <Link
          key={s.number}
          to="/quran/$surahId"
          params={{ surahId: String(s.number) }}
          className="panel flex items-center gap-4"
        >
          <span className="text-primary font-bold">{s.number}</span>
          <div className="flex-1">
            <h2 className="font-semibold">{s.englishName}</h2>
            <p className="text-xs text-muted-foreground">
              {s.englishNameTranslation} · {s.numberOfAyahs} ayahs
            </p>
          </div>
          <span lang="ar" dir="rtl" className="font-arabic text-xl">
            {s.name}
          </span>
        </Link>
      ))}
    </Page>
  );
}
