/**
 * BHARAT ALPHA TERMINAL - LIGHTWEIGHT ZERO-DEPENDENCY HTTP SERVER
 * Uses native Node.js 'http', 'fs', and 'path' modules.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  function serveFile(p) {
    const ext = path.extname(p).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(p);
    stream.pipe(res);
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(filePath);
      return;
    }

    // Try appending .html
    if (!path.extname(filePath)) {
      const htmlPath = filePath + '.html';
      fs.stat(htmlPath, (err2, stats2) => {
        if (!err2 && stats2.isFile()) {
          serveFile(htmlPath);
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: Bharat Alpha Terminal');
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found: Bharat Alpha Terminal');
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log('🏛️  BHARAT ALPHA TERMINAL (2026-2030) LOCAL SERVER');
  console.log(`🌐 Server running at: http://localhost:${PORT}/`);
  console.log('⚡ Serving institutional research dossier & codebase');
  console.log('====================================================');
});
