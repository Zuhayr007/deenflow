import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";
import { useNotificationSettings } from "@/hooks/use-prayer-notifications";
import { Switch } from "@/components/ui/switch";
import { Bell, Volume2 } from "lucide-react";

const themes = [
  { value: "light" as const, label: "Light", icon: "☀️" },
  { value: "dark" as const, label: "Dark", icon: "🌙" },
  { value: "system" as const, label: "System", icon: "💻" },
];

export default function SettingsSheet({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { settings, permission, update, toggleEnabled } = useNotificationSettings();

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle style={{ fontFamily: "var(--font-display)" }}>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 space-y-6">
          {/* Theme */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Appearance
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition-all ${
                    theme === t.value
                      ? "border-primary bg-primary/8 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span
                    className={`text-xs font-medium ${theme === t.value ? "text-primary" : "text-muted-foreground"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prayer reminders */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Prayer Reminders
            </p>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              <div className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Alert before salah
                  </p>
                  <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    {settings.minutesBefore} minutes before each prayer
                  </p>
                </div>
                <Switch checked={settings.enabled} onCheckedChange={() => void toggleEnabled()} />
              </div>

              <div className={`flex items-center gap-3 p-4 ${settings.enabled ? "" : "opacity-50"}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Volume2 className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Sound
                  </p>
                  <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Uses your device's default tone
                  </p>
                </div>
                <Switch
                  checked={settings.sound}
                  disabled={!settings.enabled}
                  onCheckedChange={(v) => update({ sound: v })}
                />
              </div>
            </div>
            {permission === "denied" && (
              <p className="mt-2 text-[11px] text-destructive" style={{ fontFamily: "var(--font-body)" }}>
                Notifications are blocked. Allow them for DeenFlow in your browser settings.
              </p>
            )}
            {permission === "unsupported" && (
              <p className="mt-2 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                This device doesn't support notifications.
              </p>
            )}
            {settings.enabled && (
              <p className="mt-2 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                Keep DeenFlow open or installed in the background to receive reminders.
              </p>
            )}
          </div>

          {/* App info */}
          <div className="rounded-2xl bg-secondary/50 p-4 text-center">
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              DeenFlow v1.0 — Your daily Islamic companion
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
