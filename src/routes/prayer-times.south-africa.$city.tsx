import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import Page from "@/components/Page";
import Timetable from "@/components/Timetable";
import { CITIES } from "@/lib/cities";
import { calculateSchedule, dateInZone } from "@/lib/prayer-api";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/prayer-times/south-africa/$city")({
  loader: ({ params }) => {
    const city = CITIES.find((c) => c.slug === params.city);
    if (!city) throw notFound();
    return city;
  },
  head: ({ loaderData }) =>
    seo(
      (loaderData?.city || "City") + " Prayer Times Today",
      "Fajr, Dhuhr, Asr, Maghrib and Isha times in " +
        loaderData?.city +
        ", with sunrise, calculation details and a monthly timetable.",
      "/prayer-times/south-africa/" + loaderData?.slug,
    ),
  component: City,
});
function City() {
  const city = Route.useLoaderData();
  const date = dateInZone(new Date(), city.timezone);
  const schedule = calculateSchedule(city, date);
  return (
    <Page
      title={city.city + " prayer times"}
      intro={"Calculated salah times for " + date + " · Africa/Johannesburg"}
    >
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link to="/prayer-times">South Africa</Link> / {city.city}
      </nav>
      <PrayerTimesCard times={schedule.times} nextPrayer="" />
      <p className="text-sm">
        Sunrise: {schedule.times.Sunrise}. These are calculated prayer starts,
        not congregation times. Default: North America (ISNA), standard Asr.
      </p>
      <Link className="action" to="/">
        Show times for my current location
      </Link>
      <h2 className="text-xl font-semibold">Monthly timetable</h2>
      <Timetable location={city} />
      <h2 className="text-xl font-semibold">
        Why may my masjid's timetable differ?
      </h2>
      <p className="text-sm leading-relaxed">
        Calculation methods, Asr conventions and local adjustments can differ.
        Confirm local times with your masjid. Iqamah and Jumu'ah times are
        arranged locally and are separate from these calculated times.
      </p>
      <Link className="text-primary" to="/about/calculations">
        Read about calculation methods →
      </Link>
    </Page>
  );
}
