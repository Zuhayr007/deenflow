import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";
import { useNotificationSettings } from "@/hooks/use-prayer-notifications";
import { usePrayer } from "@/hooks/use-prayer";
import { PRAYERS } from "@/lib/prayer-api";
import { configurePush, disablePush, showReminder } from "@/lib/push";
export default function SettingsSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme(),
    { settings, permission, update, toggleEnabled, error } =
      useNotificationSettings(),
    { preferences } = usePrayer(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <Drawer autoFocus>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Customize appearance and prayer reminders.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-5 pb-10 space-y-5">
          <label className="field">
            Appearance
            <select
              value={theme}
              onChange={(e) =>
                setTheme(e.target.value as "light" | "dark" | "system")
              }
            >
              <option value="system">Follow device</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <section className="panel space-y-4">
            <h2 className="font-semibold">Prayer reminders</h2>
            <label className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={() => void toggleEnabled()}
              />
              Enable reminders
            </label>
            {permission === "denied" && (
              <p role="alert" className="text-sm">
                Notifications are blocked. Allow them in your browser settings.
              </p>
            )}
            {permission === "unsupported" && (
              <p className="text-sm">
                Notifications are unavailable here. On supported iPhones, add
                DeenFlow to your Home Screen and open it there.
              </p>
            )}
            <fieldset disabled={!settings.enabled} className="space-y-4">
              <legend className="sr-only">Notification preferences</legend>
              <label className="field">
                Minutes before prayer
                <select
                  value={settings.minutesBefore}
                  onChange={(e) =>
                    update({ minutesBefore: Number(e.target.value) })
                  }
                >
                  {[0, 5, 10, 15, 30].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "No advance alert" : n + " minutes"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={settings.atTime}
                  onChange={(e) => update({ atTime: e.target.checked })}
                />
                Also alert at prayer time
              </label>
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => update({ sound: e.target.checked })}
                />
                Device notification sound
              </label>
              <div className="flex flex-wrap gap-4">
                {PRAYERS.map((p) => (
                  <label key={p} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.prayers.includes(p)}
                      onChange={(e) =>
                        update({
                          prayers: e.target.checked
                            ? [...settings.prayers, p]
                            : settings.prayers.filter((v) => v !== p),
                        })
                      }
                    />
                    {p}
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="field">
                  Quiet hours from
                  <input
                    type="time"
                    value={settings.quietStart}
                    onChange={(e) => update({ quietStart: e.target.value })}
                  />
                </label>
                <label className="field">
                  Until
                  <input
                    type="time"
                    value={settings.quietEnd}
                    onChange={(e) => update({ quietEnd: e.target.value })}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Uses your selected location's timezone. Clear either field to
                disable quiet hours.
              </p>
              <label className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={settings.adhkar}
                  onChange={(e) => update({ adhkar: e.target.checked })}
                />
                Adhkar reminder 20 minutes after Fajr and Asr
              </label>
              <button
                className="action secondary"
                onClick={() =>
                  void showReminder("DeenFlow test reminder", {
                    body: "Your device can display reminders.",
                    silent: !settings.sound,
                  })
                    .then(() => setMessage("Test reminder sent."))
                    .catch((e) => setMessage(e.message))
                }
              >
                Send test reminder
              </button>
            </fieldset>
          </section>
          <section className="panel space-y-3">
            <h2 className="font-semibold">Background reminders</h2>
            <p className="text-sm text-muted-foreground">
              Foreground alerts work while DeenFlow is running. Background
              delivery requires permission, an internet connection and a
              supported device; timing can be affected by battery settings.
            </p>
            <button
              className="action"
              disabled={busy || !settings.enabled || !preferences.location}
              onClick={async () => {
                setBusy(true);
                try {
                  await configurePush(preferences, settings);
                  setMessage("Background reminders enabled.");
                } catch (e) {
                  setMessage((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Enable background reminders
            </button>
            <button
              className="action secondary"
              disabled={busy}
              onClick={async () => {
                try {
                  await disablePush();
                  setMessage("Background reminders disabled.");
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              Disable background reminders
            </button>
          </section>
          {(message || error) && (
            <p role="status" className="text-sm">
              {message || error}
            </p>
          )}
          <Link className="action secondary" to="/tools/backup">
            Offline downloads & backup
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
