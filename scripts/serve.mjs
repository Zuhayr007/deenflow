import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const path = decodeURIComponent(url.pathname);
    if (path === "/api/push-config") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end('{"publicKey":null,"syncEnabled":false}');
      return;
    }
    if (path.startsWith("/api/")) {
      res.writeHead(503);
      res.end("Server integration is not configured locally.");
      return;
    }
    let file = resolve(root, "." + path);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      await stat(file);
    } catch {
      file = resolve(root, "404.html");
      status = 404;
    }
    res.writeHead(status, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
});
server.listen(4173, "127.0.0.1", () =>
  console.log("DeenFlow preview: http://127.0.0.1:4173"),
);
