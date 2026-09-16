import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import { CITIES } from "@/lib/cities";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/prayer-times/")({
  head: () =>
    seo(
      "South Africa Prayer Times",
      "Daily salah times and printable monthly timetables for Cape Town, Johannesburg, Durban, Pretoria and Gqeberha.",
      "/prayer-times",
    ),
  component: () => (
    <Page
      title="Prayer times in South Africa"
      intro="Browse a city without sharing your location. All times show the city's timezone and calculation method."
    >
      {CITIES.map((c) => (
        <a
          key={c.slug}
          className="panel block text-primary"
          href={"/prayer-times/south-africa/" + c.slug}
        >
          {c.city} prayer times →
        </a>
      ))}
    </Page>
  ),
});
