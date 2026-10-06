const http = require('http');
const httpProxy = require('http-proxy');

// هماهنگی با پورت متغیر در پلتفرم‌های مختلف (۷۸۶۰ برای Hugging Face)
const PORT = process.env.PORT || 7860; 
const TARGET = 'https://3wg9sx2kui5imbiu0ia70sq56lyql.f11-c9b.workers.dev';

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true, // این گزینه به صورت خودکار هدر Host را برای کلادفلر تنظیم می‌کند
  ws: true,           // فعال‌‌سازی پشتیبانی از WebSocket
  secure: true
});

proxy.on('error', function(err, req, res) {
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  }
});

const server = http.createServer((req, res) => {
  // حذف هدرهایی که ممکن است باعث حساسیت فایروال کلادفلر شوند
  delete req.headers['cf-connecting-ip'];
  delete req.headers['x-forwarded-for'];
  delete req.headers['x-real-ip'];

  proxy.web(req, res);
});

// مدیریت ترافیک WebSocket (VLESS/VMESS)
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
