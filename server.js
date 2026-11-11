const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const CLEAN_ROUTES = {
  '/': '/index.html',
  '/about': '/about.html',
  '/glass-recovery': '/glass-recovery.html',
  '/bsf-organics': '/bsf-organics.html',
  '/solutions': '/solutions.html'
};

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(req.url.split('?')[0]);
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  if (CLEAN_ROUTES[pathname]) {
    pathname = CLEAN_ROUTES[pathname];
  }

  const filePath = path.resolve(DIR, '.' + pathname);
  if (!filePath.startsWith(path.resolve(DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPage = path.join(DIR, '404.html');
      fs.stat(notFoundPage, (nfErr, nfStats) => {
        if (!nfErr && nfStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          fs.createReadStream(notFoundPage).pipe(res);
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found: ' + pathname);
      });
      return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Trash Qwins server running at http://localhost:${PORT}`);
  console.log(`Open in browser: http://127.0.0.1:${PORT}`);
});

