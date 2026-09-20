/* ==========================================================================
   CRISTOLÂNDIA CHECK - GERENCIADOR PWA & INSTALAÇÃO (ANDROID & IPHONE)
   Registro de Service Worker, detecção de iOS e anti-cache com version.json
   ========================================================================== */

let deferredInstallPrompt = null;

function initPWA() {
  registerServiceWorker();
  setupInstallPrompt();
  setupVersionChecker();
  checkIfStandalone();
}

// 1. Registro do Service Worker com Auto-Update Imediato
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          // Força verificação imediata de nova versão no servidor a cada recarregamento
          reg.update();

          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'activated') {
                  console.log('[PWA] Nova versão ativada imediatamente.');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] Falha ao registrar Service Worker:', err);
        });
    });

    // Atualização instantânea sem necessidade de limpar histórico de navegação
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

// 2. Manipulação do evento de instalação (Android / Chrome)
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    showToast('Cristolândia Check instalado com sucesso na sua tela inicial!', 'success');
  });
}

// Disparador de instalação ao clicar no botão
function triggerPWAInstall() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    openIOSInstallGuide();
    return;
  }

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Usuário aceitou a instalação');
      }
      deferredInstallPrompt = null;
    });
  } else {
    // Guia genérico caso o navegador não suporte o prompt automático
    openGeneralInstallGuide();
  }
}

// Guia passo a passo para iPhone (iOS)
function openIOSInstallGuide() {
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
      </div>
      <div>
        <h2>Instalar no iPhone (iOS)</h2>
        <p>Adicionar Cristolândia à Tela de Início</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:16px; padding:6px 0;">
      <div style="display:flex; align-items:flex-start; gap:14px;">
        <div style="width:32px; height:32px; border-radius:50%; background:var(--green-light); color:var(--green-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.88rem; flex:none;">
          1
        </div>
        <div>
          <h4 style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Toque em Compartilhar</h4>
          <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.4;">Na barra inferior do Safari, toque no ícone com o quadrado e a seta para cima (Compartilhar).</p>
        </div>
      </div>

      <div style="display:flex; align-items:flex-start; gap:14px;">
        <div style="width:32px; height:32px; border-radius:50%; background:var(--green-light); color:var(--green-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.88rem; flex:none;">
          2
        </div>
        <div>
          <h4 style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Adicionar à Tela de Início</h4>
          <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.4;">Role a lista e selecione <strong>"Adicionar à Tela de Início"</strong> (ícone com o sinal de +).</p>
        </div>
      </div>

      <div style="display:flex; align-items:flex-start; gap:14px;">
        <div style="width:32px; height:32px; border-radius:50%; background:var(--green-light); color:var(--green-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.88rem; flex:none;">
          3
        </div>
        <div>
          <h4 style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Confirmar Adição</h4>
          <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.4;">Toque em "Adicionar" no topo direito. A logo oficial dourada com o check verde aparecerá como aplicativo na tela inicial.</p>
        </div>
      </div>

      <div style="background:var(--bg-surface); padding:12px; border-radius:14px; border:1px solid var(--border-beige); text-align:center;">
        <img src="icons/app-logo.png" alt="Ícone Oficial Cristolândia Check" style="width:52px; height:52px; border-radius:50%; box-shadow:0 2px 8px rgba(197,137,8,0.25); margin-bottom:4px;">
        <p style="font-size:0.72rem; font-weight:700; color:var(--green-primary);">Logo oficial configurada para iPhone e Android</p>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" onclick="closeModal('modal-generic')">Entendi</button>
  `;

  openModal('modal-generic');
}

function openGeneralInstallGuide() {
  showToast('Para instalar: toque no menu de 3 pontos do navegador e escolha "Instalar Aplicativo" ou "Adicionar à tela inicial".', 'info');
}

function checkIfStandalone() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const banner = document.getElementById('pwa-install-banner');
  if (isStandalone && banner) {
    banner.style.display = 'none';
  }
}

// 3. Verificação periódica de atualização (Pilar 6.1 do Guia CUIDAR)
function setupVersionChecker() {
  setInterval(async () => {
    try {
      const resp = await fetch('./version.json?t=' + Date.now());
      if (resp.ok) {
        const data = await resp.json();
        const localBuild = localStorage.getItem('cristolandia_build_version');
        if (localBuild && localBuild !== data.build) {
          showToast(`Nova versão detectada (${data.version}). Toque para atualizar.`, 'warning');
        }
        localStorage.setItem('cristolandia_build_version', data.build);
      }
    } catch (e) {
      // Offline silenciado
    }
  }, 60000); // a cada 60s
}
