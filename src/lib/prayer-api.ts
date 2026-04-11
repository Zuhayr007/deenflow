export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
}

const DEFAULT_LOCATION: Location = {
  latitude: -33.9249,
  longitude: 18.4241,
  city: "Cape Town",
};

export async function getUserLocation(): Promise<Location> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let city = "Your Location";
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          city = data.city || data.locality || "Your Location";
        } catch {}
        resolve({ latitude, longitude, city });
      },
      () => resolve(DEFAULT_LOCATION),
      { timeout: 5000 }
    );
  });
}

export async function fetchPrayerTimes(location: Location): Promise<PrayerTimes> {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
  );
  const data = await res.json();
  const timings = data.data.timings;

  return {
    Fajr: timings.Fajr,
    Sunrise: timings.Sunrise,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
  };
}

export function getNextPrayer(times: PrayerTimes): { name: string; time: string; remainingMs: number } {
  const now = new Date();
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

  for (const prayer of prayers) {
    const [h, m] = times[prayer].split(":").map(Number);
    const prayerDate = new Date(now);
    prayerDate.setHours(h, m, 0, 0);
    if (prayerDate > now) {
      return { name: prayer, time: times[prayer], remainingMs: prayerDate.getTime() - now.getTime() };
    }
  }

  // All prayers passed, next is tomorrow's Fajr
  const [h, m] = times.Fajr.split(":").map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);
  return { name: "Fajr", time: times.Fajr, remainingMs: tomorrow.getTime() - now.getTime() };
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
