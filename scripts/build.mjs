import { build, loadEnv } from "vite";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const publicEnv = loadEnv("production", process.cwd(), "VITE_");
process.env.VITE_SITE_URL ||= publicEnv.VITE_SITE_URL || process.env.URL || "";
process.env.VITE_CONTACT_EMAIL ||= publicEnv.VITE_CONTACT_EMAIL || "";
if (process.env.VITE_SITE_URL) {
  const origin = new URL(process.env.VITE_SITE_URL);
  if (!["https:", "http:"].includes(origin.protocol))
    throw Error("VITE_SITE_URL must be an HTTP(S) origin.");
  process.env.VITE_SITE_URL = origin.origin;
}
await build({ logLevel: "warn" });
await build({
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ".server", emptyOutDir: true },
});
const { renderPage } = await import("../.server/entry-server.js");
const template = await readFile("dist/index.html", "utf8");
await writeFile(".server/template.html", template);
const cities = ["cape-town", "johannesburg", "durban", "pretoria", "gqeberha"];
const categories = [
  "morning-and-evening",
  "forgiveness",
  "rizq-and-income",
  "jobs-and-opportunities",
  "deceased",
  "daily",
  "protection",
  "health-and-healing",
  "guidance-and-knowledge",
  "patience-and-gratitude",
  "marriage-and-family",
  "travel",
  "before-and-after-meals",
  "sleeping-and-waking",
  "anxiety-and-distress",
  "parents",
];
const paths = [
  "/",
  "/quran",
  "/duas",
  "/prayer-times",
  "/tools",
  "/about",
  ...["qibla", "adhkar", "ramadan", "masjid", "backup", "learn"].map(
    (s) => "/tools/" + s,
  ),
  ...["privacy", "sources", "calculations", "contact"].map(
    (s) => "/about/" + s,
  ),
  ...cities.map((s) => "/prayer-times/south-africa/" + s),
  ...categories.map((s) => "/duas/" + s),
  ...Array.from({ length: 114 }, (_, i) => "/quran/" + (i + 1)),
  ...Array.from({ length: 58 }, (_, i) => "/dua/" + (i + 1)),
];
export function documentHtml(template, rendered, path, origin) {
  const tags = [];
  const body = rendered.replace(
    /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?\s*>|<link\b[^>]*\/?\s*>/g,
    (tag) => {
      tags.push(tag);
      return "";
    },
  );
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<meta\s+(?:name="description"|property="og:[^"]*")[^>]*>/g, "");
  html = html
    .replace("</head>", tags.join("") + "</head>")
    .replace('<div id="root"></div>', '<div id="root">' + body + "</div>");
  return html;
}
const origin = process.env.VITE_SITE_URL
  ? new URL(process.env.VITE_SITE_URL).origin
  : "";
for (const path of paths) {
  const dir = "dist" + (path === "/" ? "" : path);
  await mkdir(dir, { recursive: true });
  await writeFile(
    dir + "/index.html",
    documentHtml(template, await renderPage(path), path, origin),
  );
}
await writeFile(
  "dist/404.html",
  documentHtml(template, await renderPage("/not-a-page"), "/404", origin),
);
const assets = (await readdir("dist/assets")).map((f) => "/assets/" + f);
const revision = createHash("sha256")
    .update(assets.join("|"))
    .update(await readFile("public/sw.js"))
    .update(await readFile("public/manifest.json"))
    .update(await readFile("public/icon-192.png"))
    .update(await readFile("public/icon-512.png"))
    .digest("hex")
    .slice(0, 12),
  cache = "deenflow-" + revision;
const core = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  ...assets.filter((f) => !/^\/assets\/\d+-/.test(f) && !f.endsWith(".woff")),
];
const sw = (await readFile("public/sw.js", "utf8"))
  .replace("__DEENFLOW_CACHE__", cache)
  .replace("__DEENFLOW_PRECACHE__", JSON.stringify(core));
await writeFile("dist/sw.js", sw);
await writeFile(
  "dist/offline-assets.json",
  JSON.stringify({
    cache,
    assets: ["/", ...assets.filter((f) => !f.endsWith(".woff"))],
  }),
);
if (origin) {
  const escape = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  await writeFile(
    "dist/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map((p) => "<url><loc>" + escape(origin + p) + "</loc></url>")
        .join("") +
      "</urlset>",
  );
}
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /.netlify/\n" +
    (origin ? "Sitemap: " + origin + "/sitemap.xml\n" : ""),
);
console.log(
  "Prerendered " +
    paths.length +
    " public pages; built offline cache " +
    revision +
    "." +
    (!origin ? " Set VITE_SITE_URL for canonical URLs and sitemap." : ""),
);
