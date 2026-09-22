/* ==========================================================================
   CRISTOLÂNDIA CHECK - MÓDULOS DE NEGÓCIO E TELAS CLEAN
   Paleta: Dourado, Bege e Verde. Tipografia Century Gothic.
   Ícones de linha simples com alto contraste.
   ========================================================================== */

// Mapeamento das Unidades com Ícones de Linha Vetoriais
const UNIT_PROFILES = {
  missao: {
    id: 'missao',
    name: 'Missão',
    fullName: 'Unidade Missão • Atendimento & Triagem',
    badgeClass: 'badge-missao',
    iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10L12 3L21 10"/><path d="M5 10V20H19V10"/><path d="M9 20V14H15V20"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    defaultReporter: 'Pr. Marcos Lima'
  },
  macedonia: {
    id: 'macedonia',
    name: 'Macedônia',
    fullName: 'Unidade Macedônia • Internação & Vida',
    badgeClass: 'badge-macedonia',
    iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6C3 11 7 15 12 15C17 15 21 11 21 6C17 4 12 7 12 12Z"/><path d="M12 17C15 17 18 19 19 22"/></svg>`,
    defaultReporter: 'Missionário Carlos'
  },
  feminina: {
    id: 'feminina',
    name: 'Feminina',
    fullName: 'Unidade Feminina • Mulheres & Filhos',
    badgeClass: 'badge-feminina',
    iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11.5C14 11.5 15.8 9.8 15.8 7.5C15.8 5.2 14 3.5 12 3.5C10 3.5 8.2 5.2 8.2 7.5C8.2 9.8 10 11.5 12 11.5Z"/><path d="M8.5 7.5C8.5 4.8 10 4 12 4C14.2 4 15.5 5.2 15.5 7.5"/><path d="M15.5 7.5C16.8 9.5 16.5 12.5 15.5 14"/><path d="M8.5 7.5C7.2 9.5 7.5 12.5 8.5 14"/><path d="M5.5 21C5.5 17.5 8.4 15 12 15C15.6 15 18.5 17.5 18.5 21"/></svg>`,
    defaultReporter: 'Missionária Sarah'
  }
};

// --- MÓDULOS DE UNIDADE (MISSÃO, MACEDÔNIA, FEMININA) ---
function openUnitReportModal(unitId) {
  const unit = UNIT_PROFILES[unitId];
  if (!unit) return;

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const reports = dbManager.getReports();
  const existing = reports.find(r => r.unitId === unitId && r.date === todayStr);

  // Busca o último relatório salvo da unidade para herdar o censo de residentes
  const unitReports = reports
    .filter(r => r.unitId === unitId)
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.updatedAt || 0) - (a.updatedAt || 0));
  const lastReport = unitReports[0];

  const defaultAcolhidos = (unitId === 'missao' ? 45 : unitId === 'macedonia' ? 60 : 30);
  const acolhidos = existing ? existing.acolhidosPresentes : (lastReport && lastReport.acolhidosPresentes > 0 ? lastReport.acolhidosPresentes : defaultAcolhidos);
  const triagens = existing ? existing.novasTriagens : 0;
  const desligamentos = existing ? existing.desligamentos : 0;
  const cafe = existing ? (existing.refeicoes?.cafe ?? acolhidos) : acolhidos;
  const almoco = existing ? (existing.refeicoes?.almoco ?? (acolhidos + 2)) : (acolhidos + 2);
  const lanche = existing ? (existing.refeicoes?.lanche ?? acolhidos) : acolhidos;
  const jantar = existing ? (existing.refeicoes?.jantar ?? acolhidos) : acolhidos;
  const atividades = existing ? existing.atividades : '';
  const saude = existing ? existing.saude : '';
  const necessidades = existing ? existing.necessidades : '';
  const reporter = existing ? existing.reporterName : (lastReport ? lastReport.reporterName : unit.defaultReporter);

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const statusBadge = existing
    ? `<span style="display:inline-block; margin-top:3px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Registrado hoje (${formatDateBR(existing.date)})</span>`
    : `<span style="display:inline-block; margin-top:3px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#FFF8E1; color:#C58908;">📝 Novo relatório do dia</span>`;

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        ${unit.iconSvg}
      </div>
      <div>
        <h2>Relatório ${unit.name}</h2>
        <p style="margin-bottom:2px;">${unit.fullName}</p>
        ${statusBadge}
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="unit-report-form" onsubmit="event.preventDefault();">
      <input type="hidden" id="rep-unit-id" value="${unit.id}">
      <input type="hidden" id="rep-id" value="${existing ? existing.id : 'rep_' + Date.now()}">

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Data do Relatório</label>
          <input type="date" id="rep-date" class="form-input" value="${existing ? existing.date : todayStr}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Responsável / Plantonista</label>
          <input type="text" id="rep-reporter" class="form-input" value="${reporter}" placeholder="Nome do plantonista" required>
        </div>
      </div>

      <div class="form-section-title">
        Censo de Acolhidos
      </div>

      <div class="stepper-card">
        <div class="stepper-info">
          <h4>Acolhidos Presentes</h4>
          <span>Total residente no dia</span>
        </div>
        <div class="stepper-controls">
          <button type="button" class="btn-step" onclick="adjustInputStep('rep-acolhidos', -1)">-</button>
          <input type="number" id="rep-acolhidos" class="step-value form-input" style="width:65px; text-align:center; padding:4px;" value="${acolhidos}">
          <button type="button" class="btn-step" onclick="adjustInputStep('rep-acolhidos', 1)">+</button>
        </div>
      </div>

      <div class="form-row">
        <div class="stepper-card" style="padding:10px 12px;">
          <div class="stepper-info">
            <h4 style="font-size:0.8rem;">Entradas</h4>
            <span style="font-size:0.66rem;">Triagens</span>
          </div>
          <div class="stepper-controls">
            <button type="button" class="btn-step" style="width:30px;height:30px;" onclick="adjustInputStep('rep-triagens', -1)">-</button>
            <input type="number" id="rep-triagens" class="step-value form-input" style="width:42px; text-align:center; padding:2px;" value="${triagens}">
            <button type="button" class="btn-step" style="width:30px;height:30px;" onclick="adjustInputStep('rep-triagens', 1)">+</button>
          </div>
        </div>

        <div class="stepper-card" style="padding:10px 12px;">
          <div class="stepper-info">
            <h4 style="font-size:0.8rem;">Saídas</h4>
            <span style="font-size:0.66rem;">Desligamentos</span>
          </div>
          <div class="stepper-controls">
            <button type="button" class="btn-step" style="width:30px;height:30px;" onclick="adjustInputStep('rep-desligamentos', -1)">-</button>
            <input type="number" id="rep-desligamentos" class="step-value form-input" style="width:42px; text-align:center; padding:2px;" value="${desligamentos}">
            <button type="button" class="btn-step" style="width:30px;height:30px;" onclick="adjustInputStep('rep-desligamentos', 1)">+</button>
          </div>
        </div>
      </div>

      <div class="form-section-title" style="display:flex; justify-content:space-between; align-items:center;">
        <div>Refeições Servidas</div>
        <button type="button" onclick="autoFillMeals()" style="font-family:var(--font-gothic); font-size:0.7rem; padding:4px 8px; border-radius:6px; border:1px solid var(--border-beige); background:var(--bg-surface); color:var(--green-primary); font-weight:700; cursor:pointer;">
          Igualar aos Acolhidos
        </button>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="form-group">
          <label class="form-label" style="font-size:0.75rem;">Café da Manhã</label>
          <input type="number" id="rep-meal-cafe" class="form-input" value="${cafe}">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:0.75rem;">Almoço</label>
          <input type="number" id="rep-meal-almoco" class="form-input" value="${almoco}">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:0.75rem;">Café da Tarde</label>
          <input type="number" id="rep-meal-lanche" class="form-input" value="${lanche}">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:0.75rem;">Jantar</label>
          <input type="number" id="rep-meal-jantar" class="form-input" value="${jantar}">
        </div>
      </div>

      <div class="form-section-title">
        Atividades & Ocorrências
      </div>

      <div class="form-group">
        <label class="form-label">Cultos, Oficinas e Devocionais</label>
        <textarea id="rep-atividades" class="form-textarea" rows="2" placeholder="Ex: Culto devocional pela manhã, oficina e alfabetização...">${atividades}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Saúde, Enfermagem e Consultas</label>
        <textarea id="rep-saude" class="form-textarea" rows="2" placeholder="Ex: Acolhidos atendidos pela UBS, medicação ministrada...">${saude}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Necessidades Imediatas de Insumos</label>
        <textarea id="rep-necessidades" class="form-textarea" rows="2" placeholder="Ex: Sabonetes e pastas de dente em falta...">${necessidades}</textarea>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button type="button" id="btn-save-unit-report" class="btn-primary-action" style="width:100%;" onclick="handleSaveUnitReport()">
      Salvar Relatório
    </button>
  `;

  openModal('modal-generic');
}

function adjustInputStep(inputId, delta) {
  const el = document.getElementById(inputId);
  if (!el) return;
  let val = parseInt(el.value, 10) || 0;
  val = Math.max(0, val + delta);
  el.value = val;
  if (navigator.vibrate) navigator.vibrate(10);
}

function autoFillMeals() {
  const acolhidos = parseInt(document.getElementById('rep-acolhidos').value, 10) || 0;
  document.getElementById('rep-meal-cafe').value = acolhidos;
  document.getElementById('rep-meal-almoco').value = acolhidos + 2;
  document.getElementById('rep-meal-lanche').value = acolhidos;
  document.getElementById('rep-meal-jantar').value = acolhidos;
  showToast('Refeições sincronizadas com acolhidos!', 'info');
}

async function handleSaveUnitReport() {
  const btn = document.getElementById('btn-save-unit-report');
  const unitId = document.getElementById('rep-unit-id').value;
  const unit = UNIT_PROFILES[unitId];

  const reportData = {
    id: document.getElementById('rep-id').value,
    unitId: unitId,
    unitName: unit.name,
    date: document.getElementById('rep-date').value,
    reporterName: document.getElementById('rep-reporter').value.trim() || 'Equipe de Plantão',
    acolhidosPresentes: parseInt(document.getElementById('rep-acolhidos').value, 10) || 0,
    novasTriagens: parseInt(document.getElementById('rep-triagens').value, 10) || 0,
    desligamentos: parseInt(document.getElementById('rep-desligamentos').value, 10) || 0,
    refeicoes: {
      cafe: parseInt(document.getElementById('rep-meal-cafe').value, 10) || 0,
      almoco: parseInt(document.getElementById('rep-meal-almoco').value, 10) || 0,
      lanche: parseInt(document.getElementById('rep-meal-lanche').value, 10) || 0,
      jantar: parseInt(document.getElementById('rep-meal-jantar').value, 10) || 0
    },
    atividades: document.getElementById('rep-atividades').value.trim(),
    saude: document.getElementById('rep-saude').value.trim(),
    necessidades: document.getElementById('rep-necessidades').value.trim(),
    status: 'concluido'
  };

  if (btn) btn.disabled = true;
  showLoading('Sincronizando...');

  try {
    await dbManager.saveReport(reportData);
    closeModal('modal-generic');
    showToast(`Relatório ${unit.name} salvo com sucesso!`, 'success');
    if (navigator.vibrate) navigator.vibrate([15, 40, 15]);
    updateHeroMetrics();
  } catch (err) {
    showToast('Erro ao salvar: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}

// --- MÓDULO 4: ESTOQUE DAS 3 DESPENSAS (SELEÇÃO, ATUALIZAR E ANALISAR) ---
const STOCK_UNITS = [
  {
    id: 'missao',
    name: 'Estoque Missão',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10L12 3L21 10"/><path d="M5 10V20H19V10"/><path d="M9 20V14H15V20"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    subtitle: 'Unidade Masculina Central'
  },
  {
    id: 'macedonia',
    name: 'Estoque Macedônia',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6C3 11 7 15 12 15C17 15 21 11 21 6C17 4 12 7 12 12Z"/><path d="M12 17C15 17 18 19 19 22"/></svg>`,
    subtitle: 'Unidade de Acolhimento Rural'
  },
  {
    id: 'feminina',
    name: 'Estoque Feminina',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.8 13.5L5.5 14C6 8.5 8 4 12 4C16 4 18 8.5 18.5 14L15.2 13.5"/><path d="M8.2 9.5C9.5 9 11 8.2 12.5 7.5C13.8 8.5 15 9.2 15.8 9.5"/><path d="M8.2 9.5C8.2 12.8 9.8 14.2 12 14.2C14.2 14.2 15.8 12.8 15.8 9.5"/><path d="M8.8 14.5C6.5 15.2 5.5 16.5 5 20H19C18.5 16.5 17.5 15.2 15.2 14.5"/><path d="M10.2 14.8C10.5 16.8 11.2 17.8 12 17.8C12.8 17.8 13.5 16.8 13.8 14.8"/></svg>`,
    subtitle: 'Unidade de Acolhimento Feminino'
  }
];

window.currentStockUnit = window.currentStockUnit || 'missao';
window.currentStockCategory = window.currentStockCategory || 'todas';

function getStockUnitObj(unitId) {
  return STOCK_UNITS.find(u => u.id === (unitId || 'missao')) || STOCK_UNITS[0];
}

const STOCK_CATEGORIES_INFO = [
  { id: 'todas', label: 'Todas', icon: '🏷️' },
  { id: 'alimentos_grossos', label: 'Alimentos Grossos', icon: '🫘' },
  { id: 'proteinas', label: 'Proteínas', icon: '🍖' },
  { id: 'temperos', label: 'Temperos', icon: '🧄' },
  { id: 'lanches', label: 'Lanches', icon: '🍟' },
  { id: 'verduras_legumes', label: 'Verduras e Legumes', icon: '🫑' }
];

// 1. TELA DE SELEÇÃO DA DESPENSA (MISSÃO, MACEDÔNIA, FEMININA)
function openStockModal() {
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8L12 3L3 8L12 13L21 8Z"/>
          <path d="M3 8V16L12 21L21 16V8"/>
          <line x1="12" y1="13" x2="12" y2="21"/>
        </svg>
      </div>
      <div>
        <h2>Despensas de Alimentos</h2>
        <p style="font-size:0.75rem;">Selecione qual estoque deseja acessar</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div class="stock-unit-selector-list">
      ${STOCK_UNITS.map(unit => {
        const count = dbManager.getStock(unit.id).length;
        const lastUpdate = dbManager.getStockLastUpdate(unit.id);
        return `
          <div class="stock-unit-card-choice" onclick="selectStockUnit('${unit.id}')">
            <div class="stock-unit-choice-left">
              <div class="stock-unit-choice-icon" style="color:var(--green-primary);">
                ${unit.icon}
              </div>
              <div class="stock-unit-choice-info">
                <h3>${unit.name}</h3>
                <p>${count} itens cadastrados · Última contagem: <strong>${lastUpdate}</strong></p>
              </div>
            </div>
            <div class="stock-unit-choice-arrow">→</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  modalFooter.innerHTML = '';

  openModal('modal-generic');
}

// 2. TELA DE ESCOLHA DE AÇÃO: ATUALIZAR OU ANALISAR
function selectStockUnit(unitId) {
  window.currentStockUnit = unitId;
  const unit = getStockUnitObj(unitId);
  const lastUpdate = dbManager.getStockLastUpdate(unitId);

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStockModal()" title="Voltar para seleção de unidades" style="width:32px; height:32px; font-size:1rem; margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size: 1.2rem;">${unit.icon}</span>
      </div>
      <div>
        <h2>${unit.name}</h2>
        <p style="font-size:0.75rem;">Última atualização: ${lastUpdate}</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div class="stock-actions-choice-grid">
      <!-- 1. Atualizar Estoque -->
      <div class="stock-action-choice-card" onclick="openStockUpdateView('${unitId}')">
        <div class="stock-action-icon-box update">
          📝
        </div>
        <div class="stock-action-title">Atualizar</div>
        <div class="stock-action-desc">Contar itens, acrescentar ou remover quantidades do estoque</div>
      </div>

      <!-- 2. Analisar Gráficos -->
      <div class="stock-action-choice-card" onclick="openStockAnalyticsView('${unitId}')">
        <div class="stock-action-icon-box analytics">
          📊
        </div>
        <div class="stock-action-title">Analisar</div>
        <div class="stock-action-desc">Ver gráfico em barras com escala adaptativa, histórico e consumo médio</div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = '';
}

// 3. MODO ATUALIZAR: LISTA DE ITENS + SALVAR COM DATA NO TOPO
function openStockUpdateView(unitId) {
  window.currentStockUnit = unitId;
  window._currentScreen = { type: 'stock-update', unitId };
  const unit = getStockUnitObj(unitId);
  const lastUpdate = dbManager.getStockLastUpdate(unitId);

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="selectStockUnit('${unitId}')" title="Voltar" style="width:32px; height:32px; font-size:1rem; margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size: 1.2rem;">${unit.icon}</span>
      </div>
      <div>
        <h2>Atualizar Estoque</h2>
        <p style="font-size:0.75rem;">${unit.name} · <span id="stock-last-update-banner-val">🗓️ ${lastUpdate}</span></p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <!-- Controles Fixos no Topo: Busca, Tags e Ação de Adicionar Item -->
    <div class="stock-sticky-controls">
      <div style="display: flex; gap: 8px;">
        <div style="position: relative; flex: 1;">
          <input type="text" id="stock-search-input" class="form-input" placeholder="🔍 Buscar alimento no estoque..." oninput="handleStockSearchInput(this.value)" style="padding-left: 12px; padding-right: 32px; background:var(--white); height:38px;">
          <button type="button" id="stock-clear-search" onclick="clearStockSearch()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem; color: var(--text-muted); cursor: pointer; display: none; padding: 4px;">&times;</button>
        </div>
        <button type="button" onclick="promptAddNewStockItem('${unitId}')" class="btn-step" title="Cadastrar novo alimento nesta despensa" style="width:38px; height:38px; background:var(--green-light); border-color:var(--green-primary); color:var(--green-primary); font-weight:800; font-size:1.1rem; flex-shrink:0;">＋</button>
      </div>

      <!-- Tags das Categorias Sempre Fixas -->
      <div class="stock-tags-scroll">
        ${STOCK_CATEGORIES_INFO.map(cat => `
          <button type="button" class="chip-filter ${cat.id === (window.currentStockCategory || 'todas') ? 'active' : ''}" data-cat="${cat.id}" onclick="setStockCategoryFilter('${cat.id}', this)">
            <span style="font-size:0.95rem;">${cat.icon}</span>
            <span>${cat.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Lista de Itens do Estoque -->
    <div id="stock-items-container" style="display:flex; flex-direction:column; gap:10px; margin-top:2px;">
      <!-- Itens renderizados aqui -->
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" style="width:100%; background:linear-gradient(135deg, #1E4D2B, #2E6A3B); color:#FFFFFF; font-weight:800; box-shadow: 0 4px 12px rgba(30,77,43,0.3);" onclick="saveStockUpdate('${unitId}', this)">
      💾 Salvar Alterações
    </button>
  `;

  renderStockList();
}

async function saveStockUpdate(unitId, btn) {
  if (btn) btn.disabled = true;
  showLoading('Gravando atualização do estoque...');

  try {
    const newDateStr = await dbManager.setStockLastUpdate(unitId);
    const bannerVal = document.getElementById('stock-last-update-banner-val');
    if (bannerVal) bannerVal.textContent = `🗓️ ${newDateStr}`;
    showToast(`Estoque da Unidade ${getStockUnitObj(unitId).name} salvo com sucesso!`, 'success');
    if (navigator.vibrate) navigator.vibrate([20, 60, 20]);
  } catch (err) {
    showToast('Erro ao salvar estoque: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}

function handleStockSearchInput(val) {
  const clearBtn = document.getElementById('stock-clear-search');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  renderStockList();
}

function clearStockSearch() {
  const searchInput = document.getElementById('stock-search-input');
  const clearBtn = document.getElementById('stock-clear-search');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  renderStockList();
}

function setStockCategoryFilter(cat, btn) {
  window.currentStockCategory = cat;
  document.querySelectorAll('.chip-filter').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderStockList();
}

function renderStockList() {
  const container = document.getElementById('stock-items-container');
  if (!container) return;

  const query = (document.getElementById('stock-search-input')?.value || '').toLowerCase().trim();
  const selectedCat = window.currentStockCategory || 'todas';
  const unitId = window.currentStockUnit || 'missao';

  let items = dbManager.getStock(unitId);

  if (selectedCat !== 'todas') {
    items = items.filter(i => i.category === selectedCat);
  }

  if (query) {
    items = items.filter(i => i.name.toLowerCase().includes(query) || (i.categoryLabel || '').toLowerCase().includes(query));
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:26px; color:var(--text-muted); background:var(--bg-surface); border-radius:12px; border:1px solid var(--border-beige);">
        <p style="font-weight:700; font-size:0.9rem; color:var(--text-main);">Nenhum item encontrado</p>
        <p style="font-size:0.75rem; margin-top:4px;">Tente buscar com outro termo ou toque em "Todas".</p>
      </div>
    `;
    return;
  }

  const categoriesPresent = STOCK_CATEGORIES_INFO.filter(c => c.id !== 'todas' && items.some(i => i.category === c.id));

  let html = '';

  categoriesPresent.forEach(cat => {
    const catItems = items.filter(i => i.category === cat.id);
    if (catItems.length === 0) return;

    html += `
      <div class="stock-cat-section">
        <div class="stock-cat-title">
          <span>${cat.icon} ${cat.label.toUpperCase()}</span>
          <span class="stock-cat-count">${catItems.length} ${catItems.length === 1 ? 'item' : 'itens'}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${catItems.map(item => renderStockCardHTML(item)).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderStockCardHTML(item) {
  return `
    <div class="stepper-card" style="border-left: 3.5px solid var(--green-primary); padding: 8px 12px;">
      <div class="stepper-info" style="flex:1;">
        <h4 style="font-size:0.88rem; color:var(--text-main); font-weight:700;">${item.name}</h4>
        <span style="font-size:0.68rem; color:var(--text-muted);">${item.categoryLabel || ''} (${item.unit || 'und'})</span>
      </div>

      <div class="stepper-controls">
        <button type="button" class="btn-step" onclick="handleStockDelta('${item.id}', -1)" title="Diminuir 1">-</button>
        
        <div style="position:relative;" title="Toque no número para digitar">
          <input type="number" 
                 id="stock-qty-input-${item.id}" 
                 class="stock-qty-input" 
                 value="${item.quantity}" 
                 min="0"
                 onchange="handleStockDirectInput('${item.id}', this.value)"
                 onfocus="this.select()"
                 inputmode="numeric">
        </div>

        <button type="button" class="btn-step" onclick="handleStockDelta('${item.id}', 1)" title="Aumentar 1">+</button>

        <button type="button" onclick="removeStockItem('${item.id}', '${item.unitId || 'missao'}')" title="Remover item da despensa" style="background:none; border:none; color:#DC2626; opacity:0.6; font-size:1rem; cursor:pointer; padding:2px 4px; margin-left:2px;">
          🗑️
        </button>
      </div>
    </div>
  `;
}

async function handleStockDelta(itemId, delta) {
  if (navigator.vibrate) navigator.vibrate(10);
  const updated = await dbManager.adjustStockQuantity(itemId, delta);
  if (updated) {
    const inputEl = document.getElementById(`stock-qty-input-${itemId}`);
    if (inputEl) {
      inputEl.value = updated.quantity;
    } else {
      renderStockList();
    }
  }
}

async function handleStockDirectInput(itemId, value) {
  if (navigator.vibrate) navigator.vibrate(8);
  const parsed = parseInt(value, 10);
  const cleanVal = isNaN(parsed) ? 0 : Math.max(0, parsed);
  await dbManager.setStockQuantity(itemId, cleanVal);
  const inputEl = document.getElementById(`stock-qty-input-${itemId}`);
  if (inputEl) inputEl.value = cleanVal;
}

async function promptAddNewStockItem(unitId) {
  const name = prompt('Nome do novo alimento ou item:');
  if (!name || !name.trim()) return;

  const qtyStr = prompt(`Quantidade inicial para "${name.trim()}":`, '10');
  const qty = parseInt(qtyStr, 10) || 0;

  const unitStr = prompt('Unidade de medida (und, pct, kg, cx, etc.):', 'und') || 'und';

  const newItem = {
    id: `stk_${unitId}_custom_${Date.now()}`,
    baseId: `c_${Date.now()}`,
    name: name.trim(),
    category: window.currentStockCategory !== 'todas' ? window.currentStockCategory : 'alimentos_grossos',
    categoryLabel: 'Alimentos Gerais',
    categoryIcon: '📦',
    quantity: Math.max(0, qty),
    unit: unitStr.trim().toLowerCase(),
    minQty: 5,
    unitId: unitId
  };

  await dbManager.saveStockItem(newItem);
  showToast(`Item "${newItem.name}" adicionado com sucesso!`, 'success');
  renderStockList();
}

async function removeStockItem(itemId, unitId) {
  const stock = dbManager.getStock();
  const item = stock.find(s => s.id === itemId);
  if (!item) return;

  if (!confirm(`Deseja realmente remover "${item.name}" do estoque desta despensa?`)) {
    return;
  }

  const filtered = stock.filter(s => s.id !== itemId);
  localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(filtered));

  if (dbManager.firebaseDb) {
    try {
      dbManager._lastLocalWrite = Date.now();
      await dbManager.firebaseDb.ref(`cristolandia_check/stock/${itemId}`).remove();
    } catch (e) {
      console.warn('Erro ao remover no Firebase:', e);
    }
  }

  showToast(`Item "${item.name}" removido.`, 'info');
  renderStockList();
}

// 4. MODO ANALISAR: GRÁFICO EM BARRAS HORIZONTAL COM ESCALA ADAPTATIVA
function openStockAnalyticsView(unitId, filterCat = 'todas') {
  window.currentStockUnit = unitId;
  window._currentScreen = { type: 'stock-analytics', unitId, filterCat };
  const unit = getStockUnitObj(unitId);
  const allItems = dbManager.getStock(unitId);
  const items = filterCat === 'todas' ? allItems : allItems.filter(i => i.category === filterCat);

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="selectStockUnit('${unitId}')" title="Voltar para ações" style="width:32px; height:32px; font-size:1rem; margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size: 1.2rem;">📊</span>
      </div>
      <div>
        <h2>Análise de Estoque</h2>
        <p style="font-size:0.75rem;">${unit.name} (${items.length} itens)</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  // Cálculo da altura calibrada com escala logarítmica para itens > 100 não desproporcionarem o gráfico
  const maxQty = Math.max(...allItems.map(i => i.quantity || 0), 1);

  function getScaledHeight(qty) {
    if (qty <= 0) return 6;
    // Escala logarítmica suave para visualização harmoniosa entre pequenas (2, 4) e grandes quantidades (100, 300)
    const logVal = Math.log10(qty + 1);
    const logMax = Math.log10(maxQty + 1);
    const ratio = Math.max(0.06, logVal / (logMax || 1));
    return Math.round(16 + ratio * 136); // Altura entre 22px e 152px
  }

  modalBody.innerHTML = `
    <!-- Filtros de Categorias para o Gráfico (Todas Juntas sem Scroll Lock) -->
    <div class="stock-tags-wrap">
      ${STOCK_CATEGORIES_INFO.map(cat => `
        <button type="button" class="chip-filter ${cat.id === filterCat ? 'active' : ''}" onclick="openStockAnalyticsView('${unitId}', '${cat.id}')">
          <span style="font-size:0.95rem;">${cat.icon}</span>
          <span>${cat.label}</span>
        </button>
      `).join('')}
    </div>

    <!-- Container do Gráfico em Barras com Scroll Horizontal -->
    <div class="stock-chart-scroll-wrapper">
      <div class="stock-chart-track">
        ${items.map(item => {
          const barH = getScaledHeight(item.quantity || 0);
          return `
            <div class="stock-chart-bar-col" onclick="openStockItemOscillationModal('${item.id}', '${unitId}')" title="${item.name}: ${item.quantity} ${item.unit || 'und'} (Toque para oscilação mensal)">
              <div class="stock-chart-bar-zone">
                <div class="stock-chart-badge">${item.quantity} ${item.unit || 'und'}</div>
                <div class="stock-chart-bar" style="height: ${barH}px;"></div>
              </div>
              <div class="stock-chart-label">${item.name}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="text-align: center; margin-top: 10px;">
      <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">
        Clique em qualquer item para ver o consumo médio
      </span>
    </div>
  `;

  modalFooter.innerHTML = '';
}

// 5. MODAL DE OSCILAÇÃO MENSAL E CONSUMO MÉDIO DO ITEM ESPECÍFICO
function openStockItemOscillationModal(itemId, unitId) {
  const stock = dbManager.getStock(unitId);
  const item = stock.find(s => s.id === itemId);
  if (!item) return;

  const unit = getStockUnitObj(unitId);
  const history = dbManager.getItemMonthlyHistory(item);

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStockAnalyticsView('${unitId}')" title="Voltar ao gráfico geral" style="width:32px; height:32px; font-size:1rem; margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size: 1.2rem;">📈</span>
      </div>
      <div>
        <h2>Oscilação do Item</h2>
        <p style="font-size:0.75rem;">${item.name} · ${unit.name}</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  // Construção do Gráfico SVG de Oscilação Mensal
  const months = history.months;
  const values = history.stockLevels;
  const maxVal = Math.max(...values, 1);
  const svgW = 310;
  const svgH = 140;
  const padL = 26;
  const padR = 26;
  const padT = 20;
  const padB = 24;
  const drawW = svgW - padL - padR;
  const drawH = svgH - padT - padB;

  const points = values.map((val, i) => {
    const x = Math.round(padL + (i / (values.length - 1)) * drawW);
    const y = Math.round(padT + drawH - (val / maxVal) * drawH);
    return { x, y, val, month: months[i] };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + drawH} L ${points[0].x} ${padT + drawH} Z`;

  modalBody.innerHTML = `
    <div class="oscillation-container">
      <!-- Card do Item Selecionado -->
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-beige); border-radius: var(--radius-md); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-subtle);">
        <div>
          <h3 style="font-size: 0.98rem; font-weight: 800; color: var(--text-main);">${item.name}</h3>
          <p style="font-size: 0.72rem; color: var(--text-muted);">${item.categoryLabel || 'Alimento'} · ${item.unit || 'und'}</p>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Estoque Atual</span>
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--green-primary);">${item.quantity} ${item.unit || 'und'}</div>
        </div>
      </div>

      <!-- Gráfico SVG de Linha e Área de Oscilação -->
      <div class="oscillation-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 0.72rem; font-weight: 700; color: var(--green-primary); text-transform: uppercase; letter-spacing: 0.5px;">Oscilação Mensal em Estoque (2026)</span>
          <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600;">Jan – Set</span>
        </div>

        <svg viewBox="0 0 ${svgW} ${svgH}" style="width: 100%; height: auto; overflow: visible;">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#C58908" stop-opacity="0.38"/>
              <stop offset="100%" stop-color="#1E4D2B" stop-opacity="0.04"/>
            </linearGradient>
          </defs>

          <!-- Linha de base -->
          <line x1="${padL}" y1="${padT + drawH}" x2="${svgW - padR}" y2="${padT + drawH}" stroke="var(--border-beige)" stroke-width="1.5" />

          <!-- Área sombreada -->
          <path d="${areaD}" fill="url(#areaGradient)" />

          <!-- Linha da curva -->
          <path d="${pathD}" fill="none" stroke="var(--gold-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Pontos e Rótulos -->
          ${points.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="var(--green-primary)" stroke-width="2.5" />
            <text x="${p.x}" y="${p.y - 7}" font-size="8.5" font-weight="700" fill="var(--green-primary)" text-anchor="middle">${p.val}</text>
            <text x="${p.x}" y="${svgH - 6}" font-size="8.5" font-weight="600" fill="var(--text-muted)" text-anchor="middle">${p.month}</text>
          `).join('')}
        </svg>
      </div>

      <!-- Card de Consumo Médio Mensal em Destaque Conforme Solicitado -->
      <div class="avg-consumption-box">
        <div class="avg-consumption-label">Consumo Médio Mensal do Item</div>
        <div class="avg-consumption-val">${history.avgConsumption} ${history.unit || 'und'} / mês</div>
        <div class="avg-consumption-sub">
          Média calculada com base na rotina de preparo das refeições e atendimento de ${unit.name}.
        </div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = '';
}

// --- MÓDULO 5: RELATÓRIOS CONSOLIDADOS CLEAN ---
function openReportsModal() {
  window._currentScreen = { type: 'reports-history' };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-relatorios';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 3H15M9 3C9 2 10 1 12 1C14 1 15 2 15 3M9 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H15"/>
          <path d="M8 12L11 15L16 9"/>
        </svg>
      </div>
      <div>
        <h2>Relatórios Consolidados</h2>
        <p style="font-size:0.75rem;">Visão geral de atendimento das unidades</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:8px;">
      <select id="report-filter-unit" class="form-select" style="flex:1;" onchange="renderReportsHistory()">
        <option value="todas">Todas as Unidades</option>
        <option value="missao">Unidade Missão</option>
        <option value="macedonia">Unidade Macedônia</option>
        <option value="feminina">Unidade Feminina</option>
      </select>

      <button class="btn-primary-action" style="padding:10px 14px; font-size:0.76rem; flex:none;" onclick="shareReportsWhatsApp()">
        WhatsApp
      </button>
    </div>

    <!-- KPIs de Resumo -->
    <div id="reports-kpi-summary" class="hero-metrics-row" style="background:var(--bg-surface); border:1px solid var(--border-beige); color:var(--text-main); margin-bottom:12px;">
      <!-- KPIs calculados -->
    </div>

    <!-- Histórico de Relatórios -->
    <div id="reports-history-list" style="display:flex; flex-direction:column; gap:10px;">
      <!-- Lista -->
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-secondary-action" style="width:100%;" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  `;

  renderReportsHistory();
  openModal('modal-generic');
}

function renderReportsHistory() {
  const container = document.getElementById('reports-history-list');
  const kpiContainer = document.getElementById('reports-kpi-summary');
  if (!container) return;

  const unitFilter = document.getElementById('report-filter-unit')?.value || 'todas';
  let reports = dbManager.getReports();

  if (unitFilter !== 'todas') {
    reports = reports.filter(r => r.unitId === unitFilter);
  }

  const totalAcolhidos = reports.reduce((acc, r) => acc + (r.acolhidosPresentes || 0), 0);
  const totalRefeicoes = reports.reduce((acc, r) => {
    const ref = r.refeicoes || {};
    return acc + (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0);
  }, 0);
  const totalTriagens = reports.reduce((acc, r) => acc + (r.novasTriagens || 0), 0);

  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="metric-item">
        <span class="metric-label" style="color:var(--text-muted);">Acolhidos</span>
        <span class="metric-value" style="color:var(--green-primary);">${totalAcolhidos}</span>
        <span class="metric-sub" style="color:var(--text-muted);">no período</span>
      </div>
      <div class="metric-item">
        <span class="metric-label" style="color:var(--text-muted);">Refeições</span>
        <span class="metric-value" style="color:var(--gold-primary);">${totalRefeicoes}</span>
        <span class="metric-sub" style="color:var(--text-muted);">servidas</span>
      </div>
      <div class="metric-item">
        <span class="metric-label" style="color:var(--text-muted);">Triagens</span>
        <span class="metric-value" style="color:var(--green-primary);">${totalTriagens}</span>
        <span class="metric-sub" style="color:var(--text-muted);">novas</span>
      </div>
    `;
  }

  if (reports.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--text-muted);">
        <p>Nenhum relatório cadastrado para este filtro.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reports.map(r => {
    const badgeClass = r.unitId === 'missao' ? 'badge-missao' : (r.unitId === 'macedonia' ? 'badge-macedonia' : 'badge-feminina');
    const totalRef = (r.refeicoes?.cafe || 0) + (r.refeicoes?.almoco || 0) + (r.refeicoes?.lanche || 0) + (r.refeicoes?.jantar || 0);
    return `
      <div class="history-item">
        <div class="history-item-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="history-badge ${badgeClass}">${r.unitName}</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--green-primary);">${formatDateBR(r.date)}</span>
          </div>
          <span style="font-size:0.72rem; color:var(--text-muted);">${r.reporterName}</span>
        </div>

        <div class="history-stats">
          <div><strong>Acolhidos:</strong> ${r.acolhidosPresentes}</div>
          <div><strong>Triagens:</strong> ${r.novasTriagens}</div>
          <div><strong>Refeições:</strong> ${totalRef}</div>
        </div>

        ${r.atividades ? `<p style="font-size:0.76rem; color:var(--text-main); line-height:1.3;"><strong>Atividades:</strong> ${r.atividades}</p>` : ''}
        ${r.necessidades ? `<p style="font-size:0.76rem; color:var(--gold-primary); line-height:1.3;"><strong>Necessidades:</strong> ${r.necessidades}</p>` : ''}
      </div>
    `;
  }).join('');
}

function shareReportsWhatsApp() {
  const reports = dbManager.getReports();
  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(r => r.date === todayStr);

  let text = `*CRISTOLÂNDIA CHECK • RESUMO DIÁRIO (${formatDateBR(todayStr)})*\n\n`;

  if (todayReports.length === 0) {
    text += `Nenhum relatório preenchido hoje ainda.\n`;
  } else {
    todayReports.forEach(r => {
      const totalRef = (r.refeicoes?.cafe || 0) + (r.refeicoes?.almoco || 0) + (r.refeicoes?.lanche || 0) + (r.refeicoes?.jantar || 0);
      text += `*UNIDADE ${r.unitName.toUpperCase()}*\n`;
      text += `• Acolhidos: ${r.acolhidosPresentes} | Triagens: ${r.novasTriagens}\n`;
      text += `• Refeições: ${totalRef}\n`;
      if (r.atividades) text += `• Atividades: ${r.atividades}\n`;
      if (r.necessidades) text += `• Necessidades: ${r.necessidades}\n`;
      text += `• Plantonista: ${r.reporterName}\n\n`;
    });
  }

  text += `_Cristolândia Check PWA_`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// --- MÓDULO 6: CADASTRAR IGREJA CLEAN ---
// Alias de compatibilidade
function openChurchesModal() { openInstituicoesModal(); }

// ============================================================
// MÓDULO 7: INSTITUIÇÕES (HUB: ATIVIDADES + CADASTROS)
// ============================================================

function openInstituicoesModal() {
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="7"/>
          <line x1="10" y1="4" x2="14" y2="4"/>
          <path d="M12 7L4 12V22H20V12L12 7Z"/>
          <path d="M10 22V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V22"/>
        </svg>
      </div>
      <div>
        <h2>Instituições</h2>
        <p style="font-size:0.75rem;">Parcerias, atividades e cadastros</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div class="stock-actions-choice-grid">
      <div class="stock-action-choice-card" onclick="openAtividadesView()">
        <div class="stock-action-icon-box update">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
          </svg>
        </div>
        <div class="stock-action-title">Atividades</div>
        <div class="stock-action-desc">Histórico de atividades realizadas por igrejas e instituições parceiras</div>
      </div>

      <div class="stock-action-choice-card" onclick="openCadastrosInstituicoes()">
        <div class="stock-action-icon-box analytics">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stock-action-title">Cadastros</div>
        <div class="stock-action-desc">Gerenciar igrejas e instituições parceiras cadastradas</div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = '';

  openModal('modal-generic');
}

// ---- ATIVIDADES ----

function openAtividadesView(filterInstId = '') {
  window._currentScreen = { type: 'activities', filterInstId };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const institutions = dbManager.getChurches();
  const all = dbManager.getActivities();
  const filtered = filterInstId ? all.filter(a => a.institutionId === filterInstId) : all;
  // Ordena cronológico decrescente
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openInstituicoesModal()" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div>
        <h2>Atividades</h2>
        <p style="font-size:0.75rem;">Histórico cronológico</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  const filterOptions = institutions.map(i =>
    `<option value="${i.id}" ${filterInstId === i.id ? 'selected' : ''}>${i.name}</option>`
  ).join('');

  const listHtml = filtered.length === 0
    ? `<div style="text-align:center;padding:30px;color:var(--text-muted);"><p style="font-weight:600;">Nenhuma atividade registrada.</p><p style="font-size:0.76rem;">Registre atividades realizadas com as instituições parceiras.</p></div>`
    : filtered.map(a => {
        const instName = a.institutionName || '—';
        const unitLabel = { missao: 'Missão', macedonia: 'Macedônia', feminina: 'Feminina' }[a.unitId] || a.unitId || '—';
        return `
          <div class="history-item" style="border-left:3px solid var(--gold-primary);">
            <div class="history-item-header">
              <div>
                <h4 style="font-size:0.85rem;font-weight:700;color:var(--green-primary);">${instName}</h4>
                <span style="font-size:0.72rem;color:var(--text-muted);">${formatDateBR(a.date)} · ${unitLabel}</span>
              </div>
              <button onclick="handleDeleteAtividade('${a.id}')" style="background:none;border:none;color:var(--text-muted);font-size:0.72rem;cursor:pointer;font-weight:600;">Remover</button>
            </div>
            ${a.description ? `<p style="font-size:0.78rem;color:var(--text-main);margin-top:4px;line-height:1.4;">${a.description}</p>` : ''}
          </div>
        `;
      }).join('');

  modalBody.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
      <select id="atividades-filter-inst" class="form-input" style="flex:1;" onchange="openAtividadesView(this.value)">
        <option value="">Todas as instituições</option>
        ${filterOptions}
      </select>
      <button class="btn-primary-action" style="padding:10px 14px;flex:none;font-size:0.8rem;font-weight:800;white-space:nowrap;" onclick="openNovaAtividadeForm({})">
        Nova +
      </button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${listHtml}
    </div>
  `;

  modalFooter.innerHTML = '';
}

function openNovaAtividadeForm(pending) {
  // pending = { date, unitId, institutionId, description } — preservado ao retornar do cadastro
  const p = pending || {};
  const institutions = dbManager.getChurches();
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const today = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openAtividadesView()" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size:1.1rem;">📝</span>
      </div>
      <div>
        <h2>Nova Atividade</h2>
        <p style="font-size:0.75rem;">Registrar atividade realizada</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  const instOptions = [
    `<option value="__cadastrar__">+ Cadastrar nova instituição</option>`,
    `<option value="" disabled>────────────────</option>`,
    ...institutions.map(i =>
      `<option value="${i.id}" ${p.institutionId === i.id ? 'selected' : ''}>${i.name}</option>`
    )
  ].join('');

  modalBody.innerHTML = `
    <form id="nova-atividade-form" onsubmit="event.preventDefault();">
      <div class="form-group">
        <label class="form-label">Data da Atividade</label>
        <input type="date" id="atv-date" class="form-input" value="${p.date || today}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Unidade</label>
        <select id="atv-unit" class="form-input">
          <option value="missao" ${(p.unitId === 'missao' || !p.unitId) ? 'selected' : ''}>Missão</option>
          <option value="macedonia" ${p.unitId === 'macedonia' ? 'selected' : ''}>Macedônia</option>
          <option value="feminina" ${p.unitId === 'feminina' ? 'selected' : ''}>Feminina</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Instituição</label>
        <select id="atv-institution" class="form-input" onchange="handleInstituicaoSelectChange(this.value)">
          <option value="">Selecione uma instituição...</option>
          ${instOptions}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Descrição da Atividade</label>
        <textarea id="atv-description" class="form-textarea" rows="4" placeholder="Descreva a atividade realizada, quantidade de pessoas, materiais entregues...">${p.description || ''}</textarea>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" style="width:100%;background:linear-gradient(135deg,#1E4D2B,#2E6A3B);color:#FFF;font-weight:800;" onclick="handleSaveAtividade()">💾 Salvar Atividade</button>
  `;
}

function handleInstituicaoSelectChange(val) {
  if (val !== '__cadastrar__') return;
  // Coleta dados parciais do formulário antes de navegar
  const pending = {
    date: document.getElementById('atv-date')?.value || '',
    unitId: document.getElementById('atv-unit')?.value || 'missao',
    institutionId: '',
    description: document.getElementById('atv-description')?.value || ''
  };
  openCadastroInstituicaoForm(pending);
}

async function handleSaveAtividade() {
  const institutionId = document.getElementById('atv-institution')?.value;
  const date = document.getElementById('atv-date')?.value;
  const unitId = document.getElementById('atv-unit')?.value;
  const description = document.getElementById('atv-description')?.value.trim();

  if (!institutionId || institutionId === '__cadastrar__') {
    showToast('Selecione uma instituição!', 'warning'); return;
  }
  if (!date) { showToast('Informe a data da atividade!', 'warning'); return; }
  if (!description) { showToast('Descreva a atividade!', 'warning'); return; }

  const institution = dbManager.getChurches().find(i => i.id === institutionId);

  const newActivity = {
    id: 'act_' + Date.now(),
    date,
    unitId,
    institutionId,
    institutionName: institution?.name || '',
    description
  };

  showLoading('Gravando atividade...');
  try {
    await dbManager.saveActivity(newActivity);
    showToast('Atividade registrada!', 'success');
    openAtividadesView();
  } catch (e) {
    showToast('Erro: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
}

async function handleDeleteAtividade(id) {
  if (!confirm('Deseja remover esta atividade?')) return;
  showLoading('Removendo...');
  try {
    await dbManager.deleteActivity(id);
    showToast('Atividade removida.', 'info');
    openAtividadesView();
  } catch (e) {
    showToast('Erro ao remover: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
}

// ---- CADASTROS DE INSTITUIÇÕES ----

function openCadastrosInstituicoes() {
  window._currentScreen = { type: 'instituicoes-list' };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openInstituicoesModal()" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div>
        <h2>Cadastros</h2>
        <p style="font-size:0.75rem;">Instituições parceiras</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
      <input type="text" id="inst-search-input" class="form-input" placeholder="Buscar instituição..." oninput="renderInstituicoesList()">
      <button class="btn-primary-action" style="padding:10px 14px;flex:none;font-size:0.78rem;" onclick="openCadastroInstituicaoForm(null)">
        + Nova
      </button>
    </div>
    <div id="instituicoes-list-container" style="display:flex;flex-direction:column;gap:8px;"></div>
  `;

  modalFooter.innerHTML = '';

  renderInstituicoesList();
}

function renderInstituicoesList() {
  const container = document.getElementById('instituicoes-list-container');
  if (!container) return;

  const query = (document.getElementById('inst-search-input')?.value || '').toLowerCase();
  let institutions = dbManager.getChurches();

  if (query) {
    institutions = institutions.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.pastor && c.pastor.toLowerCase().includes(query)) ||
      (c.address && c.address.toLowerCase().includes(query))
    );
  }

  if (institutions.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;color:var(--text-muted);">
        <p style="font-weight:600;">Nenhuma instituição cadastrada.</p>
        <p style="font-size:0.76rem;">Cadastre igrejas e instituições parceiras.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = institutions.map(c => {
    const rawPhone = (c.phone || '').replace(/\D/g, '');
    const waUrl = rawPhone ? `https://wa.me/55${rawPhone}?text=Olá%20${encodeURIComponent(c.pastor || '')},%20paz%20do%20Senhor!%20Mensagem%20da%20Cristolândia:` : '#';
    return `
      <div class="history-item" style="border-left:3px solid var(--green-primary);">
        <div class="history-item-header">
          <div>
            <h4 style="font-size:0.9rem;font-weight:700;color:var(--green-primary);">${c.name}</h4>
            <span style="font-size:0.72rem;color:var(--text-muted);">${c.pastor || ''}${c.address ? ' · ' + c.address : ''}</span>
          </div>
          ${rawPhone ? `<a href="${waUrl}" target="_blank" style="padding:4px 8px;border-radius:6px;background:var(--green-light);color:var(--green-primary);font-size:0.72rem;font-weight:700;text-decoration:none;">WhatsApp</a>` : ''}
        </div>
        <div style="font-size:0.76rem;background:var(--bg-beige);padding:8px 10px;border-radius:8px;display:flex;flex-direction:column;gap:3px;">
          ${c.phone ? `<div><strong>Telefone:</strong> ${c.phone}</div>` : ''}
          ${c.instagram ? `<div><strong>Instagram/Site:</strong> ${c.instagram}</div>` : ''}
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button onclick="handleDeleteInstituicao('${c.id}')" style="background:none;border:none;color:var(--text-muted);font-size:0.72rem;cursor:pointer;font-weight:600;">Remover</button>
        </div>
      </div>
    `;
  }).join('');
}

function openCadastroInstituicaoForm(pendingActivityData) {
  // pendingActivityData: se vier de openNovaAtividadeForm, guarda os dados parciais
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const fromActivity = pendingActivityData !== null && pendingActivityData !== undefined;
  const pendingJson = fromActivity ? encodeURIComponent(JSON.stringify(pendingActivityData)) : 'null';

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="${fromActivity ? `openNovaAtividadeForm(JSON.parse(decodeURIComponent('${pendingJson}')))` : 'openCadastrosInstituicoes()'}" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <span style="font-size:1.1rem;">🏛️</span>
      </div>
      <div>
        <h2>Nova Instituição</h2>
        <p style="font-size:0.75rem;">${fromActivity ? 'Cadastrar e retornar ao registro de atividade' : 'Cadastrar instituição parceira'}</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="inst-add-form" onsubmit="event.preventDefault();">
      ${fromActivity ? `<div style="background:var(--bg-beige);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:0.78rem;color:var(--text-muted);border-left:3px solid var(--gold-primary);">💡 Após salvar, você será redirecionado de volta ao registro de atividade com esta instituição já selecionada.</div>` : ''}

      <div class="form-group">
        <label class="form-label">Nome da Instituição *</label>
        <input type="text" id="inst-name" class="form-input" placeholder="Ex: Igreja Batista Central, ONG Abraço" required autofocus>
      </div>

      <div class="form-group">
        <label class="form-label">Endereço</label>
        <input type="text" id="inst-address" class="form-input" placeholder="Ex: Rua das Flores, 123 - Centro">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Presidente / Responsável</label>
          <input type="text" id="inst-pastor" class="form-input" placeholder="Ex: Pastor João">
        </div>
        <div class="form-group">
          <label class="form-label">Telefone</label>
          <input type="tel" id="inst-phone" class="form-input" placeholder="(11) 99999-9999">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Instagram ou Site</label>
        <input type="text" id="inst-instagram" class="form-input" placeholder="Ex: @nome_instagram ou https://...">
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" style="width:100%;background:linear-gradient(135deg,#1E4D2B,#2E6A3B);color:#FFF;font-weight:800;" onclick="handleSaveInstituicao(${fromActivity ? `JSON.parse(decodeURIComponent('${pendingJson}'))` : 'null'})">💾 Salvar Instituição</button>
  `;
}

async function handleSaveInstituicao(pendingActivityData) {
  const name = document.getElementById('inst-name')?.value.trim();
  if (!name) { showToast('Informe o nome da instituição!', 'warning'); return; }

  const newInstitution = {
    id: 'chu_' + Date.now(),
    name,
    address: document.getElementById('inst-address')?.value.trim() || '',
    pastor: document.getElementById('inst-pastor')?.value.trim() || '',
    phone: document.getElementById('inst-phone')?.value.trim() || '',
    instagram: document.getElementById('inst-instagram')?.value.trim() || '',
    city: '',
    neighborhood: '',
    supportType: '',
    lastVisit: '',
    notes: ''
  };

  showLoading('Cadastrando instituição...');
  try {
    await dbManager.saveChurch(newInstitution);
    showToast(`"${name}" cadastrada!`, 'success');
    if (pendingActivityData !== null && pendingActivityData !== undefined) {
      // Retorna ao formulário de atividade com instituição já selecionada
      const updated = { ...pendingActivityData, institutionId: newInstitution.id };
      openNovaAtividadeForm(updated);
    } else {
      openCadastrosInstituicoes();
    }
  } catch (e) {
    showToast('Erro: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
}

async function handleDeleteInstituicao(id) {
  if (!confirm('Deseja remover esta instituição?')) return;
  showLoading('Removendo...');
  try {
    await dbManager.deleteChurch(id);
    showToast('Instituição removida.', 'info');
    renderInstituicoesList();
  } catch (e) {
    showToast('Erro ao remover: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
}

function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}
