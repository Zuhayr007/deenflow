import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/")({
  head: () =>
    seo(
      "Daily Islamic Tools",
      "Qibla direction, daily adhkar, Ramadan planning, masjid times, offline downloads and reading backup.",
      "/tools",
    ),
  component: () => (
    <Page
      title="A little help, every day"
      intro="Tools to support your prayer, remembrance and reading."
    >
      {[
        ["qibla", "Qibla direction", "Find the bearing from your location."],
        [
          "adhkar",
          "Morning & evening adhkar",
          "A guided session with private counters.",
        ],
        [
          "ramadan",
          "Ramadan & fasting",
          "Fajr and Maghrib countdowns, calendar and reading plan.",
        ],
        [
          "masjid",
          "My masjid",
          "Keep your local iqamah and Jumu’ah times close.",
        ],
        ["learn", "Learn salah", "An introduction and recitation practice."],
        [
          "backup",
          "Offline & backup",
          "Download reading content and protect your progress.",
        ],
      ].map(([slug, title, intro]) => (
        <a className="panel block" key={slug} href={"/tools/" + slug}>
          <h2 className="font-semibold text-lg">{title} →</h2>
          <p className="text-sm text-muted-foreground mt-2">{intro}</p>
        </a>
      ))}
    </Page>
  ),
});
