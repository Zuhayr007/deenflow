import { test, expect } from "@playwright/test";
import {
  calculateSchedule,
  DEFAULT_PREFERENCES,
} from "../../src/lib/prayer-api";
import { CITIES } from "../../src/lib/cities";
import { NOTIFICATION_DEFAULTS } from "../../src/lib/reminders";

test("settings moves focus into the drawer and restores it on close", async ({
  page,
}) => {
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (/aria-hidden|Missing.*Description/.test(message.text()))
      warnings.push(message.text());
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Log.enable");
  cdp.on("Log.entryAdded", ({ entry }) => {
    if (/aria-hidden/.test(entry.text)) warnings.push(entry.text);
  });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open settings" });
  for (const activation of ["pointer", "keyboard"]) {
    if (activation === "pointer") await trigger.click();
    else {
      await trigger.focus();
      await page.keyboard.press("Enter");
    }
    const dialog = page.getByRole("dialog", { name: "Settings" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(
      "Customize appearance and prayer reminders.",
    );
    await expect(dialog.getByLabel("Appearance")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      dialog.getByRole("link", { name: "Offline downloads & backup" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByLabel("Appearance")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  expect(warnings).toEqual([]);
});

test("public content and specific titles exist without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/quran/1");
  await expect(page.locator("h1")).toContainText("Al-Faatiha");
  await expect(page.locator('[lang="ar"]').first()).toBeVisible();
  await expect(page).toHaveTitle(/Al-Faatiha/);
  await page.goto("http://127.0.0.1:4173/quran/2");
  await expect(page.locator("[data-ayah]")).toHaveCount(286);
  await expect(page.locator("[data-ayah]").last()).toBeVisible();
  await page.goto("http://127.0.0.1:4173/duas/forgiveness");
  await expect(page.locator("article")).toHaveCount(6);
  await expect(page.locator("article").first()).toBeVisible();
  const response = await page.goto("http://127.0.0.1:4173/quran/999");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await context.close();
});
test("precise location loads automatically and is shared with prayer tools", async ({
  page,
  context,
}) => {
  const location = { latitude: -33.918123, longitude: 18.421987 };
  await context.setGeolocation(location);
  await page.addInitScript(() =>
    localStorage.setItem(
      "deenflow-prayer",
      JSON.stringify({
        location: { latitude: 51.5, longitude: -0.12, city: "Old saved city" },
      }),
    ),
  );
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toBeVisible();
  await expect(page.getByText("Location & prayer calculation")).toHaveCount(0);
  await expect(page.getByLabel("Choose a city")).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("deenflow-prayer")!).location,
      ),
    )
    .toMatchObject(location);
  await page.getByRole("link", { name: "Quran", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quran", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Prayer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toBeVisible();
  await page.goto("/tools/qibla");
  await expect(
    page.getByRole("heading", { name: /from true north/ }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("denied location never displays saved-city times and can be retried", async ({
  page,
  context,
}) => {
  await context.clearPermissions();
  await page.addInitScript(() =>
    localStorage.setItem(
      "deenflow-prayer",
      JSON.stringify({
        location: { latitude: 51.5, longitude: -0.12, city: "Old saved city" },
      }),
    ),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText(
    "Location permission is blocked",
  );
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toHaveCount(0);
  await context.grantPermissions(["geolocation"]);
  await page.getByRole("button", { name: "Try location again" }).click();
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toBeVisible();
});

test("location timeout is recoverable and requests a fresh high-accuracy position", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.geolocation, "getCurrentPosition", {
      value: (
        _success: PositionCallback,
        error: PositionErrorCallback,
        options: PositionOptions,
      ) => {
        Object.defineProperty(window, "__locationOptions", {
          value: options,
          configurable: true,
        });
        setTimeout(() => error({ code: 3 } as GeolocationPositionError), 0);
      },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("took too long");
  await expect(
    page.getByRole("button", { name: "Try location again" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __locationOptions: PositionOptions })
          .__locationOptions,
    ),
  ).toMatchObject({ enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toHaveCount(0);
});
test("reader preserves bookmarks and resumes the selected verse", async ({
  page,
}) => {
  await page.goto("/quran/1#ayah-4");
  await page
    .getByRole("button", { name: "Bookmark ayah", exact: true })
    .nth(3)
    .click();
  await page.locator('a[href="#ayah-4"]').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("deenflow-lastread") || "null")?.ayah,
      ),
    )
    .toBe(4);
  await page.getByRole("link", { name: "Quran", exact: true }).click();
  await expect(page.getByText(/Continue reading.*ayah 4/)).toBeVisible();
  await page.getByText(/Continue reading.*ayah 4/).click();
  await expect(
    page.getByRole("button", { name: "Remove bookmark", exact: true }),
  ).toHaveCount(1);
  await expect(page.locator("head title")).toHaveCount(1);
});
test("dua search, favourites and detail navigation work", async ({ page }) => {
  await page.goto("/duas");
  await page.getByLabel("Find a dua").fill("pardon");
  await expect(page.locator("article")).not.toHaveCount(0);
  await page
    .getByRole("button", { name: "☆ Save", exact: true })
    .first()
    .click();
  await page.getByLabel("Find a dua").fill("");
  await page.getByLabel("Favourites only").check();
  await expect(page.locator("article")).toHaveCount(1);
  await page.locator("article h2 a").click();
  await expect(page).toHaveURL(/\/dua\/\d+/);
  await expect(page.locator("head title")).toHaveCount(1);
});
test("month timetable and all tools have usable pages", async ({ page }) => {
  for (const path of [
    "/prayer-times/south-africa/cape-town",
    "/tools/adhkar",
    "/tools/ramadan",
    "/tools/masjid",
    "/tools/learn",
    "/tools/backup",
    "/about/privacy",
  ]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/prayer-times/south-africa/cape-town");
  await page.getByLabel("Timetable month").fill("2028-02");
  await expect(page.locator("tbody tr")).toHaveCount(29);
});
test("downloaded app and Quran chapter work offline after reload", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.goto("/quran/1");
  await expect(
    page.getByRole("heading", { name: "Al-Faatiha", exact: true }),
  ).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Al-Faatiha", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("offline");
});

test("foreground reminders survive navigation away from the prayer page", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["notifications", "geolocation"]);
  const schedule = calculateSchedule(CITIES[0], "2026-09-16");
  await page.clock.install({ time: new Date(schedule.instants.Fajr - 65000) });
  await page.addInitScript(
    ({ preferences, notifications }) => {
      localStorage.setItem("deenflow-prayer", JSON.stringify(preferences));
      localStorage.setItem(
        "deenflow-notifications",
        JSON.stringify(notifications),
      );
      const messages: string[] = [];
      Object.defineProperty(window, "__notifications", { value: messages });
      ServiceWorkerRegistration.prototype.showNotification = async function (
        title,
      ) {
        messages.push(title);
      };
    },
    {
      preferences: { ...DEFAULT_PREFERENCES, location: CITIES[0] },
      notifications: {
        ...NOTIFICATION_DEFAULTS,
        enabled: true,
        minutesBefore: 0,
        prayers: ["Fajr"],
      },
    },
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Today's prayer times" }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByRole("link", { name: "Quran", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quran", exact: true }),
  ).toBeVisible();
  await page.clock.runFor(66000);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __notifications: string[] }).__notifications,
      ),
    )
    .toContain("Time for Fajr");
});

test("backup restore validates before replacing local reading data", async ({
  page,
}) => {
  await page.goto("/tools/backup");
  await page.getByLabel("Restore a backup file").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ version: 1, data: { "deenflow-bookmarks": [4, 10] } }),
    ),
  });
  await expect(page.getByRole("button", { name: "Restore now" })).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("deenflow-bookmarks")),
  ).toBeNull();
  await page.getByRole("button", { name: "Restore now" }).click();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("deenflow-bookmarks")!),
    ),
  ).toEqual([4, 10]);
  await page.getByLabel("Restore a backup file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ version: 1, data: { "deenflow-bookmarks": [9999] } }),
    ),
  });
  await expect(page.getByRole("status")).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("deenflow-bookmarks")!),
    ),
  ).toEqual([4, 10]);
});

test("audio controls support playback, repeat ranges and cleanup on navigation", async ({
  page,
}) => {
  const samples = 8000 * 6,
    wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  await page.route("https://cdn.islamic.network/quran/audio/**", (route) =>
    route.fulfill({ contentType: "audio/wav", body: wav }),
  );
  await page.goto("/quran/1");
  await page.getByRole("button", { name: "Play recitation" }).click();
  await expect(
    page.getByRole("button", { name: "Pause recitation" }),
  ).toBeVisible();
  await page
    .getByText("Audio & memorization controls", { exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Repeat", exact: true })
    .selectOption("range");
  await page.getByLabel("Through ayah").fill("2");
  await page.getByRole("button", { name: "Play range" }).click();
  await expect(
    page.getByRole("button", { name: "Pause recitation" }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(window, "__oldAudio", {
      value: document.querySelector("audio"),
    });
  });
  await page.getByRole("link", { name: "Duas", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __oldAudio: HTMLAudioElement }).__oldAudio
          .paused,
    ),
  ).toBe(true);
});

test("the complete offline pack opens an unvisited Quran chapter", async ({
  page,
  context,
}) => {
  await page.goto("/tools/backup");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole("button", { name: "Download offline pack" }).click();
  await expect(
    page.getByText("Offline download complete.", { exact: false }),
  ).toBeVisible({ timeout: 30000 });
  await context.setOffline(true);
  await page.goto("/quran/2");
  await expect(
    page.getByRole("heading", { name: "Al-Baqara", exact: true }),
  ).toBeVisible();
  await expect(page.locator("[data-ayah]")).toHaveCount(286);
});
