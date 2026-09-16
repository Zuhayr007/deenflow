import { PRAYERS, type Prayer, type Schedule } from "./prayer-api";
export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  minutesBefore: number;
  prayers: Prayer[];
  atTime: boolean;
  quietStart: string;
  quietEnd: string;
  adhkar: boolean;
}
export const NOTIFICATION_DEFAULTS: NotificationSettings = {
  enabled: false,
  sound: true,
  minutesBefore: 5,
  prayers: [...PRAYERS],
  atTime: true,
  quietStart: "",
  quietEnd: "",
  adhkar: false,
};
export function isQuiet(
  at: number,
  timezone: string,
  start: string,
  end: string,
) {
  if (!start || !end || start === end) return false;
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(at));
  return start < end
    ? time >= start && time < end
    : time >= start || time < end;
}
export function reminderEvents(
  schedules: Schedule[],
  settings: NotificationSettings,
) {
  if (!settings.enabled) return [];
  return schedules.flatMap((s) =>
    PRAYERS.filter((p) => settings.prayers.includes(p))
      .flatMap((p) => {
        const base = {
          title: `Time for ${p}`,
          body: `${p} begins at ${s.times[p]}.`,
          at: s.instants[p],
          tag: `deenflow-${s.date}-${p}-start`,
        };
        return [
          ...(settings.atTime ? [base] : []),
          ...(settings.minutesBefore > 0
            ? [
                {
                  ...base,
                  title: `${p} in ${settings.minutesBefore} minutes`,
                  at: base.at - settings.minutesBefore * 60000,
                  tag: `deenflow-${s.date}-${p}-before`,
                },
              ]
            : []),
        ];
      })
      .concat(
        settings.adhkar
          ? ["Fajr", "Asr"].map((p) => ({
              title: "A moment for daily adhkar",
              body: "Open your morning or evening remembrance session.",
              at: s.instants[p as Prayer] + 20 * 60000,
              tag: `deenflow-${s.date}-${p}-adhkar`,
            }))
          : [],
      )
      .filter(
        (e) =>
          !isQuiet(e.at, s.timezone, settings.quietStart, settings.quietEnd),
      ),
  );
}
