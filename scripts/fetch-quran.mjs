import { mkdir, writeFile } from "node:fs/promises";
await mkdir("src/data/quran", { recursive: true });
const editions = ["quran-uthmani", "en.asad", "en.transliteration", "en.sahih"],
  books = [];
for (const edition of editions) {
  const r = await fetch("https://api.alquran.cloud/v1/quran/" + edition, {
    signal: AbortSignal.timeout(120000),
  });
  if (!r.ok) throw Error("Download failed: " + edition);
  const { data } = await r.json();
  if (
    data.surahs?.length !== 114 ||
    data.surahs.reduce((n, s) => n + s.ayahs.length, 0) !== 6236
  )
    throw Error("Invalid Quran dataset");
  books.push(data.surahs);
}
const list = books[0].map(({ ayahs, ...s }) => ({
  ...s,
  numberOfAyahs: ayahs.length,
}));
await writeFile("src/data/surahs.json", JSON.stringify(list));
for (const s of books[0]) {
  const i = s.number - 1;
  const ayahs = s.ayahs.map((a, j) => {
    if (books.some((b) => b[i].ayahs[j]?.number !== a.number))
      throw Error("Verse mismatch");
    return {
      number: a.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
      translation: books[1][i].ayahs[j].text,
      transliteration: books[2][i].ayahs[j].text,
      sahih: books[3][i].ayahs[j].text,
    };
  });
  await writeFile(
    "src/data/quran/" + s.number + ".json",
    JSON.stringify({ surah: list[i], ayahs }),
  );
}
await writeFile(
  "src/data/quran-source.json",
  JSON.stringify(
    {
      provider: "https://alquran.cloud/api",
      editions,
      downloaded: new Date().toISOString(),
      verses: 6236,
    },
    null,
    2,
  ),
);
console.log("Saved 114 surahs / 6236 verses across four editions.");
