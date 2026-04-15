export interface Dua {
  id: number;
  category: string;
  arabic: string;
  english: string;
  reference: string;
}

export const DUA_CATEGORIES = [
  "Morning & Evening",
  "Forgiveness",
  "Rizq & Income",
  "Jobs & Opportunities",
  "Deceased",
  "Daily",
  "Protection",
  "Health & Healing",
  "Guidance & Knowledge",
  "Patience & Gratitude",
  "Marriage & Family",
  "Travel",
  "Before & After Meals",
  "Sleeping & Waking",
  "Anxiety & Distress",
  "Parents",
] as const;

export const DUAS: Dua[] = [
  // ── Forgiveness ──
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
    category: "Forgiveness",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    english: "O Allah, You are the Most Forgiving, and You love forgiveness, so forgive me.",
    reference: "Tirmidhi",
  },
  {
    id: 5,
    category: "Forgiveness",
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    english: "Our Lord, forgive us our sins and our excesses in our affairs, plant our feet firmly, and give us victory over the disbelieving people.",
    reference: "Quran 3:147",
  },
  {
    id: 6,
    category: "Forgiveness",
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ",
    english: "O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the secret.",
    reference: "Muslim",
  },

  // ── Rizq & Income ──
  {
    id: 7,
    category: "Rizq & Income",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    english: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
    reference: "Ibn Majah",
  },
  {
    id: 8,
    category: "Rizq & Income",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    english: "O Allah, suffice me with what You have made lawful over what You have made unlawful, and make me independent of all besides You.",
    reference: "Tirmidhi",
  },
  {
    id: 9,
    category: "Rizq & Income",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْقِلَّةِ وَالذِّلَّةِ وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ",
    english: "O Allah, I seek refuge in You from poverty, scarcity, and humiliation, and I seek refuge in You from wronging others or being wronged.",
    reference: "Abu Dawud",
  },

  // ── Jobs & Opportunities ──
  {
    id: 10,
    category: "Jobs & Opportunities",
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    english: "My Lord, indeed I am, for whatever good You would send down to me, in need.",
    reference: "Quran 28:24",
  },
  {
    id: 11,
    category: "Jobs & Opportunities",
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلًا",
    english: "O Allah, nothing is easy except what You make easy, and You make the difficult easy if it be Your Will.",
    reference: "Ibn Hibban",
  },
  {
    id: 12,
    category: "Jobs & Opportunities",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    english: "My Lord, expand for me my chest, ease for me my task, and untie the knot from my tongue that they may understand my speech.",
    reference: "Quran 20:25-28",
  },

  // ── Deceased ──
  {
    id: 13,
    category: "Deceased",
    arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ",
    english: "O Allah, forgive him, have mercy on him, keep him safe, pardon him, honour his reception, and make his entrance spacious.",
    reference: "Muslim",
  },
  {
    id: 14,
    category: "Deceased",
    arabic: "اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا",
    english: "O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females.",
    reference: "Abu Dawud",
  },
  {
    id: 15,
    category: "Deceased",
    arabic: "اللَّهُمَّ أَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ وَأَدْخِلْهُ الْجَنَّةَ وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَعَذَابِ النَّارِ",
    english: "O Allah, replace his home with a better home, his family with a better family, admit him into Paradise, and protect him from the punishment of the grave and the Fire.",
    reference: "Muslim",
  },

  // ── Daily ──
  {
    id: 16,
    category: "Daily",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    english: "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud",
  },
  {
    id: 17,
    category: "Daily",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    english: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    reference: "Tirmidhi",
  },
  {
    id: 18,
    category: "Daily",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    english: "Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    reference: "Quran 9:129",
  },
  {
    id: 19,
    category: "Daily",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    english: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
    reference: "Abu Dawud",
  },

  // ── Morning & Evening ──
  {
    id: 20,
    category: "Morning & Evening",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    english: "We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, with no partner.",
    reference: "Muslim",
  },
  {
    id: 21,
    category: "Morning & Evening",
    arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    english: "O Allah, whatever blessing I or any of Your creation have risen upon, is from You alone, without partner. So for You is all praise and unto You all thanks.",
    reference: "Abu Dawud",
  },
  {
    id: 22,
    category: "Morning & Evening",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لَا إِلَهَ إِلَّا أَنْتَ",
    english: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no deity except You.",
    reference: "Abu Dawud",
  },
  {
    id: 23,
    category: "Morning & Evening",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    english: "O Ever-Living, O Sustainer, by Your mercy I seek help. Rectify all my affairs and do not leave me to myself even for the blink of an eye.",
    reference: "Hakim",
  },

  // ── Protection ──
  {
    id: 24,
    category: "Protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    english: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    reference: "Muslim",
  },
  {
    id: 25,
    category: "Protection",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    english: "O Allah, I seek refuge in You from worry and grief, from inability and laziness, from cowardice and miserliness, and from being overcome by debt and overpowered by men.",
    reference: "Bukhari",
  },
  {
    id: 26,
    category: "Protection",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ",
    english: "O Allah, I seek refuge in You from the evil of what I have done and from the evil of what I have not done.",
    reference: "Muslim",
  },
  {
    id: 27,
    category: "Protection",
    arabic: "اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    english: "O Allah, protect me from my front, from behind me, from my right, from my left, from above me, and I seek refuge in Your Greatness from being swallowed up from beneath me.",
    reference: "Abu Dawud",
  },

  // ── Health & Healing ──
  {
    id: 28,
    category: "Health & Healing",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
    english: "O Allah, Lord of mankind, remove the affliction. Cure him, for You are the One who cures. There is no cure except Your cure — a cure that leaves no illness behind.",
    reference: "Bukhari & Muslim",
  },
  {
    id: 29,
    category: "Health & Healing",
    arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
    english: "I ask Allah, the Mighty, the Lord of the Mighty Throne, to cure you.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: 30,
    category: "Health & Healing",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    english: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.",
    reference: "Abu Dawud",
  },

  // ── Guidance & Knowledge ──
  {
    id: 31,
    category: "Guidance & Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    english: "My Lord, increase me in knowledge.",
    reference: "Quran 20:114",
  },
  {
    id: 32,
    category: "Guidance & Knowledge",
    arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
    english: "O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.",
    reference: "Tirmidhi",
  },
  {
    id: 33,
    category: "Guidance & Knowledge",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ",
    english: "O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty.",
    reference: "Bukhari",
  },
  {
    id: 34,
    category: "Guidance & Knowledge",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    english: "Guide us to the straight path — the path of those upon whom You have bestowed favor, not of those who have earned anger nor of those who are astray.",
    reference: "Quran 1:6-7",
  },

  // ── Patience & Gratitude ──
  {
    id: 35,
    category: "Patience & Gratitude",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    english: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "Quran 2:250",
  },
  {
    id: 36,
    category: "Patience & Gratitude",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    english: "O Allah, help me to remember You, to be grateful to You, and to worship You in the best manner.",
    reference: "Abu Dawud",
  },
  {
    id: 37,
    category: "Patience & Gratitude",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ",
    english: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You approve.",
    reference: "Quran 27:19",
  },

  // ── Marriage & Family ──
  {
    id: 38,
    category: "Marriage & Family",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    english: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders of the righteous.",
    reference: "Quran 25:74",
  },
  {
    id: 39,
    category: "Marriage & Family",
    arabic: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
    english: "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
    reference: "Quran 3:38",
  },
  {
    id: 40,
    category: "Marriage & Family",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.",
    reference: "Quran 2:201",
  },

  // ── Travel ──
  {
    id: 41,
    category: "Travel",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    english: "Glory be to Him who has subjected this to us, and we could never have it by our efforts, and to our Lord we shall surely return.",
    reference: "Quran 43:13-14",
  },
  {
    id: 42,
    category: "Travel",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِي سَفَرِي هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى",
    english: "O Allah, I ask You in this journey for righteousness, piety, and deeds that please You.",
    reference: "Muslim",
  },
  {
    id: 43,
    category: "Travel",
    arabic: "اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ",
    english: "O Allah, make this journey easy for us and shorten its distance for us.",
    reference: "Muslim",
  },

  // ── Before & After Meals ──
  {
    id: 44,
    category: "Before & After Meals",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    english: "In the name of Allah and with the blessings of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: 45,
    category: "Before & After Meals",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    english: "All praise is due to Allah who fed us and gave us drink and made us Muslims.",
    reference: "Abu Dawud & Tirmidhi",
  },
  {
    id: 46,
    category: "Before & After Meals",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    english: "All praise is due to Allah who fed me this and provided it for me without any might or power from me.",
    reference: "Abu Dawud & Tirmidhi",
  },

  // ── Sleeping & Waking ──
  {
    id: 47,
    category: "Sleeping & Waking",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    english: "In Your name, O Allah, I die and I live.",
    reference: "Bukhari",
  },
  {
    id: 48,
    category: "Sleeping & Waking",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    english: "All praise is due to Allah who gave us life after causing us to die, and to Him is the resurrection.",
    reference: "Bukhari",
  },
  {
    id: 49,
    category: "Sleeping & Waking",
    arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا وَبِاسْمِكَ أَمُوتُ",
    english: "O Allah, by Your name I live and by Your name I die.",
    reference: "Bukhari & Muslim",
  },
  {
    id: 50,
    category: "Sleeping & Waking",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    english: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
    reference: "Abu Dawud",
  },

  // ── Anxiety & Distress ──
  {
    id: 51,
    category: "Anxiety & Distress",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    reference: "Quran 21:87",
  },
  {
    id: 52,
    category: "Anxiety & Distress",
    arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ",
    english: "O Allah, I am Your servant, son of Your servant, son of Your female servant. My forelock is in Your hand, Your command over me is forever executed, and Your decree over me is just.",
    reference: "Ahmad",
  },
  {
    id: 53,
    category: "Anxiety & Distress",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    english: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
    reference: "Quran 3:173",
  },
  {
    id: 54,
    category: "Anxiety & Distress",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    english: "O Allah, I seek refuge in You from worry and grief.",
    reference: "Bukhari",
  },
  {
    id: 55,
    category: "Anxiety & Distress",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    english: "There is no might nor power except with Allah.",
    reference: "Bukhari & Muslim",
  },

  // ── Parents ──
  {
    id: 56,
    category: "Parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    english: "My Lord, have mercy upon them as they brought me up when I was small.",
    reference: "Quran 17:24",
  },
  {
    id: 57,
    category: "Parents",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    english: "My Lord, forgive me and my parents and whoever enters my house as a believer, and the believing men and believing women.",
    reference: "Quran 71:28",
  },
  {
    id: 58,
    category: "Parents",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    english: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    reference: "Quran 14:41",
  },
];
