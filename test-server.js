const http = require('http');

const urls = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/buttons-3d.css',
  '/js/app.js',
  '/js/db.js',
  '/js/modules.js',
  '/js/pwa.js',
  '/manifest.json',
  '/version.json',
  '/icons/app-logo.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/favicon.svg'
];

let failed = 0;
let completed = 0;

urls.forEach(u => {
  http.get('http://localhost:3000' + u, res => {
    if (res.statusCode === 200) {
      console.log(`[OK] ${u} (${res.headers['content-type']})`);
    } else {
      console.error(`[FALHA] ${u} -> Status ${res.statusCode}`);
      failed++;
    }
    completed++;
    if (completed === urls.length) {
      console.log(`\nValidação concluída: ${completed - failed}/${completed} rotas funcionando perfeitamente.`);
      process.exit(failed > 0 ? 1 : 0);
    }
  }).on('error', err => {
    console.error(`[ERRO] ${u}: ${err.message}`);
    failed++;
    completed++;
    if (completed === urls.length) {
      process.exit(1);
    }
  });
});
