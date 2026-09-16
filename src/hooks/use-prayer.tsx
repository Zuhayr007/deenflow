import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addDays,
  calculateSchedule,
  dateInZone,
  DEFAULT_PREFERENCES,
  getUserLocation,
  timezoneFor,
  type PrayerPreferences,
  type Schedule,
} from "@/lib/prayer-api";
import { writeLocal } from "@/lib/storage";
const PrayerContext = createContext<{
  preferences: PrayerPreferences;
  requestLocation: (force?: boolean) => void;
  locationStatus: "idle" | "locating" | "ready" | "error";
  locationError: string;
  schedules: Schedule[];
  error: string;
  now: number;
}>({
  preferences: DEFAULT_PREFERENCES,
  requestLocation: () => {},
  locationStatus: "idle",
  locationError: "",
  schedules: [],
  error: "",
  now: 0,
});
export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES),
    [now, setNow] = useState(Date.now()),
    [locationStatus, setLocationStatus] = useState<
      "idle" | "locating" | "ready" | "error"
    >("idle"),
    [locationError, setLocationError] = useState("");
  const locating = useRef(false);
  const lastAttempt = useRef<number | null>(null);
  const requestLocation = useCallback((force = false) => {
    if (locating.current || (!force && lastAttempt.current !== null)) return;
    locating.current = true;
    lastAttempt.current = Date.now();
    setLocationStatus("locating");
    setLocationError("");
    // Never present a saved city or an old position as the user's current location.
    setPreferences(DEFAULT_PREFERENCES);
    void getUserLocation()
      .then((location) => {
        const next = { ...DEFAULT_PREFERENCES, location };
        setPreferences(next);
        writeLocal("deenflow-prayer", next);
        setNow(Date.now());
        setLocationStatus("ready");
      })
      .catch((error: unknown) => {
        setLocationError(
          error instanceof Error
            ? error.message
            : "Unable to get your location. Please try again.",
        );
        setLocationStatus("error");
      })
      .finally(() => {
        locating.current = false;
      });
  }, []);
  useEffect(() => {
    const refresh = () => setNow(Date.now()),
      timer = setInterval(refresh, 30000);
    const resume = () => {
      if (document.visibilityState !== "visible") return;
      refresh();
      if (
        lastAttempt.current !== null &&
        Date.now() - lastAttempt.current > 300000
      )
        requestLocation(true);
    };
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [requestLocation]);
  let date = "";
  try {
    if (preferences.location)
      date = dateInZone(new Date(now), timezoneFor(preferences.location));
  } catch {
    /* Reported below. */
  }
  const result = useMemo(() => {
    try {
      return {
        schedules: preferences.location
          ? [0, 1, 2].map((n) =>
              calculateSchedule(
                preferences.location!,
                addDays(date, n),
                preferences,
              ),
            )
          : [],
        error: "",
      };
    } catch (e) {
      return {
        schedules: [],
        error:
          e instanceof Error
            ? e.message
            : "Unable to calculate prayer times for this location.",
      };
    }
  }, [date, preferences]);
  return (
    <PrayerContext.Provider
      value={{
        preferences,
        requestLocation,
        locationStatus,
        locationError,
        ...result,
        now,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
}
export const usePrayer = () => useContext(PrayerContext);
