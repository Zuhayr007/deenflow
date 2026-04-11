export interface Dua {
  id: number;
  category: string;
  arabic: string;
  english: string;
  reference: string;
}

export const DUA_CATEGORIES = [
  "Forgiveness",
  "Rizq & Income",
  "Jobs & Opportunities",
  "Deceased",
  "Daily",
] as const;

export const DUAS: Dua[] = [
  {
    id: 1,
    category: "Forgiveness",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    english: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    reference: "Quran 7:23",
  },
  {
    id: 2,
    category: "Forgiveness",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    english: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of Repentance, the Merciful.",
    reference: "Abu Dawud",
  },
  {
    id: 3,
    category: "Forgiveness",
    arabic: "أَسْتَغْفِرُ اللهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الحَيُّ القَيُّومُ وَأَتُوبُ إِلَيْهِ",
    english: "I seek the forgiveness of Allah, there is no deity but He, the Living, the Self-Sustaining, and I repent to Him.",
    reference: "Abu Dawud",
  },
  {
    id: 4,
    category: "Rizq & Income",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    english: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
    reference: "Ibn Majah",
  },
  {
    id: 5,
    category: "Rizq & Income",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    english: "O Allah, suffice me with what You have made lawful over what You have made unlawful, and make me independent of all besides You.",
    reference: "Tirmidhi",
  },
  {
    id: 6,
    category: "Jobs & Opportunities",
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    english: "My Lord, indeed I am, for whatever good You would send down to me, in need.",
    reference: "Quran 28:24",
  },
  {
    id: 7,
    category: "Jobs & Opportunities",
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلًا",
    english: "O Allah, nothing is easy except what You make easy, and You make the difficult easy if it be Your Will.",
    reference: "Ibn Hibban",
  },
  {
    id: 8,
    category: "Deceased",
    arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ",
    english: "O Allah, forgive him, have mercy on him, keep him safe, pardon him, honour his reception, and make his entrance spacious.",
    reference: "Muslim",
  },
  {
    id: 9,
    category: "Deceased",
    arabic: "اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا",
    english: "O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females.",
    reference: "Abu Dawud",
  },
  {
    id: 10,
    category: "Daily",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    english: "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud",
  },
  {
    id: 11,
    category: "Daily",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    english: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    reference: "Tirmidhi",
  },
  {
    id: 12,
    category: "Daily",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    english: "Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    reference: "Quran 9:129",
  },
];
