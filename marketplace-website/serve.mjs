import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), 'out');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.ttf': 'font/ttf', '.json': 'application/json', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'dev.html' : decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); return res.end('404'); } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(b); });
}).listen(4848);
