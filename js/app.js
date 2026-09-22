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

  // Atualizar bolinhas de progresso neon dos botões de unidades (Missão, Macedônia e Feminina)
  updateMissaoDots();
  updateMacedoniaDots();
  updateFemininaDots();

  // Renderizar Avisos do dia! (balão dourado 50%, letras verdes) e ativar navegação touch
  renderDailyNotices();
  setupNoticesTouchSwipe();

  // Ativar efeitos 3D táteis e micro-animações nos 6 botões
  setup3DButtonsInteractions();

  // Monitoramento de inatividade (30 minutos)
  setupInactivityWatcher();

  // Monitor de virada de dia (reseta bolinhas e métricas do dia automaticamente)
  setupDayTransitionWatcher();

  // Ouvinte de sincronização remota em tempo real (Motor CUIDAR Pilar 1)
  window.addEventListener('db:cloud-synced', (e) => {
    updateHeroMetrics();
    updateMissaoDots();
    updateMacedoniaDots();
    updateFemininaDots();
    renderDailyNotices();
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
  } else if (screen.type === 'missao-calendar') {
    if (typeof openMissaoCalendar === 'function') {
      openMissaoCalendar(typeof _missaoCalYear === 'number' ? _missaoCalYear : null, typeof _missaoCalMonth === 'number' ? _missaoCalMonth : null);
    }
  } else if (screen.type === 'missao-view') {
    if (typeof viewMissaoDayReport === 'function' && screen.dateStr) {
      viewMissaoDayReport(screen.dateStr);
    }
  }
}

// Atualiza o estado das 7 bolinhas de progresso neon no topo do botão Missão
function updateMissaoDots() {
  const container = document.getElementById('missao-dots-container');
  if (!container) return;

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const reports = (typeof dbManager !== 'undefined' && dbManager.getReports) ? dbManager.getReports() : [];
  const missaoReport = reports.find(r => r.unitId === 'missao' && r.date === todayStr);

  const dots = container.querySelectorAll('.btn-dot');
  if (!dots || dots.length < 7) return;

  if (!missaoReport) {
    dots.forEach(d => d.classList.remove('active'));
    return;
  }

  const ans = missaoReport.answeredQuestions || {};
  const hasAnsFlags = !!missaoReport.answeredQuestions;

  // 1. Pessoas atendidas
  const pTotal = missaoReport.pessoasAtendidas?.total ?? missaoReport.acolhidosPresentes ?? 0;
  const pActive = hasAnsFlags ? !!ans.pessoas : (pTotal > 0);
  if (pActive) dots[0].classList.add('active'); else dots[0].classList.remove('active');

  // 2. Refeições
  const ref = missaoReport.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0);
  const rActive = hasAnsFlags ? !!ans.refeicoes : (totalRef > 0);
  if (rActive) dots[1].classList.add('active'); else dots[1].classList.remove('active');

  // 3. Banhos
  const banhosActive = hasAnsFlags ? !!ans.banhos : ((missaoReport.banhos || 0) > 0);
  if (banhosActive) dots[2].classList.add('active'); else dots[2].classList.remove('active');

  // 4. Corte de cabelo
  const cortesActive = hasAnsFlags ? !!ans.cortes : ((missaoReport.cortesCabelo || 0) > 0);
  if (cortesActive) dots[3].classList.add('active'); else dots[3].classList.remove('active');

  // 5. Cultos
  const cultosActive = hasAnsFlags ? !!ans.cultos : ((missaoReport.cultos || 0) > 0);
  if (cultosActive) dots[4].classList.add('active'); else dots[4].classList.remove('active');

  // 6. Pessoas na busca ativa
  const buscaActive = hasAnsFlags ? !!ans.buscaAtiva : (((missaoReport.buscaAtivaPessoas || 0) > 0) || ((missaoReport.pessoasAtendidas?.buscaAtiva || 0) > 0));
  if (buscaActive) dots[5].classList.add('active'); else dots[5].classList.remove('active');

  // 7. Decisões por Cristo
  const decisoesActive = hasAnsFlags ? !!ans.decisoes : ((missaoReport.decisoesCristo || 0) > 0);
  if (decisoesActive) dots[6].classList.add('active'); else dots[6].classList.remove('active');
}
if (typeof window !== 'undefined') {
  window.updateMissaoDots = updateMissaoDots;
}

// Atualiza o estado das 12 bolinhas de progresso neon para Macedônia ou Feminina
function updateStandardUnitDots(unitId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const reports = (typeof dbManager !== 'undefined' && dbManager.getReports) ? dbManager.getReports() : [];
  const rep = reports.find(r => r.unitId === unitId && r.date === todayStr);

  const dots = container.querySelectorAll('.btn-dot');
  if (!dots || dots.length < 12) return;

  if (!rep) {
    dots.forEach(d => d.classList.remove('active'));
    return;
  }

  const ans = rep.answeredQuestions || {};
  const hasAnsFlags = !!rep.answeredQuestions;

  // 1. Refeições (5 subcampos)
  const ref = rep.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);
  const rActive = hasAnsFlags ? !!ans.refeicoes : (totalRef > 0);
  if (rActive) dots[0].classList.add('active'); else dots[0].classList.remove('active');

  // 2. Encaminhamentos Sociais
  const sociaisActive = hasAnsFlags ? !!ans.sociais : ((rep.encaminhamentosSociais || 0) > 0 || (rep.novasTriagens || 0) > 0);
  if (sociaisActive) dots[1].classList.add('active'); else dots[1].classList.remove('active');

  // 3. Encaminhamentos de Saúde
  const saudeActive = hasAnsFlags ? !!ans.saude : ((rep.encaminhamentosSaude || 0) > 0);
  if (saudeActive) dots[2].classList.add('active'); else dots[2].classList.remove('active');

  // 4. Atendimentos Psicológicos
  const psicoActive = hasAnsFlags ? !!ans.psicologicos : ((rep.atendimentosPsicologicos || 0) > 0);
  if (psicoActive) dots[3].classList.add('active'); else dots[3].classList.remove('active');

  // 5. Demandas Jurídicas
  const juridicoActive = hasAnsFlags ? !!ans.juridicas : ((rep.demandasJuridicas || 0) > 0);
  if (juridicoActive) dots[4].classList.add('active'); else dots[4].classList.remove('active');

  // 6. Estudos Bíblicos
  const estudosActive = hasAnsFlags ? !!ans.estudosBiblicos : ((rep.estudosBiblicos || 0) > 0);
  if (estudosActive) dots[5].classList.add('active'); else dots[5].classList.remove('active');

  // 7. Cultos e Vigílias
  const cultosActive = hasAnsFlags ? !!ans.cultosVigilias : (((rep.cultosVigilias || 0) > 0) || ((rep.cultos || 0) > 0));
  if (cultosActive) dots[6].classList.add('active'); else dots[6].classList.remove('active');

  // 8. Sons da Missão (Oficinas de instrumentos musicais)
  const musicaActive = hasAnsFlags ? !!ans.sonsDaMissao : ((rep.sonsDaMissao || 0) > 0);
  if (musicaActive) dots[7].classList.add('active'); else dots[7].classList.remove('active');

  // 9. Ensaios do Coro
  const coroActive = hasAnsFlags ? !!ans.ensaiosCoro : ((rep.ensaiosCoro || 0) > 0);
  if (coroActive) dots[8].classList.add('active'); else dots[8].classList.remove('active');

  // 10. Atividades Físicas / Esportes realizadas
  const esporteActive = hasAnsFlags ? !!ans.atividadesFisicas : ((rep.atividadesFisicas || 0) > 0);
  if (esporteActive) dots[9].classList.add('active'); else dots[9].classList.remove('active');

  // 11. Acolhidos que participaram das atividades físicas/esportes
  const acolhidosEsporteActive = hasAnsFlags ? !!ans.participantesAtividadesFisicas : ((rep.participantesAtividadesFisicas || 0) > 0);
  if (acolhidosEsporteActive) dots[10].classList.add('active'); else dots[10].classList.remove('active');

  // 12. Decisões por Cristo
  const decisoesActive = hasAnsFlags ? !!ans.decisoes : ((rep.decisoesCristo || 0) > 0);
  if (decisoesActive) dots[11].classList.add('active'); else dots[11].classList.remove('active');
}

// Atualiza o estado das 12 bolinhas de progresso neon no topo do botão Macedônia
function updateMacedoniaDots() {
  updateStandardUnitDots('macedonia', 'macedonia-dots-container');
}
if (typeof window !== 'undefined') {
  window.updateMacedoniaDots = updateMacedoniaDots;
}

// Atualiza o estado das 12 bolinhas de progresso neon no topo do botão Unidade Feminina
function updateFemininaDots() {
  updateStandardUnitDots('feminina', 'feminina-dots-container');
}
if (typeof window !== 'undefined') {
  window.updateFemininaDots = updateFemininaDots;
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
// 1. Pessoas assistidas (soma de banhos, cortes, busca ativa, encaminhamentos sociais, saúde, psicologia, jurídico e sons da missão)
// 2. Refeições (soma de todas as refeições das 3 unidades no dia)
// 3. Triagens (soma das triagens das 3 unidades)
function updateHeroMetrics() {
  const reports = dbManager.getReports();
  const todayStr = getLocalDateStr();
  const todayReports = reports.filter(r => r.date === todayStr);

  let pessoasAssistidas = 0;
  let refeicoes = 0;
  let triagens = 0;

  // Se houver relatórios hoje, soma deles; se ainda não houver nenhum hoje,
  // consolida do dia mais recente com fechamento salvo
  const targetReports = todayReports.length > 0 
    ? todayReports 
    : (() => {
        const sortedDates = [...new Set(reports.map(r => r.date).filter(Boolean))].sort().reverse();
        return sortedDates[0] ? reports.filter(r => r.date === sortedDates[0]) : [];
      })();

  targetReports.forEach(r => {
    // Pessoas assistidas
    const banhos = r.banhos || 0;
    const cortes = r.cortesCabelo || 0;
    const buscaAtiva = r.buscaAtivaPessoas || (r.pessoasAtendidas && r.pessoasAtendidas.buscaAtiva) || 0;
    const sociais = r.encaminhamentosSociais || 0;
    const saude = r.encaminhamentosSaude || 0;
    const psicologicos = r.atendimentosPsicologicos || 0;
    const juridicas = r.demandasJuridicas || 0;
    const musica = r.sonsDaMissao || 0;

    pessoasAssistidas += (banhos + cortes + buscaAtiva + sociais + saude + psicologicos + juridicas + musica);

    // Refeições (soma de todas as refeições de todas as unidades)
    const ref = r.refeicoes || {};
    refeicoes += (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);

    // Triagens (soma das triagens)
    triagens += (r.novasTriagens || 0);
  });

  state.totalPessoasAssistidasHoje = pessoasAssistidas;
  state.totalRefeicoesHoje = refeicoes;
  state.novasTriagensHoje = triagens;

  const elAssistidos = document.getElementById('metric-hero-acolhidos');
  const elRefeicoes = document.getElementById('metric-hero-refeicoes');
  const elTriagens = document.getElementById('metric-hero-triagens');
  const elRelatoriosCount = document.getElementById('metric-hero-reports-count');

  if (elAssistidos) elAssistidos.textContent = pessoasAssistidas;
  if (elRefeicoes) elRefeicoes.textContent = refeicoes;
  if (elTriagens) elTriagens.textContent = triagens;
  if (elRelatoriosCount) elRelatoriosCount.textContent = `${todayReports.length}/3`;

  // Mantém as bolinhas neon dos botões Missão, Macedônia e Feminina sincronizadas
  if (typeof updateMissaoDots === 'function') {
    updateMissaoDots();
  }
  if (typeof updateMacedoniaDots === 'function') {
    updateMacedoniaDots();
  }
  if (typeof updateFemininaDots === 'function') {
    updateFemininaDots();
  }
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

// Monitor de Virada de Dia (Garante que as bolinhas e o painel correspondam estritamente ao dia atual)
let _currentTrackedDay = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

function checkDayTransition() {
  const newDay = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  if (newDay !== _currentTrackedDay) {
    console.log(`[Virada de Dia Detectada] Transição de ${_currentTrackedDay} para ${newDay}`);
    _currentTrackedDay = newDay;
    if (typeof renderCurrentDate === 'function') renderCurrentDate();
    if (typeof updateHeroMetrics === 'function') updateHeroMetrics();
    if (typeof updateMissaoDots === 'function') updateMissaoDots();
    if (typeof updateMacedoniaDots === 'function') updateMacedoniaDots();
    if (typeof updateFemininaDots === 'function') updateFemininaDots();
    if (typeof renderDailyNotices === 'function') renderDailyNotices();
  }
}

function setupDayTransitionWatcher() {
  // Checagem periódica a cada 30 segundos
  setInterval(checkDayTransition, 30000);
  // Checagem imediata quando o usuário retorna à aba ou desbloqueia o PWA
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkDayTransition();
    });
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', checkDayTransition);
  }
}

// ==========================================================================
// SEÇÃO AVISOS DO DIA (BALÃO DOURADO 50%, LETRAS VERDES, 24H, BOLINHAS NEON)
// ==========================================================================
let _currentNoticeIndex = 0;

function formatNoticeTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (isToday) {
    return `Hoje às ${hours}:${minutes}`;
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month} às ${hours}:${minutes}`;
}

function renderDailyNotices() {
  const container = document.getElementById('notice-balloon-content');
  const dotsContainer = document.getElementById('notice-dots-container');
  const prevBtn = document.getElementById('notice-nav-prev');
  const nextBtn = document.getElementById('notice-nav-next');
  if (!container || !dotsContainer) return;

  const notices = (typeof dbManager !== 'undefined' && dbManager.getNotices) 
    ? dbManager.getNotices(true) 
    : [];

  // Se não houver avisos nas últimas 24h
  if (notices.length === 0) {
    _currentNoticeIndex = 0;
    container.innerHTML = `
      <div class="notice-empty-state">
        <div class="notice-empty-title">Nenhum aviso no momento</div>
        <div class="notice-empty-sub">Toque no botão <strong style="color:var(--green-primary); font-size:1rem;">+</strong> acima para registrar um aviso para as unidades.</div>
      </div>
    `;
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    dotsContainer.innerHTML = '';
    return;
  }

  // Ajusta índice aos limites
  if (_currentNoticeIndex >= notices.length) {
    _currentNoticeIndex = notices.length - 1;
  }
  if (_currentNoticeIndex < 0) {
    _currentNoticeIndex = 0;
  }

  const activeNotice = notices[_currentNoticeIndex];

  // Renderiza o balão dourado com 50% de opacidade e letras verdes
  const safeText = (typeof escapeHtml === 'function') ? escapeHtml(activeNotice.text || '') : (activeNotice.text || '');
  const safeAuthor = (typeof escapeHtml === 'function') ? escapeHtml(activeNotice.author || 'Coordenação') : (activeNotice.author || 'Coordenação');

  container.innerHTML = `
    <div class="notice-balloon-text">${safeText}</div>
    <div class="notice-balloon-meta">
      <span class="notice-meta-author">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        ${safeAuthor}
      </span>
      <span class="notice-meta-time">
        ${formatNoticeTime(activeNotice.createdAt)}
      </span>
    </div>
  `;

  // Configuração das setas de navegação
  if (notices.length > 1) {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // Fileira com bolinhas douradas e indicador neon da mensagem ativa
  let dotsHtml = '';
  for (let i = 0; i < notices.length; i++) {
    const isActive = (i === _currentNoticeIndex);
    dotsHtml += `<div class="notice-dot ${isActive ? 'active' : ''}" onclick="goToNotice(${i})" title="Aviso ${i + 1} de ${notices.length}"></div>`;
  }
  dotsContainer.innerHTML = dotsHtml;
}

function navNotice(delta) {
  const notices = (typeof dbManager !== 'undefined' && dbManager.getNotices) ? dbManager.getNotices(true) : [];
  if (notices.length <= 1) return;

  const balloon = document.getElementById('notice-balloon-content');
  if (balloon) balloon.classList.add('animating');

  _currentNoticeIndex = (_currentNoticeIndex + delta + notices.length) % notices.length;

  setTimeout(() => {
    renderDailyNotices();
    if (balloon) balloon.classList.remove('animating');
  }, 120);
}

function goToNotice(index) {
  _currentNoticeIndex = index;
  renderDailyNotices();
}

// Suporte a swipe touch (deslizar para o lado em telas sensíveis ao toque)
function setupNoticesTouchSwipe() {
  const wrapper = document.getElementById('notice-balloon-wrapper');
  if (!wrapper) return;

  let startX = 0;
  let startY = 0;

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        navNotice(1); // Deslizou para esquerda -> próximo
      } else {
        navNotice(-1); // Deslizou para direita -> anterior
      }
    }
  }, { passive: true });
}

// Modal para adicionar novo aviso
function openAddNoticeModal() {
  const modal = document.getElementById('modal-generic');
  const header = document.getElementById('modal-generic-header');
  const body = document.getElementById('modal-generic-body');
  const footer = document.getElementById('modal-generic-footer');
  if (!modal || !header || !body || !footer) return;

  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon" style="background:rgba(197, 137, 8, 0.15); color:var(--gold-primary);">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <div>
        <h2>Novo Aviso do Dia</h2>
        <p style="margin-bottom:0;">Mensagem visível por 24 horas</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  body.innerHTML = `
    <form id="notice-form" onsubmit="event.preventDefault(); handleSaveNotice();">
      <div style="margin-bottom:14px;">
        <label style="display:block; font-family:var(--font-gothic); font-weight:800; font-size:0.86rem; color:var(--text-main); margin-bottom:6px;">
          Seu Nome ou Função
        </label>
        <input type="text" id="notice-input-author" class="form-input" placeholder="Ex: Missionário Carlos, Pr. Marcos, Coordenação..." required style="width:100%;">
      </div>

      <div style="margin-bottom:12px;">
        <label style="display:block; font-family:var(--font-gothic); font-weight:800; font-size:0.86rem; color:var(--text-main); margin-bottom:6px;">
          Mensagem do Aviso
        </label>
        <textarea id="notice-input-text" class="form-input" rows="4" placeholder="Escreva o aviso importante do dia aqui..." required style="width:100%; resize:vertical; line-height:1.45;"></textarea>
      </div>
    </form>
  `;

  footer.className = 'modal-footer';
  footer.innerHTML = `
    <button type="button" class="btn-secondary-action" style="flex:1;" onclick="closeModal('modal-generic')">Cancelar</button>
    <button type="button" id="btn-save-notice-action" class="btn-primary-action" style="flex:1;" onclick="handleSaveNotice()">Salvar Aviso</button>
  `;

  openModal('modal-generic');
  setTimeout(() => {
    const input = document.getElementById('notice-input-author');
    if (input) input.focus();
  }, 200);
}

async function handleSaveNotice() {
  const authorInput = document.getElementById('notice-input-author');
  const textInput = document.getElementById('notice-input-text');
  const btn = document.getElementById('btn-save-notice-action');

  const author = (authorInput?.value || '').trim();
  const text = (textInput?.value || '').trim();

  if (!author) {
    showToast('Por favor, informe seu nome ou cargo.', 'warning');
    if (authorInput) authorInput.focus();
    return;
  }
  if (!text) {
    showToast('Por favor, escreva a mensagem do aviso.', 'warning');
    if (textInput) textInput.focus();
    return;
  }

  if (btn) btn.disabled = true;
  showLoading('Publicando aviso...');

  try {
    await dbManager.saveNotice({ author, text });
    closeModal('modal-generic');
    _currentNoticeIndex = 0; // Exibe o recém criado
    renderDailyNotices();
    showToast('Aviso do dia publicado com sucesso!', 'success');
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  } catch (err) {
    showToast('Erro ao publicar aviso: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}

if (typeof window !== 'undefined') {
  window.renderDailyNotices = renderDailyNotices;
  window.navNotice = navNotice;
  window.goToNotice = goToNotice;
  window.openAddNoticeModal = openAddNoticeModal;
  window.handleSaveNotice = handleSaveNotice;
}

