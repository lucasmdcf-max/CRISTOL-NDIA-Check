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
  '/js/html2pdf.bundle.min.js',
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
    // Se for arquivo JS próprio, valida sintaxe
    if (relPath.startsWith('js/') && !relPath.includes('min.js')) {
      try {
        const code = fs.readFileSync(absPath, 'utf8');
        new Function(code);
        console.log(`  └─ [SYNTAX OK] ${relPath}`);
      } catch (err) {
        console.error(`  └─ [SYNTAX ERROR] ${relPath}: ${err.message}`);
        staticErrors++;
      }
    }
  }
});

if (staticErrors > 0) {
  console.error(`\nValidação estática/sintaxe falhou com ${staticErrors} erro(s).`);
  process.exit(1);
} else {
  console.log(`\nValidação estática e de sintaxe concluída com sucesso: todos os ${urls.length} arquivos existem e estão 100% íntegros.`);
  process.exit(0);
}

