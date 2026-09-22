/* ==========================================================================
   CRISTOLÂNDIA CHECK - CONTROLLER PRINCIPAL & MICRO-ANIMAÇÕES
   Gestão de Estado em Memória, Efeito 3D Tátil e Conectividade
   ========================================================================== */

// Estado Global em Memória (In-Memory First)
const state = {
  activeUnit: null,
  totalAcolhidosHoje: 0,
  totalRefeicoesHoje: 0,
  novasTriagensHoje: 0,
  isOnline: navigator.onLine,
  lastActiveTimestamp: Date.now()
};

document.addEventListener('DOMContentLoaded', async () => {
  // Inicialização do banco e dados
  await dbManager.init();
  
  // Inicialização PWA
  initPWA();

  // Configurar ouvintes de status do banco
  dbManager.onStatusChange((status, label) => {
    updateCloudStatusUI(status, label);
  });

  // Configurar data atual na interface
  renderCurrentDate();

  // Atualizar métricas do card de visão geral
  updateHeroMetrics();

  // Ativar efeitos 3D táteis e micro-animações nos 6 botões
  setup3DButtonsInteractions();

  // Monitoramento de inatividade (30 minutos)
  setupInactivityWatcher();

  // Ouvinte de sincronização remota em tempo real (Motor CUIDAR Pilar 1)
  window.addEventListener('db:cloud-synced', (e) => {
    updateHeroMetrics();
    const detail = (e && e.detail) || {};
    if (detail.firstLoad) {
      // Primeira carga: silenciosa
      return;
    }
    if (detail.isLocalWrite) {
      // Gravação deste mesmo dispositivo: atualiza tela silenciosamente (já exibiu toast ao salvar)
      refreshCurrentScreen();
      return;
    }
    // Gravação vinda de outro dispositivo: atualiza a tela ativa e notifica o usuário
    refreshCurrentScreen();
    showToast('📡 Dados sincronizados em tempo real!', 'info');
  });
});

// Rastreamento global de tela ativa para atualização reativa
window._currentScreen = null;

function refreshCurrentScreen() {
  const genericModal = document.getElementById('modal-generic');
  if (!genericModal || !genericModal.classList.contains('active')) {
    window._currentScreen = null;
    return;
  }
  const screen = window._currentScreen;
  if (!screen) return;

  if (screen.type === 'stock-update') {
    if (typeof renderStockList === 'function') {
      const bannerVal = document.getElementById('stock-last-update-banner-val');
      if (bannerVal && typeof dbManager !== 'undefined') {
        const lastUp = dbManager.getStockLastUpdate(screen.unitId);
        bannerVal.textContent = `🗓️ ${lastUp}`;
      }
      renderStockList();
    }
  } else if (screen.type === 'stock-analytics') {
    if (typeof renderStockBars === 'function') {
      renderStockBars(screen.filterCat || 'todas');
    }
  } else if (screen.type === 'activities') {
    if (typeof renderAtividadesList === 'function') {
      renderAtividadesList(screen.filterInstId || '');
    }
  } else if (screen.type === 'instituicoes-list') {
    if (typeof renderInstituicoesList === 'function') {
      renderInstituicoesList();
    }
  } else if (screen.type === 'reports-history') {
    if (typeof renderReportsHistory === 'function') {
      renderReportsHistory();
    }
  }
}

// Renderização da Data por extenso em Português
// Data local no fuso horário do usuário (YYYY-MM-DD) sem distorção UTC
function getLocalDateStr(d = new Date()) {
  const dateObj = (d instanceof Date) ? d : new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
if (typeof window !== 'undefined') {
  window.getLocalDateStr = getLocalDateStr;
}

// Renderização da Data por extenso em Português
function renderCurrentDate() {
  const dateEl = document.getElementById('current-date-display');
  if (!dateEl) return;

  const now = new Date();
  const options = { day: 'numeric', month: 'long' };
  const formatted = now.toLocaleDateString('pt-BR', options);
  dateEl.textContent = formatted;
}

// Atualização resiliente das métricas do card de resumo (Painel Diário)
function updateHeroMetrics() {
  const reports = dbManager.getReports();
  const todayStr = getLocalDateStr();

  // 1. CENSO ATIVO DE ACOLHIDOS RESIDENTES (3 Despensas/Unidades)
  // Em comunidades de acolhimento, o censo é residencial contínuo.
  // Para cada unidade, obtém o número de acolhidos do dia de hoje;
  // se ainda não preenchido hoje, herda do último relatório registrado salvo daquela unidade.
  const unitDefaults = { missao: 45, macedonia: 60, feminina: 30 };
  const unitIds = ['missao', 'macedonia', 'feminina'];

  let acolhidos = 0;
  unitIds.forEach(uId => {
    // 1º: Se já existe relatório salvo hoje para a unidade, usa o valor exato registrado pelo usuário (inclusive 0)
    const repToday = reports.find(r => r.unitId === uId && r.date === todayStr);
    if (repToday && typeof repToday.acolhidosPresentes === 'number') {
      acolhidos += repToday.acolhidosPresentes;
      return;
    }
    // 2º: Se ainda não há relatório salvo hoje, busca o relatório mais recente cadastrado para a unidade
    const unitReports = reports
      .filter(r => r.unitId === uId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.updatedAt || 0) - (a.updatedAt || 0));
    
    const latestRep = unitReports[0];
    if (latestRep && typeof latestRep.acolhidosPresentes === 'number') {
      acolhidos += latestRep.acolhidosPresentes;
    } else {
      acolhidos += unitDefaults[uId] || 0;
    }
  });

  // 2. REFEIÇÕES E TRIAGENS DO DIA
  const todayReports = reports.filter(r => r.date === todayStr);

  let refeicoes = 0;
  let triagens = 0;

  if (todayReports.length > 0) {
    todayReports.forEach(r => {
      triagens += (r.novasTriagens || 0);
      const ref = r.refeicoes || {};
      refeicoes += (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0);
    });
  } else {
    // Caso hoje ainda não haja fechamento salvo, consolida do dia mais recente com registros
    const sortedDates = [...new Set(reports.map(r => r.date).filter(Boolean))].sort().reverse();
    const mostRecentDate = sortedDates[0];
    if (mostRecentDate) {
      const recentReports = reports.filter(r => r.date === mostRecentDate);
      recentReports.forEach(r => {
        triagens += (r.novasTriagens || 0);
        const ref = r.refeicoes || {};
        refeicoes += (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0);
      });
    }
  }

  state.totalAcolhidosHoje = acolhidos;
  state.totalRefeicoesHoje = refeicoes;
  state.novasTriagensHoje = triagens;

  const elAcolhidos = document.getElementById('metric-hero-acolhidos');
  const elRefeicoes = document.getElementById('metric-hero-refeicoes');
  const elTriagens = document.getElementById('metric-hero-triagens');
  const elRelatoriosCount = document.getElementById('metric-hero-reports-count');

  if (elAcolhidos) elAcolhidos.textContent = acolhidos;
  if (elRefeicoes) elRefeicoes.textContent = refeicoes;
  if (elTriagens) elTriagens.textContent = triagens;
  if (elRelatoriosCount) elRelatoriosCount.textContent = `${todayReports.length}/3`;
}

// Efeito 3D Tátil, Iluminação Dinâmica e Micro-Animações no Mouse e Dedo
function setup3DButtonsInteractions() {
  const buttons = document.querySelectorAll('.btn-card-3d');

  buttons.forEach(btn => {
    // Interação com Mouse (Glide & Specular Spotlight)
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--touch-x', `${x}px`);
      btn.style.setProperty('--touch-y', `${y}px`);
      btn.classList.add('hovered');
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('hovered');
    });

    // Interação com Toque na Tela do Celular (Finger Drag & Glide)
    btn.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = btn.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      btn.style.setProperty('--touch-x', `${x}px`);
      btn.style.setProperty('--touch-y', `${y}px`);
      btn.classList.add('pressed');
      if (navigator.vibrate) navigator.vibrate(10);
    }, { passive: true });

    btn.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = btn.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      btn.style.setProperty('--touch-x', `${x}px`);
      btn.style.setProperty('--touch-y', `${y}px`);
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      btn.classList.remove('pressed');
    });

    btn.addEventListener('touchcancel', () => {
      btn.classList.remove('pressed');
    });
  });
}

// Retorno à Página Inicial ao Clicar na Logo
function goToHome() {
  closeModal('modal-generic');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Indicador Visual de Conexão: Simples Bolinha no Lado Direito
function updateCloudStatusUI(status, label) {
  const dot = document.getElementById('status-dot-simple');
  if (dot) {
    dot.className = `status-dot-simple ${status}`;
    dot.title = `Conexão: ${label}`;
  }
}

// Modal Helpers com Bloqueio de Scroll
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (modalId === 'modal-generic') {
    window._currentScreen = null;
    const header = document.getElementById('modal-generic-header');
    if (header) header.className = 'modal-header';
    const footer = document.getElementById('modal-generic-footer');
    if (footer) footer.innerHTML = '';
  }
}

// Fechamento ao clicar fora da folha do modal
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
    window._currentScreen = null;
    const header = document.getElementById('modal-generic-header');
    if (header) header.className = 'modal-header';
    const footer = document.getElementById('modal-generic-footer');
    if (footer) footer.innerHTML = '';
  }
});

// Loading Overlay
function showLoading(msg = 'Carregando...') {
  const overlay = document.getElementById('global-loading');
  const text = document.getElementById('loading-text');
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.add('active');
}

function hideLoading() {
  const overlay = document.getElementById('global-loading');
  if (overlay) overlay.classList.remove('active');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Configurações e Conexão Firebase Clean
function openSettingsModal() {
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const cfg = dbManager.getFirebaseConfig() || {};

  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </div>
      <div>
        <h2>Configurações</h2>
        <p>Sincronização Nuvem e Backup</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div class="form-section-title">
        Conexão Firebase Realtime
      </div>
      <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.4;">
        O app opera 100% offline-first no dispositivo. Para sincronizar em tempo real com toda a equipe, conecte o Firebase.
      </p>

      <div class="form-group">
        <label class="form-label">Database URL</label>
        <input type="url" id="cfg-db-url" class="form-input" placeholder="https://seu-projeto-default-rtdb.firebaseio.com" value="${cfg.databaseURL || ''}">
      </div>

      <div class="form-group">
        <label class="form-label">API Key</label>
        <input type="text" id="cfg-api-key" class="form-input" placeholder="AIzaSy..." value="${cfg.apiKey || ''}">
      </div>

      <div class="form-group">
        <label class="form-label">Project ID</label>
        <input type="text" id="cfg-proj-id" class="form-input" placeholder="cristolandia-check" value="${cfg.projectId || ''}">
      </div>

      <button type="button" class="btn-primary-action" style="padding:11px 14px; font-size:0.82rem;" onclick="handleSaveFirebaseConfig()">
        Conectar Firebase
      </button>

      <div class="form-section-title" style="margin-top:8px;">
        Backup e Dados
      </div>

      <div style="display:flex; gap:8px;">
        <button type="button" class="btn-secondary-action" style="flex:1; font-size:0.78rem;" onclick="handleExportBackup()">
          Exportar JSON
        </button>
        <button type="button" class="btn-secondary-action" style="flex:1; font-size:0.78rem; color:#A34A4A;" onclick="handleResetData()">
          Restaurar Padrão
        </button>
      </div>
    </div>
  `;

  modalFooter.innerHTML = '';

  openModal('modal-generic');
}

function handleSaveFirebaseConfig() {
  const url = document.getElementById('cfg-db-url')?.value.trim();
  const apiKey = document.getElementById('cfg-api-key')?.value.trim();
  const projectId = document.getElementById('cfg-proj-id')?.value.trim();

  if (!url || !apiKey) {
    showToast('Preencha a Database URL e a API Key!', 'warning');
    return;
  }

  dbManager.setFirebaseConfig({
    databaseURL: url,
    apiKey: apiKey,
    projectId: projectId || 'cristolandia-app'
  });
}

function handleExportBackup() {
  const data = {
    reports: dbManager.getReports(),
    stock: dbManager.getStock(),
    churches: dbManager.getChurches(),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cristolandia_check_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exportado com sucesso!', 'success');
}

function handleResetData() {
  if (confirm('Tem certeza que deseja restaurar os dados demonstrativos de fábrica?')) {
    dbManager.resetAllData();
    updateHeroMetrics();
    closeModal('modal-generic');
    showToast('Dados restaurados com sucesso!', 'success');
  }
}

// Inactivity Watcher (30 min conforme Pilar 6.2 do Guia CUIDAR)
function setupInactivityWatcher() {
  const resetTimer = () => {
    state.lastActiveTimestamp = Date.now();
  };

  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetTimer, { passive: true });
  });

  setInterval(() => {
    const elapsed = Date.now() - state.lastActiveTimestamp;
    // 30 minutos = 1800000ms
    if (elapsed > 1800000) {
      console.log('[Inatividade] 30 minutos sem ação');
    }
  }, 60000);
}
