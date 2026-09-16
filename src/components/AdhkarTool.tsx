import { useEffect, useState } from "react";
import { fetchSurah, type SurahData } from "@/lib/quran-api";
import { readLocal, writeLocal } from "@/lib/storage";
export default function AdhkarTool() {
  const [session, setSession] = useState("morning"),
    [counts, setCounts] = useState<Record<string, number>>({}),
    [chapters, setChapters] = useState<SurahData[]>([]),
    [error, setError] = useState(""),
    [tasbih, setTasbih] = useState(0);
  const date = new Date().toLocaleDateString("en-CA");
  const key = "deenflow-adhkar-" + date + "-" + session;
  const dailyKey = "deenflow-tasbih-" + date;
  useEffect(() => {
    setTasbih(readLocal(dailyKey, 0));
  }, [dailyKey]);
  useEffect(() => {
    setCounts(readLocal(key, {}));
  }, [key]);
  useEffect(() => {
    void Promise.all([112, 113, 114].map(fetchSurah))
      .then(setChapters)
      .catch(() =>
        setError(
          "Reconnect to download these surahs, or open them in the Quran reader.",
        ),
      );
  }, []);
  const increment = (id: string, max: number) => {
    const next = { ...counts, [id]: Math.min(max, (counts[id] || 0) + 1) };
    setCounts(next);
    writeLocal(key, next);
  };
  return (
    <>
      <label className="field">
        Session
        <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </label>
      <p className="text-sm">
        A short remembrance session. The three surahs are recited three times
        each in the morning and evening.{" "}
        <a className="underline" href="https://sunnah.com/abudawud:5082">
          Abu Dawud 5082 (Hasan, Al-Albani)
        </a>
        .
      </p>
      {error && <p role="alert">{error}</p>}
      {chapters.map((c) => (
        <article className="panel space-y-3" key={c.surah.number}>
          <h2 className="text-xl">{c.surah.englishName}</h2>
          {c.ayahs.map((a) => (
            <div key={a.number}>
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic text-2xl leading-loose"
              >
                {a.text}
              </p>
              <p className="text-xs italic mt-2">{a.transliteration}</p>
              <p className="text-sm mt-2">{a.translation}</p>
            </div>
          ))}
          <div className="flex gap-3">
            <button
              className="action"
              disabled={counts[c.surah.number] === 3}
              onClick={() => increment(String(c.surah.number), 3)}
            >
              Recited {counts[c.surah.number] || 0}/3
            </button>
            <a className="action secondary" href={"/quran/" + c.surah.number}>
              Listen
            </a>
          </div>
        </article>
      ))}
      <article className="panel space-y-3">
        <h2 className="text-xl">Daily tasbih</h2>
        <p lang="ar" dir="rtl" className="font-arabic text-3xl">
          سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
        </p>
        <p className="italic text-sm">Subhanallahi wa bihamdihi</p>
        <p className="text-sm">
          Glory and praise belong to Allah. The daily count of 100 is reported
          in{" "}
          <a className="underline" href="https://sunnah.com/bukhari:6405">
            Sahih al-Bukhari 6405
          </a>
          .
        </p>
        <button
          className="action"
          disabled={tasbih >= 100}
          onClick={() => {
            const next = Math.min(100, tasbih + 1);
            setTasbih(next);
            writeLocal(dailyKey, next);
          }}
        >
          {tasbih}/100 · Count
        </button>
      </article>
      <button
        className="action secondary"
        onClick={() => {
          setCounts({});
          writeLocal(key, {});
        }}
      >
        Reset this session
      </button>
      <p className="text-xs text-muted-foreground">
        Enable optional adhkar reminders in Settings. Counts are private to this
        device.
      </p>
    </>
  );
}
