export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  transliteration: string;
  translation: string;
}

let surahCache: Surah[] | null = null;

export async function fetchSurahs(): Promise<Surah[]> {
  if (surahCache) return surahCache;
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await res.json();
  surahCache = data.data;
  return surahCache!;
}

export async function fetchSurah(number: number): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const [arabicRes, englishRes, translitRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${number}`),
    fetch(`https://api.alquran.cloud/v1/surah/${number}/en.asad`),
    fetch(`https://api.alquran.cloud/v1/surah/${number}/en.transliteration`),
  ]);
  const arabicData = await arabicRes.json();
  const englishData = await englishRes.json();
  const translitData = await translitRes.json();

  const surah: Surah = {
    number: arabicData.data.number,
    name: arabicData.data.name,
    englishName: arabicData.data.englishName,
    englishNameTranslation: arabicData.data.englishNameTranslation,
    numberOfAyahs: arabicData.data.numberOfAyahs,
    revelationType: arabicData.data.revelationType,
  };

  const ayahs: Ayah[] = arabicData.data.ayahs.map((a: any, i: number) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    transliteration: translitData.data.ayahs[i]?.text || "",
    translation: englishData.data.ayahs[i]?.text || "",
  }));

  return { surah, ayahs };
}

export function getBookmarks(): number[] {
  try {
    return JSON.parse(localStorage.getItem("deenflow-bookmarks") || "[]");
  } catch {
    return [];
  }
}

export function toggleBookmark(ayahNumber: number): number[] {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(ayahNumber);
  if (idx >= 0) bookmarks.splice(idx, 1);
  else bookmarks.push(ayahNumber);
  localStorage.setItem("deenflow-bookmarks", JSON.stringify(bookmarks));
  return bookmarks;
}

export function getLastRead(): { surah: number; ayah: number } | null {
  try {
    return JSON.parse(localStorage.getItem("deenflow-lastread") || "null");
  } catch {
    return null;
  }
}

export function setLastRead(surah: number, ayah: number) {
  localStorage.setItem("deenflow-lastread", JSON.stringify({ surah, ayah }));
}
