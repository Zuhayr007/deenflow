import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderPage } from "../../.server/entry-server.js";
const cities = ["cape-town", "johannesburg", "durban", "pretoria", "gqeberha"];
export default async function (request) {
  const city = new URL(request.url).searchParams.get("city");
  if (!cities.includes(city))
    return new Response("City not found", { status: 404 });
  const template = await readFile(
    resolve(process.cwd(), ".server/template.html"),
    "utf8",
  );
  const rendered = await renderPage("/prayer-times/south-africa/" + city);
  const tags = [];
  const body = rendered.replace(
    /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?\s*>|<link\b[^>]*\/?\s*>/g,
    (tag) => {
      tags.push(tag);
      return "";
    },
  );
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<meta\s+(?:name="description"|property="og:[^"]*")[^>]*>/g, "")
    .replace("</head>", tags.join("") + "</head>")
    .replace('<div id="root"></div>', '<div id="root">' + body + "</div>");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
