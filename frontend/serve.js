const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const FRONTEND_ROOT = __dirname;
const ASSETS_ROOT = path.join(__dirname, '..', 'assets');

const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.pdf': 'application/pdf'
};

function send(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
    });
}

http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const base = urlPath.startsWith('/assets/') ? ASSETS_ROOT : FRONTEND_ROOT;
    const rel = urlPath.startsWith('/assets/') ? urlPath.slice('/assets'.length) : urlPath;
    let target = path.join(base, rel === '/' ? '/index.html' : rel);

    if (!target.startsWith(base)) { res.writeHead(403); res.end('Forbidden'); return; }

    fs.stat(target, (err, stat) => {
        if (!err && stat.isFile()) return send(res, target);
        send(res, target + '.html');
    });
}).listen(PORT, () => console.log(`Frontend preview en http://localhost:${PORT}`));
