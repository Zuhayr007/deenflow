import { useEffect, useState } from "react";
export default function AppStatus() {
  const [offline, setOffline] = useState(false),
    [update, setUpdate] = useState<ServiceWorker | null>(null),
    [pushError, setPushError] = useState(false);
  useEffect(() => {
    const online = () => setOffline(!navigator.onLine);
    online();
    window.addEventListener("online", online);
    window.addEventListener("offline", online);
    const failed = () => setPushError(true);
    window.addEventListener("deenflow-push-error", failed);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      void navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg.waiting) setUpdate(reg.waiting);
          reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            worker?.addEventListener("statechange", () => {
              if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
              )
                setUpdate(worker);
            });
          });
        })
        .catch(() => undefined);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", online);
      window.removeEventListener("deenflow-push-error", failed);
    };
  }, []);
  return (
    <>
      {offline && (
        <p role="status" className="bg-secondary p-3 text-center text-xs">
          You’re offline. Calculated prayer times and downloaded content remain
          available.
        </p>
      )}
      {pushError && (
        <p role="status" className="bg-secondary p-3 text-center text-xs">
          Background reminder settings could not sync. Reconnect and enable
          background reminders again.
        </p>
      )}
      {update && (
        <button
          className="w-full bg-secondary p-3 text-sm"
          onClick={() => {
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => window.location.reload(),
              { once: true },
            );
            update.postMessage("ACTIVATE_UPDATE");
          }}
        >
          An update is ready. Tap to refresh DeenFlow.
        </button>
      )}
    </>
  );
}
