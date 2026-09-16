export function readLocal<T>(key: string, fallback: T): T {
  try {
    return typeof localStorage === "undefined"
      ? fallback
      : (JSON.parse(localStorage.getItem(key) || "null") ?? fallback);
  } catch {
    // Preserve the plain-string theme stored by DeenFlow 1.0.
    if (key === "deenflow-theme" && typeof localStorage !== "undefined") {
      try {
        const value = localStorage.getItem(key);
        if (value && ["system", "light", "dark"].includes(value))
          return value as T;
      } catch {
        /* Storage can be blocked. */
      }
    }
    return fallback;
  }
}
export function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("deenflow-storage"));
    return true;
  } catch {
    return false;
  }
}
