import { DUAS, DUA_CATEGORIES, type Dua } from "./duas-data";
export const categorySlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/[^a-z0-9]+/g, "-");
export const CATEGORIES = DUA_CATEGORIES.map((name) => ({
  name,
  slug: categorySlug(name),
}));
const titles = [
  "Acknowledging our mistakes",
  "Repentance and forgiveness",
  "Seeking Allah’s forgiveness",
  "Asking for pardon",
  "Forgiveness and steadfastness",
  "Forgiveness for every sin",
  "Knowledge, provision and accepted deeds",
  "Lawful provision",
  "Refuge from poverty and injustice",
  "Asking for goodness",
  "Ease in difficulty",
  "Confidence and clarity",
  "Mercy for the deceased",
  "Forgiveness for the living and deceased",
  "A better home for the deceased",
  "Protection in Allah’s name",
  "Entering the morning",
  "Reliance on Allah",
  "Contentment in faith",
  "Morning remembrance",
  "Gratitude for blessings",
  "Health and wellbeing",
  "Seeking Allah’s help",
  "Refuge from harm",
  "Relief from worry and debt",
  "Refuge from wrongdoing",
  "Protection from every direction",
  "Asking Allah for healing",
  "Asking for recovery",
  "Health, hearing and sight",
  "Increase in knowledge",
  "Beneficial knowledge",
  "Seeking guidance: an excerpt",
  "The straight path",
  "Patience and steadfastness",
  "Help in worship",
  "Gratitude and righteous deeds",
  "Comfort in family",
  "Righteous offspring",
  "Goodness in this life and the next",
  "Gratitude when travelling",
  "Righteousness on a journey",
  "Ease on a journey",
  "Before eating",
  "Gratitude after eating",
  "Thanks for provision",
  "Before sleeping",
  "Upon waking",
  "Before sleeping: another wording",
  "Protection on the Day of Resurrection",
  "The supplication of Yunus",
  "Relief from distress: an excerpt",
  "Trust in Allah",
  "Refuge from worry",
  "Strength through Allah",
  "Mercy for parents",
  "Forgiveness for family and believers",
  "Forgiveness on the Day of Account",
];
const exact: Record<
  number,
  { url: string; reference: string; transliteration?: string }
> = {
  4: {
    url: "https://sunnah.com/tirmidhi:3513",
    reference: "Jami at-Tirmidhi 3513",
    transliteration: "Allahumma innaka afuwwun tuhibbul-afwa fa fu anni.",
  },
  7: {
    url: "https://sunnah.com/ibnmajah:925",
    reference: "Sunan Ibn Majah 925",
    transliteration:
      "Allahumma inni as’aluka ilman nafi’an, wa rizqan tayyiban, wa amalan mutaqabbalan.",
  },
  47: {
    url: "https://sunnah.com/bukhari:6324",
    reference: "Sahih al-Bukhari 6324",
    transliteration: "Bismika Allahumma amutu wa ahya.",
  },
  48: {
    url: "https://sunnah.com/bukhari:6324",
    reference: "Sahih al-Bukhari 6324",
    transliteration:
      "Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilayhin-nushur.",
  },
};
export function duaContent(dua: Dua) {
  const q = /^Quran (\d+):(\d+)(?:-(\d+))?$/.exec(dua.reference);
  const source = exact[dua.id];
  return {
    ...dua,
    title: titles[dua.id - 1] || dua.category,
    sourceUrl: q ? `https://quran.com/${q[1]}/${q[2]}` : source?.url,
    reference: source?.reference || dua.reference,
    transliteration: source?.transliteration,
    excerpt: [13, 15, 20, 27, 33, 37, 42, 43, 52, 54, 56, 57].includes(dua.id),
    sourceStatus:
      q || source
        ? "Source linked; consult the full passage for context."
        : "Collection reference supplied in the original library; exact narration and wording await editorial verification.",
  };
}
export const DUA_CONTENT = DUAS.map(duaContent);
