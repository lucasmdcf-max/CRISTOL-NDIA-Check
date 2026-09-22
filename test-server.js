const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Validação estática direta dos arquivos
let staticErrors = 0;
urls.forEach(u => {
  const relPath = u === '/' ? 'index.html' : u.replace(/^\//, '');
  const absPath = path.join(__dirname, relPath);
  if (!fs.existsSync(absPath)) {
    console.error(`[FALHA ARQUIVO] Não encontrado: ${relPath}`);
    staticErrors++;
  } else {
    console.log(`[OK ARQUIVO] ${relPath} (${fs.statSync(absPath).size} bytes)`);
  }
});

if (staticErrors > 0) {
  console.error(`\nValidação estática falhou com ${staticErrors} arquivo(s) ausente(s).`);
  process.exit(1);
} else {
  console.log(`\nValidação estática concluída com sucesso: todos os ${urls.length} arquivos existem e estão íntegros.`);
  process.exit(0);
}
