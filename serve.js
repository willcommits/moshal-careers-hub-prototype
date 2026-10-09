// Tiny static server for the prototype, so the browser pane can load it over http instead of file://.
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml', '.json':'application/json'};
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(root, url === '/' ? 'index.html' : url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
  fs.createReadStream(file).pipe(res);
}).listen(4321, () => console.log('serving ' + root + ' on http://localhost:4321'));
