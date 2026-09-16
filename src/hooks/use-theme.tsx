import { useState, useEffect, useCallback } from "react";
import { writeLocal } from "@/lib/storage";
type Theme = "light" | "dark" | "system";
function stored(): Theme {
  try {
    const raw = localStorage.getItem("deenflow-theme");
    const value = raw?.startsWith('"') ? JSON.parse(raw) : raw;
    return ["light", "dark", "system"].includes(value) ? value : "system";
  } catch {
    return "system";
  }
}
function apply(theme: Theme) {
  document.documentElement.classList.toggle(
    "dark",
    theme === "dark" ||
      (theme === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches),
  );
}
export function useTheme() {
  const [theme, setState] = useState<Theme>("system");
  const setTheme = useCallback((t: Theme) => {
    setState(t);
    writeLocal("deenflow-theme", t);
    apply(t);
  }, []);
  useEffect(() => {
    const sync = () => {
      const next = stored();
      setState(next);
      apply(next);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("deenflow-storage", sync);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("deenflow-storage", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);
  return { theme, setTheme };
}
