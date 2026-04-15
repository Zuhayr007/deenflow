import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";

const themes = [
  { value: "light" as const, label: "Light", icon: "☀️" },
  { value: "dark" as const, label: "Dark", icon: "🌙" },
  { value: "system" as const, label: "System", icon: "💻" },
];

export default function SettingsSheet({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

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
