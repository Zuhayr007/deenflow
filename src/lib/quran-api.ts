import list from "@/data/surahs.json";
import { readLocal, writeLocal } from "./storage";
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
  sahih: string;
}
export interface SurahData {
  surah: Surah;
  ayahs: Ayah[];
}
export const SURAHS: Surah[] = list;
const chapters = import.meta.glob<{ default: SurahData }>(
  "../data/quran/*.json",
);
export async function fetchSurahs() {
  return SURAHS;
}
export async function fetchSurah(number: number): Promise<SurahData> {
  if (!Number.isInteger(number) || number < 1 || number > 114)
    throw Error("Surah not found");
  const load = chapters["../data/quran/" + number + ".json"];
  if (!load) throw Error("Surah is unavailable");
  return (await load()).default;
}
export function getBookmarks(): number[] {
  const b = readLocal<unknown>("deenflow-bookmarks", []);
  return Array.isArray(b)
    ? b.filter((n) => Number.isInteger(n) && n >= 1 && n <= 6236)
    : [];
}
export function toggleBookmark(n: number) {
  const b = getBookmarks();
  const next = b.includes(n) ? b.filter((a) => a !== n) : [...b, n];
  writeLocal("deenflow-bookmarks", next);
  return next;
}
export function getLastRead(): { surah: number; ayah: number } | null {
  const v = readLocal<{ surah: number; ayah: number } | null>(
    "deenflow-lastread",
    null,
  );
  return v &&
    Number.isInteger(v.surah) &&
    Number.isInteger(v.ayah) &&
    v.surah >= 1 &&
    v.surah <= 114 &&
    v.ayah >= 1 &&
    v.ayah <= SURAHS[v.surah - 1].numberOfAyahs
    ? v
    : null;
}
export function setLastRead(surah: number, ayah: number) {
  writeLocal("deenflow-lastread", { surah, ayah });
}
export function verseLocation(global: number) {
  let offset = 0;
  for (const s of SURAHS) {
    if (global <= offset + s.numberOfAyahs)
      return { surah: s, ayah: global - offset };
    offset += s.numberOfAyahs;
  }
  return null;
}
