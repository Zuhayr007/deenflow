import { useEffect } from "react";
import { usePrayer } from "@/hooks/use-prayer";

export default function LocationStatus() {
  const { locationStatus, locationError, requestLocation } = usePrayer();
  useEffect(() => requestLocation(), [requestLocation]);
  if (locationStatus === "ready") return null;
  return (
    <section className="panel space-y-3" aria-label="Current location">
      {locationStatus === "error" ? (
        <>
          <p role="alert">{locationError}</p>
          <button className="action" onClick={() => requestLocation(true)}>
            Try location again
          </button>
        </>
      ) : (
        <p role="status">
          Finding your location… Allow location access when your browser asks.
        </p>
      )}
    </section>
  );
}
