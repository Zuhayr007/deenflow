# DeenFlow

An Islamic prayer-times PWA with Quran reading, audio, duas and daily tools. React + TypeScript + Vite + TanStack Router. Public content is prerendered; interactive preferences remain local to the browser.

## Develop and verify

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`node scripts/serve.mjs` previews the production build on port 4173 with real static 404 responses. `npm run preview` is Vite's preview, whose SPA fallback does not reproduce Netlify's routing.

## Included

- Automatic high-accuracy device location on prayer, Qibla and fasting pages, with browser permission, loading/error states and retry. Prayer calculations use the detected coordinates/timezone and the existing default ISNA method, standard Asr and middle-of-the-night high-latitude rule. There are no manual location/calculation controls.
- Actual tomorrow's Fajr, date/resume refresh, monthly timetables, print and UTC calendar export.
- Prayer notification preferences shared across all routes; per-prayer, advance, at-time, quiet-hour and optional adhkar settings.
- Service worker, offline app shell, visited-page caching, explicit complete Quran text download, update prompt and install shortcuts.
- Quran text bundled per surah: Uthmani Arabic, Asad and Saheeh International translations, transliteration. Search, bookmarks, exact verse links and reading resume.
- Reciter selection, audio seek/speed, repeat-ayah and repeat-range practice. Audio requires a connection.
- Searchable dua topics and individual pages, favourites, share/copy with references, and explicit editorial source status.
- Qibla bearing with optional device compass; morning/evening remembrance counters; estimated Hijri date; fasting countdowns and a private 30-juz reading checklist.
- Personal masjid iqamah/Jumu'ah notes with source and last-confirmed date.
- File backup/restore and optional encrypted cross-device cloud backup. No account is required.
- 209 public HTML pages, route metadata, canonical URLs, JSON-LD, sitemap, robots, correct static 404s and crawlable navigation.
- About, sources, calculations, privacy, contact and a brief salah-learning orientation.

## Production configuration

Use `.env.example` as a reference. Do not commit real secrets.

| Variable             | Scope             | Purpose                                                                                 |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`      | Build, public     | Canonical production origin, e.g. your own HTTPS domain. Falls back to Netlify's `URL`. |
| `VITE_CONTACT_EMAIL` | Build, public     | Contact/corrections address.                                                            |
| `VAPID_PUBLIC_KEY`   | Functions         | Web Push public key.                                                                    |
| `VAPID_PRIVATE_KEY`  | Functions, secret | Web Push private key. Never use a `VITE_` prefix.                                       |
| `VAPID_SUBJECT`      | Functions         | Valid `mailto:` contact or HTTPS URL for Web Push.                                      |
| `SYNC_ENABLED`       | Functions         | Set `true` to enable optional encrypted cloud backup.                                   |

Without a configured public origin, local builds deliberately omit canonical URLs and the sitemap instead of publishing a fictitious domain. On Netlify the production `URL` supplies the origin automatically. Prefer explicitly setting your custom domain. Set the contact email before launch.

The checked-in `netlify.toml` is the supported full deployment configuration:

1. Build with `npm run build`; publish `dist`.
2. The build writes `.server` for the dynamic city function. Keep that output available during function packaging.
3. City routes are served by a cached server-rendered function so today's dates and times continue to update between deploys. Other public content is static HTML. Unknown paths return HTTP 404.
4. Explicit `/api/*` rewrites route requests to the push/config/backup functions.
5. Netlify Blobs holds subscriptions, delivery deduplication markers and encrypted vaults. Netlify supplies its own Blobs credentials in deployed functions.
6. Generate a persistent VAPID key pair with `npx web-push generate-vapid-keys`, and configure the variables above. Rotating these keys requires users to subscribe again.
7. Deploy and verify function logs, the minute schedule, rate-limit rules and notification delivery on actual target phones.

No deployment, paid service activation or external account configuration is performed by the source changes. The historical `wrangler.jsonc` is not a working deployment target for this implementation. Hosting the static `dist` elsewhere supports the frontend, but background push, cloud backup, live server-rendered city timetables and routing need equivalent server configuration.

## Background reminder behaviour

`reminders.ts` runs once per minute on deployed Netlify production. It calculates schedules from each subscription's chosen location/settings, sends due alerts within a 90-second freshness window, and uses conditional Blobs writes for deduplication. Invalid subscriptions and subscriptions inactive for 90 days are removed. Old delivery markers are cleaned daily. It processes records in batches of ten; monitor function duration as the subscriber count grows and introduce a queue/shards before approaching platform limits.

The frontend asks for notification permission through an explicit action. Users separately enable background reminders. Foreground reminders are mounted in the root provider, so changing tabs within the app does not cancel them. Background-enabled devices suppress foreground alerts to avoid duplicate delivery. A failed settings sync is shown in the app. Unsubscribing removes the push-provider subscription even if the application server is offline.

Web Push is not an exact alarm service: connectivity, browser support, battery policy and scheduler delays affect delivery. On supported iOS versions the app must be added to the Home Screen. Test Fajr, date rollover, quiet hours, permission denial and foreground/background transitions on real devices before advertising reminder reliability. No arbitrary adhan audio is promised through push notifications.

## Data, privacy and religious review

Quran data is under `src/data/quran`, one JSON module per chapter. The source manifest records provider, editions and download date. `npm run data:quran` refreshes the four editions and validates 114 chapters, 6,236 verses and matching IDs. Review provider/edition redistribution terms for your intended deployment and retain attribution. Text is not generated or rewritten by DeenFlow.

The original 58 dua entries are retained. `dua-content.ts` adds titles, exact links for checked narrations, Quran links and excerpt/source-status annotations. Remaining collection-only references explicitly await editorial verification. This is not a scholarly review or a claim that all inherited wording is authentic. Obtain qualified review of the full library and learning content before describing it as reviewed. The salah guide is currently an orientation with source links and Quran audio practice, not a full narrated course.

My Masjid stores personal notes only. No fabricated verified mosque records are shipped. Building a public verified directory still requires real mosque partners, permission to publish their data, and ongoing timetable updates.

Cloud backup uses a random 256-bit recovery key, separate SHA-256-derived encryption and authorization keys, and AES-GCM encryption in the browser. The server receives ciphertext and a derived bearer token, never the recovery key. Anyone holding the key controls that vault. Recovery is intentionally impossible without it. Transfers are manual upload/restore; there is no silent multi-device merging or account service. Location and notification credentials are excluded. Schema validation occurs before any import writes.

## SEO rollout after deployment

- Verify the canonical production domain and public contact address.
- Inspect raw HTML on `/quran/1`, a dua topic and a city page. Confirm one title/canonical after client navigation as well.
- Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools using your accounts.
- Inspect invalid paths and surah IDs for HTTP 404. Ensure robots and assets remain crawlable.
- Check live mobile Core Web Vitals and indexing reports; lab/browser tests do not establish real-user scores or rankings.
- Establish mosque partnerships and share helpful timetable/calendar links. No outreach messages, fabricated endorsements or backlinks are generated by this repository.

## Regression checks

Unit coverage includes next-day Fajr, timezone/date rollover, DST, method adjustments, notification filtering, calendar export, backup validation/encryption, subscription endpoint validation and Quran dataset integrity. Browser coverage includes no-JavaScript HTML, real 404s, automatic location, denied permission/retry, location timeout, drawer focus, reading resume/bookmarks, dua favourites, responsive tools and offline reload. Function deployment and actual push delivery require the configured hosting environment.

Location requires HTTPS (or localhost) and browser permission. The app requests the device's best available accuracy; it cannot guarantee GPS precision on every device. It requests fresh coordinates when a location tool first opens, and after returning to the app following five minutes. Saved manual cities are not used as a fallback. Background push uses the last successfully synchronized location while the app is closed.
