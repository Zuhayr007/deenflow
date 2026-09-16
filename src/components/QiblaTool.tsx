import { useEffect, useState } from "react";
import { Coordinates, Qibla } from "adhan";
import { usePrayer } from "@/hooks/use-prayer";
import LocationStatus from "./LocationStatus";
export default function QiblaTool() {
  const { preferences } = usePrayer();
  const location = preferences.location;
  const [heading, setHeading] = useState<number | null>(null),
    [enabled, setEnabled] = useState(false),
    [message, setMessage] = useState("");
  const bearing = location
    ? Qibla(new Coordinates(location.latitude, location.longitude))
    : null;
  useEffect(() => {
    if (!enabled) return;
    const listen = (event: DeviceOrientationEvent) => {
      const e = event as DeviceOrientationEvent & {
        webkitCompassHeading?: number;
      };
      if (typeof e.webkitCompassHeading === "number")
        setHeading(e.webkitCompassHeading);
      else if (e.absolute && e.alpha !== null)
        setHeading((360 - e.alpha) % 360);
    };
    window.addEventListener(
      "deviceorientationabsolute",
      listen as EventListener,
    );
    window.addEventListener("deviceorientation", listen);
    const timer = setTimeout(
      () =>
        setMessage(
          "If the arrow does not respond, use the true-north bearing below. Keep your device flat and away from metal.",
        ),
      4000,
    );
    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        "deviceorientationabsolute",
        listen as EventListener,
      );
      window.removeEventListener("deviceorientation", listen);
    };
  }, [enabled]);
  return (
    <>
      <LocationStatus />
      {bearing !== null && (
        <section className="panel text-center space-y-5">
          <div className="relative mx-auto w-52 h-52 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <span className="absolute top-3 text-xs">
              {heading === null ? "TRUE NORTH" : "DEVICE TOP"}
            </span>
            <span
              className="text-7xl text-primary"
              style={{ transform: `rotate(${bearing - (heading ?? 0)}deg)` }}
              aria-hidden="true"
            >
              ↑
            </span>
          </div>
          <h2 className="text-2xl font-bold">
            {bearing.toFixed(1)}° from true north
          </h2>
          <p className="text-sm">
            Qibla from {location?.city}. The bearing works without compass
            permissions. Sensor readings are approximate.
          </p>
          <button
            className="action"
            onClick={async () => {
              try {
                const orientation = DeviceOrientationEvent as unknown as {
                  requestPermission?: () => Promise<string>;
                };
                if (
                  orientation.requestPermission &&
                  (await orientation.requestPermission()) !== "granted"
                )
                  throw Error("Compass permission was not granted.");
                setEnabled(true);
              } catch {
                setMessage(
                  "Compass unavailable. Use the true-north bearing or map.",
                );
              }
            }}
          >
            Enable compass
          </button>
          <a
            className="action secondary"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.openstreetmap.org/?mlat=${location?.latitude}&mlon=${location?.longitude}#map=14/${location?.latitude}/${location?.longitude}`}
          >
            Open location on map
          </a>
          {message && (
            <p role="status" className="text-xs">
              {message}
            </p>
          )}
        </section>
      )}
    </>
  );
}
