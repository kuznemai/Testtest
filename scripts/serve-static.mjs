// Serves the generated static site the way GitHub Pages does: files first,
// directory index.html second, 404.html as the SPA fallback.
//
// Used by `npm run preview:static` and by the static E2E run.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.env.STATIC_ROOT ?? ".output/public");
const BASE = (process.env.STATIC_BASE ?? "/").replace(/\/+$/, "");
const PORT = Number(process.env.STATIC_PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);

  if (BASE && url === BASE) {
    res.writeHead(301, { location: `${BASE}/` });
    return res.end();
  }
  if (BASE && !url.startsWith(`${BASE}/`)) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("Not found");
  }

  const relative = url.slice(BASE.length).replace(/^\/+/, "");
  const candidates = [
    path.join(ROOT, relative),
    path.join(ROOT, relative, "index.html"),
    path.join(ROOT, "404.html"),
  ];

  for (const file of candidates) {
    // Never serve anything outside the generated directory.
    if (!file.startsWith(ROOT)) continue;
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;

    res.writeHead(file.endsWith("404.html") && !relative.endsWith("404.html") ? 404 : 200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
    });
    return res.end(fs.readFileSync(file));
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`static preview on http://127.0.0.1:${PORT}${BASE}/\n`);
});
