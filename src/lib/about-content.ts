export const ABOUT = {
  about: {
    title: "About DeenFlow",
    paragraphs: [
      "DeenFlow is a daily Islamic companion for prayer times, Quran reading, duas and remembrance. The core tools can be used without an account.",
      "Prayer times are calculated automatically from your device's current location. Congregation times are set by each masjid. Quran translations express an interpretation of meaning and should be read alongside the Arabic.",
      "We aim to make religious sources easy to inspect. DeenFlow does not claim that all inherited dua entries have received scholarly review. Entries show their source status, and corrections are welcome.",
    ],
  },
  calculations: {
    title: "How prayer times are calculated",
    paragraphs: [
      "DeenFlow calculates prayer times locally with the open-source Adhan library using the coordinates reported by your device and their timezone. Location and calculation controls are automatic; no city selection is needed.",
      "Calculations use North America (ISNA), standard Asr, the middle-of-the-night high-latitude rule and no manual offsets. This preserves DeenFlow's default calculation method. It is not presented as an official local timetable. Methods and Asr conventions differ between communities, so confirm local times with your masjid.",
      "Fajr and Isha twilight angles differ by method. Polar locations may require a locally agreed timetable. Sunrise is shown separately and is not one of the five daily prayer starts.",
      "Tomorrow’s Fajr is calculated for tomorrow. Opening the prayer, Qibla or fasting page automatically requests a fresh, high-accuracy location, with your browser's permission. Accuracy depends on your device. Location is refreshed when you return after five minutes. If location is unavailable, DeenFlow shows a retry message rather than substituting a saved city. Calculations themselves work offline once location is available.",
      "Calendar exports contain the current month and chosen settings at export time. They do not update automatically. Iqamah and Jumu’ah entries in My Masjid are personal notes, not verified public timetables.",
    ],
  },
  sources: {
    title: "Sources & editorial status",
    paragraphs: [
      "Quran Arabic text: Uthmani edition from AlQuran Cloud. English editions: Muhammad Asad and Saheeh International. Transliteration: the provider’s en.transliteration edition. The dataset is checked for 114 chapters, 6,236 verses and matching verse identifiers between editions.",
      "Recitation streams are served by Islamic Network. The player identifies the selected reciter. Transliteration is an aid to learning; listen to recitation and learn pronunciation with a teacher.",
      "The original dua library includes Quran passages and collection-level hadith references. Quran references link to the relevant verse. Where a narration has been checked, its specific reference is linked. Other entries explicitly say that exact narration and wording await editorial verification. Excerpts are labelled where identified; no blanket authenticity grading is claimed.",
      "The guided adhkar session uses Abu Dawud 5082 for reciting Al-Ikhlas, Al-Falaq and An-Nas three times morning and evening (Hasan, Al-Albani, as displayed by Sunnah.com), and Bukhari 6405 for the daily tasbih count. The session is a short selection, not an exhaustive collection.",
      "Hijri dates use the browser’s Umm al-Qura calendar with a user-selected adjustment. Local moon-sighting announcements take precedence for observances.",
    ],
  },
  privacy: {
    title: "Privacy & your data",
    paragraphs: [
      "Your location, preferences, bookmarks, reading progress and personal masjid notes are stored in this browser. Clearing site storage removes them. Core prayer calculations happen on your device. DeenFlow does not add advertising or analytics trackers.",
      "Opening a location-based tool automatically requests the browser's location permission. Coordinates stay on the device unless you explicitly enable background prayer reminders. Background reminders send the detected location, calculation preferences and push subscription to the DeenFlow server so it can calculate and deliver alerts. While the app is closed, background reminders use the last location successfully synchronized; they cannot track travel while it is closed. Disable background reminders to unsubscribe; inactive subscriptions expire after 90 days.",
      "Quran text is bundled with the app. Playing audio connects to Islamic Network; your network address is visible to that provider. Following a source or map link opens the named third-party service, which has its own privacy practices.",
      "Optional cloud backup encrypts reading data in your browser with AES-GCM. The server stores ciphertext under an identifier derived from your recovery key. The key itself is not uploaded. Anyone with the key can read, replace or delete your backup. This is manual backup and restore, not automatic account synchronization.",
      "Exported files include reading preferences and personal masjid notes, but exclude location, push subscriptions and notification permissions. Store backups privately. A cloud backup can be deleted using its recovery key. Hosting and push providers may keep normal operational request logs.",
    ],
  },
  contact: {
    title: "Contact & corrections",
    paragraphs: [
      "If you find a problem, include the page address, the text or time in question, and a reliable source for the correction. For prayer times, include the city, date, calculation method and Asr setting; do not send precise home coordinates.",
      "Religious content corrections should identify the original source and the precise wording or reference that needs review. We do not treat user submissions as verified religious guidance.",
    ],
  },
} as const;
