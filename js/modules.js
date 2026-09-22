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

// ==========================================================================
// MÓDULO EXCLUSIVO DA UNIDADE MISSÃO (HISTÓRICO + CALENDÁRIO + NOVO RELATÓRIO)
// ==========================================================================

// Ícones SVG de traço limpo na cor verde oficial para cada pergunta
const MISSAO_ICONS = {
  data: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  missionario: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v3"/><path d="M10.5 12.5h3"/></svg>`,
  pessoas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  refeicoes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  banhos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a4 4 0 0 1 4 4v2"/><path d="M11 10h8l-1.5 4h-5z"/><line x1="12" y1="17" x2="12" y2="17.01"/><line x1="15" y1="17" x2="15" y2="17.01"/><line x1="13.5" y1="20" x2="13.5" y2="20.01"/><line x1="4" y1="4" x2="4" y2="21"/></svg>`,
  cortes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  cultos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10L12 3L21 10"/><path d="M5 10V20H19V10"/><line x1="12" y1="7" x2="12" y2="15"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  buscaAtiva: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>`,
  decisoes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M7 7h10"/><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
};

// 1. Menu Inicial de Escolha da Missão (Histórico vs Novo Relatório)
function openMissaoFlow() {
  window._currentScreen = { type: 'missao-choice' };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const reports = dbManager.getReports();
  const todayReport = reports.find(r => r.unitId === 'missao' && r.date === todayStr);

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10L12 3L21 10"/>
          <path d="M5 10V20H19V10"/>
          <path d="M9 20V14H15V20"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      </div>
      <div>
        <h2>Unidade Missão</h2>
        <p style="margin-bottom:2px;">Atendimento e Acolhimento Social</p>
        ${todayReport 
          ? `<span style="display:inline-block; margin-top:2px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Relatório de hoje registrado</span>` 
          : `<span style="display:inline-block; margin-top:2px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#FFF8E1; color:#C58908;">📝 Relatório de hoje pendente</span>`}
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="text-align:center; margin: 6px 0 14px;">
      <p style="font-size:0.82rem; color:var(--text-muted);">Selecione a ação desejada para o relatório da Missão:</p>
    </div>

    <div class="missao-choice-grid">
      <!-- Opção 1: Histórico com Calendário Mensal -->
      <div class="btn-choice-card" onclick="openMissaoCalendar()">
        <div class="btn-choice-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="btn-choice-title">Histórico</div>
        <div class="btn-choice-desc">Calendário mensal</div>
      </div>

      <!-- Opção 2: Novo Relatório -->
      <div class="btn-choice-card" onclick="openMissaoForm()">
        <div class="btn-choice-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <div class="btn-choice-title">Relatório</div>
        <div class="btn-choice-desc">Diário de 7 perguntas</div>
      </div>

      <!-- Opção 3: Triagem -->
      <div class="btn-choice-card" onclick="openMissaoTriagens()">
        <div class="btn-choice-icon" style="color:var(--gold-primary);">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
        </div>
        <div class="btn-choice-title" style="color:var(--gold-primary);">Triagem</div>
        <div class="btn-choice-desc">Lista e acolhimento</div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-secondary-action" style="width:100%;" onclick="closeModal('modal-generic')">Fechar</button>
  `;

  openModal('modal-generic');
}
window.openMissaoFlow = openMissaoFlow;

// 2. Histórico com Calendário Mensal da Missão
let _missaoCalYear = null;
let _missaoCalMonth = null;

function openMissaoCalendar(targetYear, targetMonth) {
  window._currentScreen = { type: 'missao-calendar' };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const now = new Date();
  if (targetYear === undefined || targetYear === null) {
    _missaoCalYear = now.getFullYear();
    _missaoCalMonth = now.getMonth();
  } else {
    _missaoCalYear = targetYear;
    _missaoCalMonth = targetMonth;
  }

  const reports = dbManager.getReports().filter(r => r.unitId === 'missao');
  const filledDatesMap = {};
  reports.forEach(r => {
    if (r && r.date) filledDatesMap[r.date] = r;
  });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const firstDayOfWeek = new Date(_missaoCalYear, _missaoCalMonth, 1).getDay();
  const daysInMonth = new Date(_missaoCalYear, _missaoCalMonth + 1, 0).getDate();
  const prevMonthDays = new Date(_missaoCalYear, _missaoCalMonth, 0).getDate();

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openMissaoFlow()" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div>
        <h2>Histórico Missão</h2>
        <p style="margin-bottom:2px;">Calendário de Atendimentos</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  let daysHtml = '';

  // Dias do mês anterior
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    daysHtml += `<div class="calendar-day-btn day-outside">${dayNum}</div>`;
  }

  // Dias do mês atual
  let filledCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayPad = String(day).padStart(2, '0');
    const monthPad = String(_missaoCalMonth + 1).padStart(2, '0');
    const dateStr = `${_missaoCalYear}-${monthPad}-${dayPad}`;

    const isFuture = (dateStr > todayStr);
    const isFilled = !isFuture && !!filledDatesMap[dateStr];
    if (isFilled) filledCount++;
    const isToday = (dateStr === todayStr);

    let btnClass = 'day-empty';
    if (isFuture) {
      btnClass = 'day-future';
    } else if (isFilled) {
      btnClass = 'day-filled';
    }
    const todayClass = isToday ? 'day-today' : '';
    const clickFn = isFuture
      ? ''
      : (isFilled ? `viewMissaoDayReport('${dateStr}')` : `openMissaoForm('${dateStr}')`);
    const titleAttr = isFuture
      ? 'Data futura não permitida'
      : (isFilled ? `Relatório preenchido em ${dayPad}/${monthPad}` : `Toque para preencher este dia`);

    daysHtml += `
      <button type="button" 
        class="calendar-day-btn ${btnClass} ${todayClass}" 
        ${isFuture ? 'disabled' : ''}
        ${clickFn ? `onclick="${clickFn}"` : ''} 
        title="${titleAttr}">
        ${day}
      </button>
    `;
  }

  modalBody.innerHTML = `
    <div class="calendar-card">
      <div class="calendar-header-nav">
        <button type="button" class="calendar-nav-btn" onclick="navMissaoCalendar(-1)">←</button>
        <div class="calendar-month-title">${monthNames[_missaoCalMonth]} de ${_missaoCalYear}</div>
        <button type="button" class="calendar-nav-btn" onclick="navMissaoCalendar(1)">→</button>
      </div>

      <div class="calendar-weekdays">
        <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
      </div>

      <div class="calendar-grid">
        ${daysHtml}
      </div>

      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-dot filled"></span>
          <span>Preenchido</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot empty"></span>
          <span>Não preenchido</span>
        </div>
      </div>
    </div>

    <div style="background:var(--bg-cream); border:1px solid var(--border-beige); border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:0.75rem; color:var(--text-muted);">Relatórios no mês:</span>
      <span style="font-family:var(--font-gothic); font-size:0.85rem; font-weight:800; color:var(--green-primary);">${filledCount} / ${daysInMonth} dias</span>
    </div>

    <div style="margin-top:10px; text-align:center;">
      <span style="font-size:0.72rem; color:var(--text-muted);">Toque em um dia verde para visualizar ou em um dia cinza para registrar.</span>
    </div>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openMissaoFlow()">← Voltar</button>
      <button type="button" class="btn-primary-action" style="flex:1;" onclick="openMissaoForm()">📝 Novo de Hoje</button>
    </div>
  `;

  openModal('modal-generic');
}
window.openMissaoCalendar = openMissaoCalendar;

function navMissaoCalendar(delta) {
  let newMonth = _missaoCalMonth + delta;
  let newYear = _missaoCalYear;
  if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }
  openMissaoCalendar(newYear, newMonth);
}
window.navMissaoCalendar = navMissaoCalendar;

// 3. Visualização do Relatório da Missão por Data
function viewMissaoDayReport(dateStr) {
  window._currentScreen = { type: 'missao-view', dateStr };
  const reports = dbManager.getReports();
  const r = reports.find(rep => rep.unitId === 'missao' && rep.date === dateStr);
  if (!r) {
    openMissaoForm(dateStr);
    return;
  }

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const pTotal = r.pessoasAtendidas?.total ?? r.acolhidosPresentes ?? 0;
  const pRua = r.pessoasAtendidas?.rua ?? 0;
  const pUnidade = r.pessoasAtendidas?.unidade ?? (r.acolhidosPresentes ?? 0);
  const pBusca = r.pessoasAtendidas?.buscaAtiva ?? 0;

  const ref = r.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0);

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openMissaoCalendar()" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10L12 3L21 10"/>
          <path d="M5 10V20H19V10"/>
          <path d="M9 20V14H15V20"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      </div>
      <div>
        <h2>Relatório Missão</h2>
        <p style="margin-bottom:2px;">${formatDateBR(dateStr)} • ${r.reporterName || 'Missionário'}</p>
        <span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Relatório Registrado</span>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <!-- 1. Data e Missionário -->
    <div style="background:var(--bg-cream); border:1px solid var(--border-beige); border-radius:12px; padding:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Data do Relatório</span>
        <div style="font-family:var(--font-gothic); font-size:0.95rem; font-weight:800; color:var(--green-primary);">${formatDateBR(dateStr)}</div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Missionário</span>
        <div style="font-family:var(--font-gothic); font-size:0.9rem; font-weight:800; color:var(--text-main);">${r.reporterName || 'Equipe de Plantão'}</div>
      </div>
    </div>

    <!-- Indicadores Numéricos em Cards -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
      <!-- Pessoas Atendidas -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.pessoas}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Pessoas Atendidas</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${pTotal}</div>
        <div style="font-size:0.66rem; color:var(--text-muted);">Rua: ${pRua} | Unid: ${pUnidade} | Busca: ${pBusca}</div>
      </div>

      <!-- Refeições -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.refeicoes}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Refeições Servidas</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--gold-primary);">${totalRef}</div>
        <div style="font-size:0.66rem; color:var(--text-muted);">Café: ${ref.cafe || 0} | Almoço: ${ref.almoco || 0} | Jantar: ${ref.jantar || 0}</div>
      </div>

      <!-- Banhos -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.banhos}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Banhos</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.banhos || 0}</div>
      </div>

      <!-- Corte de Cabelo -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.cortes}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Cortes de Cabelo</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.cortesCabelo || 0}</div>
      </div>

      <!-- Cultos Realizados -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.cultos}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Cultos Realizados</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.cultos || 0}</div>
      </div>

      <!-- Busca Ativa Pessoas -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${MISSAO_ICONS.buscaAtiva}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Busca Ativa (Pessoas)</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.buscaAtivaPessoas || pBusca || 0}</div>
      </div>
    </div>

    <!-- Decisões por Cristo em destaque -->
    <div style="background:linear-gradient(135deg, rgba(197, 137, 8, 0.12), rgba(30, 77, 43, 0.08)); border:1.5px solid var(--gold-primary); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--gold-primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center;">
          ${MISSAO_ICONS.decisoes}
        </div>
        <div>
          <div style="font-family:var(--font-gothic); font-size:0.9rem; font-weight:800; color:var(--text-main);">Decisões por Cristo</div>
          <div style="font-size:0.68rem; color:var(--text-muted);">Vidas salvas e reconciliações</div>
        </div>
      </div>
      <div style="font-family:var(--font-gothic); font-size:1.8rem; font-weight:900; color:var(--gold-primary);">${r.decisoesCristo || 0}</div>
    </div>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openMissaoCalendar()">← Calendário</button>
      <button type="button" class="btn-primary-action" style="flex:1.2;" onclick="openMissaoForm('${dateStr}', true)">✏️ Editar Relatório</button>
    </div>
  `;

  openModal('modal-generic');
}
window.viewMissaoDayReport = viewMissaoDayReport;

// 4. Formulário do Relatório da Missão (Novo ou Edição com as 9 Perguntas Oficiais)
function openMissaoForm(targetDate, isEdit) {
  window._currentScreen = { type: 'missao-form', targetDate, isEdit };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const selectedDate = targetDate || todayStr;
  const isToday = (selectedDate === todayStr);

  const reports = dbManager.getReports();
  const existing = reports.find(r => r.unitId === 'missao' && r.date === selectedDate);

  // Valores pré-carregados
  const reporter = existing ? (r_name => r_name || 'Pr. Marcos Lima')(existing.reporterName) : 'Pr. Marcos Lima';
  
  // Detecção de status de ativação prévio
  const ans = existing?.answeredQuestions || {};
  const sub = existing?.answeredSubfields || {};
  const hasAns = !!existing?.answeredQuestions;

  // Bloco Pessoas
  const isRuaActive = hasAns ? (sub.pRua ?? !!ans.pessoas) : (!!existing && typeof existing.pessoasAtendidas?.rua === 'number');
  const isUnidadeActive = hasAns ? (sub.pUnidade ?? !!ans.pessoas) : (!!existing && typeof existing.pessoasAtendidas?.unidade === 'number');
  const isBuscaActive = hasAns ? (sub.pBusca ?? !!ans.pessoas) : (!!existing && typeof existing.pessoasAtendidas?.buscaAtiva === 'number');
  const isPessoasComplete = isRuaActive && isUnidadeActive && isBuscaActive;

  // Bloco Refeições
  const isCafeActive = hasAns ? (sub.rCafe ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.cafe === 'number');
  const isAlmocoActive = hasAns ? (sub.rAlmoco ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.almoco === 'number');
  const isLancheActive = hasAns ? (sub.rLanche ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.lanche === 'number');
  const isJantarActive = hasAns ? (sub.rJantar ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.jantar === 'number');
  const isRBuscaActive = hasAns ? (sub.rBusca ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.buscaAtiva === 'number');
  const isRefeicoesComplete = isCafeActive && isAlmocoActive && isLancheActive && isJantarActive && isRBuscaActive;

  // Campos individuais
  const isBanhosActive = hasAns ? !!ans.banhos : (!!existing && typeof existing.banhos === 'number');
  const isCortesActive = hasAns ? !!ans.cortes : (!!existing && typeof existing.cortesCabelo === 'number');
  const isCultosActive = hasAns ? !!ans.cultos : (!!existing && typeof existing.cultos === 'number');
  const isBuscaPessoasActive = hasAns ? !!ans.buscaAtiva : (!!existing && (typeof existing.buscaAtivaPessoas === 'number' || typeof existing.pessoasAtendidas?.buscaAtiva === 'number'));
  const isDecisoesActive = hasAns ? !!ans.decisoes : (!!existing && typeof existing.decisoesCristo === 'number');

  // Valores numéricos carregados
  const pRua = existing?.pessoasAtendidas?.rua ?? 0;
  const pUnidade = existing?.pessoasAtendidas?.unidade ?? (existing?.acolhidosPresentes ?? 0);
  const pBusca = existing?.pessoasAtendidas?.buscaAtiva ?? 0;
  const pTotal = pRua + pUnidade + pBusca;

  const ref = existing?.refeicoes || {};
  const rCafe = ref.cafe ?? 0;
  const rAlmoco = ref.almoco ?? 0;
  const rLanche = ref.lanche ?? 0;
  const rJantar = ref.jantar ?? 0;
  const rBusca = ref.buscaAtiva ?? 0;
  const rTotal = rCafe + rAlmoco + rLanche + rJantar + rBusca;

  const banhos = existing?.banhos ?? 0;
  const cortes = existing?.cortesCabelo ?? 0;
  const cultos = existing?.cultos ?? 0;
  const buscaAtivaPessoas = existing?.buscaAtivaPessoas ?? pBusca;
  const decisoes = existing?.decisoesCristo ?? 0;

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openMissaoFlow()" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10L12 3L21 10"/>
          <path d="M5 10V20H19V10"/>
          <path d="M9 20V14H15V20"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      </div>
      <div>
        <h2>${existing ? 'Editar' : 'Preencher'} Missão</h2>
        <p style="margin-bottom:2px;">${isToday ? 'Relatório de Hoje' : 'Relatório de ' + formatDateBR(selectedDate)}</p>
        ${existing 
          ? `<span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Modo de edição</span>`
          : `<span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#FFF8E1; color:#C58908;">📝 Novo preenchimento</span>`}
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="missao-report-form" onsubmit="event.preventDefault();">
      <input type="hidden" id="missao-rep-id" value="${existing ? existing.id : ''}">

      <!-- DATA -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${MISSAO_ICONS.data}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Data</div>
            <div class="missao-q-sub">Padrão "Hoje" ou toque no calendário para alterar</div>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <div style="flex:1; background:var(--bg-cream); border:1.5px solid var(--border-beige); border-radius:10px; padding:8px 12px; display:flex; align-items:center; justify-content:space-between;">
            <span style="font-family:var(--font-gothic); font-weight:800; color:var(--green-primary); font-size:0.95rem;" id="missao-date-label">
              ${isToday ? `Hoje (${formatDateBR(selectedDate)})` : formatDateBR(selectedDate)}
            </span>
            <input type="date" id="missao-rep-date" value="${selectedDate}" max="${todayStr}" class="form-input" style="width:auto; padding:4px 8px; font-size:0.8rem;" onchange="onMissaoDateChanged(this.value)">
          </div>
        </div>
      </div>

      <!-- MISSIONÁRIO -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${MISSAO_ICONS.missionario}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Missionário</div>
          </div>
        </div>
        <input type="text" id="missao-rep-reporter" class="form-input" value="${reporter}" placeholder="Ex: Pr. Marcos Lima" required>
      </div>

      <!-- Nº DE PESSOAS ATENDIDAS PELA MISSÃO -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${MISSAO_ICONS.pessoas}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Nº de Pessoas atendidas pela Missão</div>
            <div class="missao-q-sub">Na rua, na unidade e na busca ativa</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">TOTAL</span>
            <div class="missao-total-val ${isPessoasComplete ? 'active-val' : ''}" id="missao-total-pessoas">${isPessoasComplete ? pTotal : '-'}</div>
          </div>
        </div>

        <div class="missao-sub-grid">
          <div class="missao-sub-item">
            <div class="missao-sub-item-header">
              <span>Na Rua</span>
            </div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-rua', -1, 'pessoas')">-</button>
              <input type="number" id="missao-p-rua" class="missao-step-input ${isRuaActive ? 'active-val' : ''}" data-activated="${isRuaActive ? 'true' : 'false'}" value="${isRuaActive ? pRua : ''}" onfocus="activateMissaoInput(this.id, 'pessoas')" onclick="activateMissaoInput(this.id, 'pessoas')" oninput="activateMissaoInput(this.id, 'pessoas'); recalcMissaoTotal('pessoas')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-rua', 1, 'pessoas')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header">
              <span>Na Unidade</span>
            </div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-unidade', -1, 'pessoas')">-</button>
              <input type="number" id="missao-p-unidade" class="missao-step-input ${isUnidadeActive ? 'active-val' : ''}" data-activated="${isUnidadeActive ? 'true' : 'false'}" value="${isUnidadeActive ? pUnidade : ''}" onfocus="activateMissaoInput(this.id, 'pessoas')" onclick="activateMissaoInput(this.id, 'pessoas')" oninput="activateMissaoInput(this.id, 'pessoas'); recalcMissaoTotal('pessoas')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-unidade', 1, 'pessoas')">+</button>
            </div>
          </div>

          <div class="missao-sub-item" style="grid-column: span 2;">
            <div class="missao-sub-item-header">
              <span>Na Busca Ativa</span>
            </div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-busca', -1, 'pessoas')">-</button>
              <input type="number" id="missao-p-busca" class="missao-step-input ${isBuscaActive ? 'active-val' : ''}" data-activated="${isBuscaActive ? 'true' : 'false'}" value="${isBuscaActive ? pBusca : ''}" onfocus="activateMissaoInput(this.id, 'pessoas')" onclick="activateMissaoInput(this.id, 'pessoas')" oninput="activateMissaoInput(this.id, 'pessoas'); recalcMissaoTotal('pessoas')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-p-busca', 1, 'pessoas')">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nº DE REFEIÇÕES SERVIDAS -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${MISSAO_ICONS.refeicoes}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Nº de Refeições servidas</div>
            <div class="missao-q-sub">Café da manhã, almoço, café da tarde, jantar e busca ativa (usuários, equipe e voluntários)</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">TOTAL</span>
            <div class="missao-total-val ${isRefeicoesComplete ? 'active-val' : ''}" id="missao-total-refeicoes">${isRefeicoesComplete ? rTotal : '-'}</div>
          </div>
        </div>

        <div class="missao-sub-grid">
          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Café da Manhã</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-cafe', -1, 'refeicoes')">-</button>
              <input type="number" id="missao-r-cafe" class="missao-step-input ${isCafeActive ? 'active-val' : ''}" data-activated="${isCafeActive ? 'true' : 'false'}" value="${isCafeActive ? rCafe : ''}" onfocus="activateMissaoInput(this.id, 'refeicoes')" onclick="activateMissaoInput(this.id, 'refeicoes')" oninput="activateMissaoInput(this.id, 'refeicoes'); recalcMissaoTotal('refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-cafe', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Almoço</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-almoco', -1, 'refeicoes')">-</button>
              <input type="number" id="missao-r-almoco" class="missao-step-input ${isAlmocoActive ? 'active-val' : ''}" data-activated="${isAlmocoActive ? 'true' : 'false'}" value="${isAlmocoActive ? rAlmoco : ''}" onfocus="activateMissaoInput(this.id, 'refeicoes')" onclick="activateMissaoInput(this.id, 'refeicoes')" oninput="activateMissaoInput(this.id, 'refeicoes'); recalcMissaoTotal('refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-almoco', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Café da Tarde</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-lanche', -1, 'refeicoes')">-</button>
              <input type="number" id="missao-r-lanche" class="missao-step-input ${isLancheActive ? 'active-val' : ''}" data-activated="${isLancheActive ? 'true' : 'false'}" value="${isLancheActive ? rLanche : ''}" onfocus="activateMissaoInput(this.id, 'refeicoes')" onclick="activateMissaoInput(this.id, 'refeicoes')" oninput="activateMissaoInput(this.id, 'refeicoes'); recalcMissaoTotal('refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-lanche', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Jantar</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-jantar', -1, 'refeicoes')">-</button>
              <input type="number" id="missao-r-jantar" class="missao-step-input ${isJantarActive ? 'active-val' : ''}" data-activated="${isJantarActive ? 'true' : 'false'}" value="${isJantarActive ? rJantar : ''}" onfocus="activateMissaoInput(this.id, 'refeicoes')" onclick="activateMissaoInput(this.id, 'refeicoes')" oninput="activateMissaoInput(this.id, 'refeicoes'); recalcMissaoTotal('refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-jantar', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item" style="grid-column: span 2;">
            <div class="missao-sub-item-header"><span>Nas Ações de Busca Ativa</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-busca', -1, 'refeicoes')">-</button>
              <input type="number" id="missao-r-busca" class="missao-step-input ${isRBuscaActive ? 'active-val' : ''}" data-activated="${isRBuscaActive ? 'true' : 'false'}" value="${isRBuscaActive ? rBusca : ''}" onfocus="activateMissaoInput(this.id, 'refeicoes')" onclick="activateMissaoInput(this.id, 'refeicoes')" oninput="activateMissaoInput(this.id, 'refeicoes'); recalcMissaoTotal('refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-r-busca', 1, 'refeicoes')">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nº DE BANHOS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${MISSAO_ICONS.banhos}</div>
            <div>
              <div class="missao-q-title">Nº de Banhos</div>
              <div class="missao-q-sub">Não considerar da equipe</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-banhos', -1)">-</button>
            <input type="number" id="missao-rep-banhos" class="missao-step-input ${isBanhosActive ? 'active-val' : ''}" data-activated="${isBanhosActive ? 'true' : 'false'}" value="${isBanhosActive ? banhos : ''}" onfocus="activateMissaoInput(this.id)" onclick="activateMissaoInput(this.id)" oninput="activateMissaoInput(this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-banhos', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- Nº DE CORTE DE CABELO -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${MISSAO_ICONS.cortes}</div>
            <div>
              <div class="missao-q-title">Nº de Corte de Cabelo</div>
              <div class="missao-q-sub">Não considerar da equipe</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-cortes', -1)">-</button>
            <input type="number" id="missao-rep-cortes" class="missao-step-input ${isCortesActive ? 'active-val' : ''}" data-activated="${isCortesActive ? 'true' : 'false'}" value="${isCortesActive ? cortes : ''}" onfocus="activateMissaoInput(this.id)" onclick="activateMissaoInput(this.id)" oninput="activateMissaoInput(this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-cortes', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- Nº DE CULTOS REALIZADOS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${MISSAO_ICONS.cultos}</div>
            <div>
              <div class="missao-q-title">Nº de Cultos realizados</div>
              <div class="missao-q-sub">Cultos, devocionais e ministrações</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-cultos', -1)">-</button>
            <input type="number" id="missao-rep-cultos" class="missao-step-input ${isCultosActive ? 'active-val' : ''}" data-activated="${isCultosActive ? 'true' : 'false'}" value="${isCultosActive ? cultos : ''}" onfocus="activateMissaoInput(this.id)" onclick="activateMissaoInput(this.id)" oninput="activateMissaoInput(this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-cultos', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- Nº DE PESSOAS ATENDIDAS NAS AÇÕES DE BUSCA ATIVA -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${MISSAO_ICONS.buscaAtiva}</div>
            <div>
              <div class="missao-q-title">Nº de pessoas atendidas nas ações de Busca Ativa</div>
              <div class="missao-q-sub">Atendidas nas ações externas</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-busca-pessoas', -1)">-</button>
            <input type="number" id="missao-rep-busca-pessoas" class="missao-step-input ${isBuscaPessoasActive ? 'active-val' : ''}" data-activated="${isBuscaPessoasActive ? 'true' : 'false'}" value="${isBuscaPessoasActive ? buscaAtivaPessoas : ''}" onfocus="activateMissaoInput(this.id)" onclick="activateMissaoInput(this.id)" oninput="activateMissaoInput(this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-busca-pessoas', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- Nº DE DECISÕES POR CRISTO -->
      <div class="missao-q-card" style="border:1.5px solid var(--gold-primary); background:rgba(197, 137, 8, 0.04);">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon" style="background:var(--gold-primary); color:#FFFFFF;">${MISSAO_ICONS.decisoes}</div>
            <div>
              <div class="missao-q-title" style="color:var(--gold-primary);">Nº de decisões por Cristo</div>
              <div class="missao-q-sub">Conversões e reconciliações no dia</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-decisoes', -1)">-</button>
            <input type="number" id="missao-rep-decisoes" class="missao-step-input ${isDecisoesActive ? 'active-val' : ''}" data-activated="${isDecisoesActive ? 'true' : 'false'}" value="${isDecisoesActive ? decisoes : ''}" onfocus="activateMissaoInput(this.id)" onclick="activateMissaoInput(this.id)" oninput="activateMissaoInput(this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustMissaoStep('missao-rep-decisoes', 1)">+</button>
          </div>
        </div>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openMissaoFlow()">Cancelar</button>
      <button type="button" id="btn-save-missao-report" class="btn-primary-action" style="flex:1.5;" onclick="handleSaveMissaoReport()">
        💾 Salvar Relatório
      </button>
    </div>
  `;

  openModal('modal-generic');
}
window.openMissaoForm = openMissaoForm;

// Auxiliares do Formulário da Missão
function onMissaoDateChanged(newDate) {
  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  if (newDate > todayStr) {
    showToast('Não é possível selecionar uma data futura!', 'warning');
    const input = document.getElementById('missao-rep-date');
    if (input) input.value = todayStr;
    newDate = todayStr;
  }
  const label = document.getElementById('missao-date-label');
  if (label) {
    label.textContent = (newDate === todayStr) ? `Hoje (${formatDateBR(newDate)})` : formatDateBR(newDate);
  }
}
window.onMissaoDateChanged = onMissaoDateChanged;

// Ativação de campos numéricos (se estiver vazio preenche 0, fica verde e marca data-activated="true")
function activateMissaoInput(inputId, group) {
  const el = document.getElementById(inputId);
  if (!el) return;

  if (el.value === '' || el.value === undefined || el.value === null) {
    el.value = '0';
  }
  el.classList.add('active-val');
  el.setAttribute('data-activated', 'true');

  if (group) {
    recalcMissaoTotal(group);
  }
}
window.activateMissaoInput = activateMissaoInput;

function adjustMissaoStep(inputId, delta, group) {
  const el = document.getElementById(inputId);
  if (!el) return;

  let val = parseInt(el.value, 10);
  if (isNaN(val) || el.value === '') {
    val = 0;
  }
  val = Math.max(0, val + delta);
  el.value = val;
  el.classList.add('active-val');
  el.setAttribute('data-activated', 'true');

  if (group) {
    recalcMissaoTotal(group);
  }
  if (navigator.vibrate) navigator.vibrate(10);
}
window.adjustMissaoStep = adjustMissaoStep;

function recalcMissaoTotal(group) {
  if (group === 'pessoas') {
    const elRua = document.getElementById('missao-p-rua');
    const elUnid = document.getElementById('missao-p-unidade');
    const elBusca = document.getElementById('missao-p-busca');

    const ruaAct = elRua?.getAttribute('data-activated') === 'true';
    const unidAct = elUnid?.getAttribute('data-activated') === 'true';
    const buscaAct = elBusca?.getAttribute('data-activated') === 'true';
    const allFilled = ruaAct && unidAct && buscaAct;

    const rua = parseInt(elRua?.value, 10) || 0;
    const unid = parseInt(elUnid?.value, 10) || 0;
    const busca = parseInt(elBusca?.value, 10) || 0;

    const totalEl = document.getElementById('missao-total-pessoas');
    if (totalEl) {
      if (allFilled) {
        totalEl.textContent = (rua + unid + busca);
        totalEl.classList.add('active-val');
      } else {
        const partial = (ruaAct ? rua : 0) + (unidAct ? unid : 0) + (buscaAct ? busca : 0);
        totalEl.textContent = (ruaAct || unidAct || buscaAct) ? partial : '-';
        totalEl.classList.remove('active-val');
      }
    }
  } else if (group === 'refeicoes') {
    const elCafe = document.getElementById('missao-r-cafe');
    const elAlmoco = document.getElementById('missao-r-almoco');
    const elLanche = document.getElementById('missao-r-lanche');
    const elJantar = document.getElementById('missao-r-jantar');
    const elBusca = document.getElementById('missao-r-busca');

    const cAct = elCafe?.getAttribute('data-activated') === 'true';
    const aAct = elAlmoco?.getAttribute('data-activated') === 'true';
    const lAct = elLanche?.getAttribute('data-activated') === 'true';
    const jAct = elJantar?.getAttribute('data-activated') === 'true';
    const bAct = elBusca?.getAttribute('data-activated') === 'true';
    const allFilled = cAct && aAct && lAct && jAct && bAct;

    const cafe = parseInt(elCafe?.value, 10) || 0;
    const almoco = parseInt(elAlmoco?.value, 10) || 0;
    const lanche = parseInt(elLanche?.value, 10) || 0;
    const jantar = parseInt(elJantar?.value, 10) || 0;
    const busca = parseInt(elBusca?.value, 10) || 0;

    const totalEl = document.getElementById('missao-total-refeicoes');
    if (totalEl) {
      if (allFilled) {
        totalEl.textContent = (cafe + almoco + lanche + jantar + busca);
        totalEl.classList.add('active-val');
      } else {
        const partial = (cAct ? cafe : 0) + (aAct ? almoco : 0) + (lAct ? lanche : 0) + (jAct ? jantar : 0) + (bAct ? busca : 0);
        totalEl.textContent = (cAct || aAct || lAct || jAct || bAct) ? partial : '-';
        totalEl.classList.remove('active-val');
      }
    }
  }
}
window.recalcMissaoTotal = recalcMissaoTotal;

// 5. Salvamento Oficial do Relatório da Missão
async function handleSaveMissaoReport() {
  const btn = document.getElementById('btn-save-missao-report');
  const dateVal = document.getElementById('missao-rep-date')?.value;
  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  if (!dateVal) {
    showToast('Informe a data do relatório.', 'danger');
    return;
  }
  if (dateVal > todayStr) {
    showToast('Não é permitido salvar relatório com data futura.', 'danger');
    return;
  }

  const pRua = parseInt(document.getElementById('missao-p-rua')?.value, 10) || 0;
  const pUnidade = parseInt(document.getElementById('missao-p-unidade')?.value, 10) || 0;
  const pBusca = parseInt(document.getElementById('missao-p-busca')?.value, 10) || 0;
  const pTotal = pRua + pUnidade + pBusca;

  const rCafe = parseInt(document.getElementById('missao-r-cafe')?.value, 10) || 0;
  const rAlmoco = parseInt(document.getElementById('missao-r-almoco')?.value, 10) || 0;
  const rLanche = parseInt(document.getElementById('missao-r-lanche')?.value, 10) || 0;
  const rJantar = parseInt(document.getElementById('missao-r-jantar')?.value, 10) || 0;
  const rBusca = parseInt(document.getElementById('missao-r-busca')?.value, 10) || 0;

  const banhos = parseInt(document.getElementById('missao-rep-banhos')?.value, 10) || 0;
  const cortes = parseInt(document.getElementById('missao-rep-cortes')?.value, 10) || 0;
  const cultos = parseInt(document.getElementById('missao-rep-cultos')?.value, 10) || 0;
  const buscaAtivaPessoas = parseInt(document.getElementById('missao-rep-busca-pessoas')?.value, 10) || pBusca;
  const decisoes = parseInt(document.getElementById('missao-rep-decisoes')?.value, 10) || 0;
  const reporter = document.getElementById('missao-rep-reporter')?.value.trim() || 'Pr. Marcos Lima';
  const repId = document.getElementById('missao-rep-id')?.value;

  // Bloco Pessoas: só é considerado preenchido se TODOS os campos do bloco estiverem preenchidos (não cinzas)
  const ruaAct = document.getElementById('missao-p-rua')?.getAttribute('data-activated') === 'true';
  const unidAct = document.getElementById('missao-p-unidade')?.getAttribute('data-activated') === 'true';
  const buscaAct = document.getElementById('missao-p-busca')?.getAttribute('data-activated') === 'true';
  const isPessoasComplete = ruaAct && unidAct && buscaAct;

  // Bloco Refeições: só é considerado preenchido se TODOS os campos do bloco estiverem preenchidos (não cinzas)
  const cafeAct = document.getElementById('missao-r-cafe')?.getAttribute('data-activated') === 'true';
  const almocoAct = document.getElementById('missao-r-almoco')?.getAttribute('data-activated') === 'true';
  const lancheAct = document.getElementById('missao-r-lanche')?.getAttribute('data-activated') === 'true';
  const jantarAct = document.getElementById('missao-r-jantar')?.getAttribute('data-activated') === 'true';
  const rBuscaAct = document.getElementById('missao-r-busca')?.getAttribute('data-activated') === 'true';
  const isRefeicoesComplete = cafeAct && almocoAct && lancheAct && jantarAct && rBuscaAct;

  // Campos individuais: preenchidos se o campo foi ativado
  const isBanhosComplete = document.getElementById('missao-rep-banhos')?.getAttribute('data-activated') === 'true';
  const isCortesComplete = document.getElementById('missao-rep-cortes')?.getAttribute('data-activated') === 'true';
  const isCultosComplete = document.getElementById('missao-rep-cultos')?.getAttribute('data-activated') === 'true';
  const isBuscaComplete = document.getElementById('missao-rep-busca-pessoas')?.getAttribute('data-activated') === 'true';
  const isDecisoesComplete = document.getElementById('missao-rep-decisoes')?.getAttribute('data-activated') === 'true';

  const answeredQuestions = {
    pessoas: isPessoasComplete,
    refeicoes: isRefeicoesComplete,
    banhos: isBanhosComplete,
    cortes: isCortesComplete,
    cultos: isCultosComplete,
    buscaAtiva: isBuscaComplete,
    decisoes: isDecisoesComplete
  };

  const answeredSubfields = {
    pRua: ruaAct,
    pUnidade: unidAct,
    pBusca: buscaAct,
    rCafe: cafeAct,
    rAlmoco: almocoAct,
    rLanche: lancheAct,
    rJantar: jantarAct,
    rBusca: rBuscaAct
  };

  const reportData = {
    id: repId || `rep_missao_${dateVal}`,
    unitId: 'missao',
    unitName: 'Missão',
    date: dateVal,
    reporterName: reporter,
    // Compatibilidade com censo geral de residentes
    acolhidosPresentes: pUnidade,
    novasTriagens: pBusca,
    desligamentos: 0,
    pessoasAtendidas: {
      total: pTotal,
      rua: pRua,
      unidade: pUnidade,
      buscaAtiva: pBusca
    },
    refeicoes: {
      cafe: rCafe,
      almoco: rAlmoco,
      lanche: rLanche,
      jantar: rJantar,
      buscaAtiva: rBusca
    },
    banhos: banhos,
    cortesCabelo: cortes,
    cultos: cultos,
    buscaAtivaPessoas: buscaAtivaPessoas,
    decisoesCristo: decisoes,
    answeredQuestions: answeredQuestions,
    answeredSubfields: answeredSubfields,
    status: 'concluido'
  };

  if (btn) btn.disabled = true;
  showLoading('Sincronizando...');

  try {
    await dbManager.saveReport(reportData);
    closeModal('modal-generic');
    showToast(`Relatório da Missão (${formatDateBR(dateVal)}) salvo com sucesso!`, 'success');
    if (navigator.vibrate) navigator.vibrate([15, 40, 15]);
    
    // Atualiza Painel Diário e 7 bolinhas de progresso neon
    if (typeof updateHeroMetrics === 'function') updateHeroMetrics();
    if (typeof updateMissaoDots === 'function') updateMissaoDots();
  } catch (err) {
    showToast('Erro ao salvar relatório: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}
window.handleSaveMissaoReport = handleSaveMissaoReport;

// ==========================================================================
// MÓDULO EXCLUSIVO: TRIAGEM • UNIDADE MISSÃO (ACOLHIMENTO INDIVIDUAL)
// ==========================================================================

let _triagemFilterDate = '';
let _triagemSearchTerm = '';

function openMissaoTriagens(dateFilter = null, searchTerm = '') {
  window._currentScreen = { type: 'missao-triagens' };
  _triagemFilterDate = dateFilter || '';
  _triagemSearchTerm = searchTerm || '';

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openMissaoFlow()" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;" title="Voltar para Unidade Missão">←</button>
      <div class="modal-unit-icon" style="color:var(--gold-primary);">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
      </div>
      <div>
        <h2>Triagens • Missão</h2>
        <p style="font-size:0.75rem;">Fichas e Histórico de Acolhimento</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <!-- Topo da Lista: Botão Nova Triagem -->
    <div class="triagem-top-actions">
      <button type="button" class="btn-primary-action" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="openTriagemForm()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nova Triagem
      </button>
    </div>

    <!-- Barra de Filtros: Pesquisa por Nome e Filtro por Data -->
    <div class="triagem-filter-bar">
      <div class="triagem-filter-row">
        <input 
          type="text" 
          id="triagem-search-input" 
          class="triagem-search-input" 
          placeholder="🔍 Pesquisar por nome..." 
          value="${_triagemSearchTerm}"
          oninput="handleTriagemSearch(this.value)"
        >
      </div>
      <div class="triagem-filter-row">
        <div style="flex:1; display:flex; align-items:center; gap:6px;">
          <label style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Data:</label>
          <input 
            type="date" 
            id="triagem-date-filter" 
            class="triagem-date-filter" 
            value="${_triagemFilterDate}"
            onchange="handleTriagemDateFilter(this.value)"
          >
        </div>
        ${(_triagemFilterDate || _triagemSearchTerm) ? `
          <button type="button" class="btn-filter-clear" onclick="clearTriagemFilters()">Limpar Filtros</button>
        ` : ''}
      </div>
    </div>

    <!-- Lista de Triagens -->
    <div id="triagem-list-container" class="triagem-list">
      <!-- Injetado por renderTriagensList() -->
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-secondary-action" style="width:100%;" onclick="openMissaoFlow()">← Voltar para Missão</button>
  `;

  renderTriagensList();
  openModal('modal-generic');
}
window.openMissaoTriagens = openMissaoTriagens;

function handleTriagemSearch(term) {
  _triagemSearchTerm = term;
  renderTriagensList();
}
window.handleTriagemSearch = handleTriagemSearch;

function handleTriagemDateFilter(dateVal) {
  _triagemFilterDate = dateVal;
  renderTriagensList();
}
window.handleTriagemDateFilter = handleTriagemDateFilter;

function clearTriagemFilters() {
  _triagemFilterDate = '';
  _triagemSearchTerm = '';
  const searchInput = document.getElementById('triagem-search-input');
  const dateInput = document.getElementById('triagem-date-filter');
  if (searchInput) searchInput.value = '';
  if (dateInput) dateInput.value = '';
  renderTriagensList();
}
window.clearTriagemFilters = clearTriagemFilters;

function renderTriagensList() {
  const container = document.getElementById('triagem-list-container');
  if (!container) return;

  let list = dbManager.getTriagens();

  // Filtro por Data
  if (_triagemFilterDate) {
    list = list.filter(t => t.date === _triagemFilterDate);
  }

  // Pesquisa por Nome (case-insensitive)
  if (_triagemSearchTerm) {
    const term = _triagemSearchTerm.trim().toLowerCase();
    list = list.filter(t => (t.nome || '').toLowerCase().includes(term));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 16px; background:var(--bg-main); border-radius:10px; color:var(--text-muted);">
        <p style="font-weight:700; color:var(--text-main); font-size:0.88rem; margin-bottom:4px;">Nenhuma triagem encontrada</p>
        <p style="font-size:0.76rem;">${(_triagemFilterDate || _triagemSearchTerm) ? 'Nenhum acolhido corresponde aos filtros informados.' : 'Nenhuma triagem registrada ainda na Unidade Missão.'}</p>
        <button type="button" class="btn-primary-action" style="margin-top:10px; padding:6px 14px; font-size:0.75rem;" onclick="openTriagemForm()">+ Cadastrar Nova Triagem</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(t => {
    const moradiaBadge = t.moradia === 'rua' 
      ? `<span class="triagem-badge badge-rua">Rua</span>` 
      : `<span class="triagem-badge badge-casa">Casa</span>`;

    const primeiroBadge = t.primeiroAcolhimento 
      ? `<span class="triagem-badge badge-primeiro">1º Acolhimento</span>` 
      : `<span class="triagem-badge badge-retorno">${t.quantasVezes ? t.quantasVezes + 'ª vez' : 'Retorno'}</span>`;

    return `
      <div class="triagem-card" onclick="viewTriagemDetails('${t.id}')" title="Toque para ver a ficha completa">
        <div class="triagem-card-header">
          <span class="triagem-card-name">${t.nome}</span>
          <span class="triagem-card-date">${formatDateBR(t.date)}</span>
        </div>
        <div class="triagem-card-tags">
          ${t.idade ? `<span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">${t.idade} anos</span> •` : ''}
          ${moradiaBadge}
          ${primeiroBadge}
          ${t.demandaSaude ? `<span style="font-size:0.70rem; color:#D32F2F; font-weight:700;">🩺 Saúde</span>` : ''}
          ${t.demandaJuridica ? `<span style="font-size:0.70rem; color:#1976D2; font-weight:700;">⚖️ Jurídico</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
window.renderTriagensList = renderTriagensList;

// Visualização de Dados Completos da Triagem
function viewTriagemDetails(id) {
  const t = dbManager.getTriagemById(id);
  if (!t) {
    showToast('Triagem não encontrada.', 'danger');
    openMissaoTriagens();
    return;
  }

  window._currentScreen = { type: 'missao-triagem-details', triagemId: id };

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openMissaoTriagens('${_triagemFilterDate}', '${_triagemSearchTerm}')" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;" title="Voltar para a lista">←</button>
      <div class="modal-unit-icon" style="color:var(--gold-primary);">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
      </div>
      <div>
        <h2>Ficha de Triagem</h2>
        <p style="font-size:0.75rem;">${t.nome} • ${formatDateBR(t.date)}</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div class="triagem-details-box">
      <div class="triagem-detail-row">
        <span class="triagem-detail-label">Nome Completo do Acolhido</span>
        <span class="triagem-detail-val" style="font-size:1.05rem; font-weight:800; color:var(--green-primary);">${t.nome}</span>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="triagem-detail-row">
          <span class="triagem-detail-label">Data da Triagem</span>
          <span class="triagem-detail-val">${formatDateBR(t.date)}</span>
        </div>
        <div class="triagem-detail-row">
          <span class="triagem-detail-label">Idade</span>
          <span class="triagem-detail-val">${t.idade ? t.idade + ' anos' : 'Não informada'}</span>
        </div>
      </div>

      <div class="triagem-detail-row">
        <span class="triagem-detail-label">Rua ou Casa</span>
        <span class="triagem-detail-val">
          ${t.moradia === 'rua' 
            ? '⛺ Situação de Rua' 
            : (t.moradia === 'casa' ? '🏠 Possui Casa / Família' : (t.moradia || 'Não informado'))}
        </span>
      </div>

      <div class="triagem-detail-row">
        <span class="triagem-detail-label">Tem documentos? Quais?</span>
        <span class="triagem-detail-val">
          ${t.temDocumentos 
            ? `✓ Sim (${t.quaisDocumentos || 'Não especificados'})` 
            : '✗ Não possui documentos'}
        </span>
      </div>

      <div class="triagem-detail-row">
        <span class="triagem-detail-label">Tem alguma demanda de saúde? Qual?</span>
        <span class="triagem-detail-val">
          ${t.demandaSaude 
            ? `🩺 Sim (${t.qualDemandaSaude || 'Não especificada'})` 
            : '✓ Não possui demanda de saúde'}
        </span>
      </div>

      <div class="triagem-detail-row">
        <span class="triagem-detail-label">Tem alguma demanda jurídica?</span>
        <span class="triagem-detail-val">
          ${t.demandaJuridica 
            ? `⚖️ Sim ${t.qualDemandaJuridica ? '(' + t.qualDemandaJuridica + ')' : ''}` 
            : '✓ Não possui demanda jurídica'}
        </span>
      </div>

      <div class="triagem-detail-row">
        <span class="triagem-detail-label">É o primeiro acolhimento na Cristolândia?</span>
        <span class="triagem-detail-val">
          ${t.primeiroAcolhimento 
            ? '✓ Sim (Primeira vez na Cristolândia)' 
            : `Retorno (Já passou ${t.quantasVezes || 'mais de 1'} vez(es))`}
        </span>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openMissaoTriagens('${_triagemFilterDate}', '${_triagemSearchTerm}')">← Voltar</button>
      <button type="button" class="btn-primary-action" style="flex:1.2; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="openTriagemForm('${t.id}')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        Editar Triagem
      </button>
    </div>
  `;
}
window.viewTriagemDetails = viewTriagemDetails;

// Formulário de Cadastro e Edição de Triagem (8 Perguntas Oficiais)
function openTriagemForm(triagemId = null) {
  window._currentScreen = { type: 'missao-triagem-form', triagemId };

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const existing = triagemId ? dbManager.getTriagemById(triagemId) : null;

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const nome = existing ? (existing.nome || '') : '';
  const idade = existing && existing.idade ? existing.idade : '';
  const moradia = existing ? (existing.moradia || 'rua') : 'rua';
  const temDocumentos = existing ? !!existing.temDocumentos : false;
  const quaisDocumentos = existing ? (existing.quaisDocumentos || '') : '';
  const demandaSaude = existing ? !!existing.demandaSaude : false;
  const qualDemandaSaude = existing ? (existing.qualDemandaSaude || '') : '';
  const demandaJuridica = existing ? !!existing.demandaJuridica : false;
  const qualDemandaJuridica = existing ? (existing.qualDemandaJuridica || '') : '';
  const primeiroAcolhimento = existing ? (existing.primeiroAcolhimento !== false) : true;
  const quantasVezes = existing && existing.quantasVezes ? existing.quantasVezes : '';
  const dataTriagem = existing ? (existing.date || todayStr) : todayStr;

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="${triagemId ? `viewTriagemDetails('${triagemId}')` : `openMissaoTriagens('${_triagemFilterDate}', '${_triagemSearchTerm}')`}" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon" style="color:var(--gold-primary);">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </div>
      <div>
        <h2>${triagemId ? 'Editar Triagem' : 'Nova Triagem'}</h2>
        <p style="font-size:0.75rem;">Acolhimento e Cadastro Individual</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="triagem-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:12px;">

      <!-- 1. Nome -->
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label" style="font-weight:700;">Nome Completo: *</label>
        <input type="text" id="trg-nome" class="form-input" value="${nome}" placeholder="Ex: João da Silva" required>
      </div>

      <!-- 2. Idade e Data da Triagem -->
      <div style="display:grid; grid-template-columns: 1fr 1.3fr; gap:8px;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-weight:700;">Idade:</label>
          <input type="number" id="trg-idade" class="form-input" value="${idade}" placeholder="Ex: 38" min="0" max="120">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-weight:700;">Data da Triagem:</label>
          <input type="date" id="trg-date" class="form-input" value="${dataTriagem}" required>
        </div>
      </div>

      <!-- 3. Rua ou Casa -->
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label" style="font-weight:700;">Rua ou Casa:</label>
        <div class="form-radio-pills">
          <label class="radio-pill-label">
            <input type="radio" name="trg-moradia" value="rua" ${moradia === 'rua' ? 'checked' : ''}>
            ⛺ Rua
          </label>
          <label class="radio-pill-label">
            <input type="radio" name="trg-moradia" value="casa" ${moradia === 'casa' ? 'checked' : ''}>
            🏠 Casa
          </label>
        </div>
      </div>

      <!-- 4. Tem documentos? Quais? -->
      <div class="form-group" style="margin-bottom:0; background:var(--bg-main); padding:10px; border-radius:10px; border:1px solid var(--border-beige);">
        <label class="form-label" style="font-weight:700;">Tem documentos?</label>
        <div class="form-radio-pills" style="margin-bottom:8px;">
          <label class="radio-pill-label">
            <input type="radio" name="trg-tem-docs" value="sim" ${temDocumentos ? 'checked' : ''} onchange="toggleTriagemField('trg-quais-docs-box', true)">
            Sim
          </label>
          <label class="radio-pill-label">
            <input type="radio" name="trg-tem-docs" value="nao" ${!temDocumentos ? 'checked' : ''} onchange="toggleTriagemField('trg-quais-docs-box', false)">
            Não
          </label>
        </div>
        <div id="trg-quais-docs-box" style="display:${temDocumentos ? 'block' : 'none'};">
          <label class="form-label" style="font-size:0.74rem;">Quais documentos?</label>
          <input type="text" id="trg-quais-docs" class="form-input" value="${quaisDocumentos}" placeholder="Ex: RG, CPF, Certidão de Nascimento">
        </div>
      </div>

      <!-- 5. Tem alguma demanda de saúde? Qual? -->
      <div class="form-group" style="margin-bottom:0; background:var(--bg-main); padding:10px; border-radius:10px; border:1px solid var(--border-beige);">
        <label class="form-label" style="font-weight:700;">Tem alguma demanda de saúde?</label>
        <div class="form-radio-pills" style="margin-bottom:8px;">
          <label class="radio-pill-label">
            <input type="radio" name="trg-demanda-saude" value="sim" ${demandaSaude ? 'checked' : ''} onchange="toggleTriagemField('trg-qual-saude-box', true)">
            Sim
          </label>
          <label class="radio-pill-label">
            <input type="radio" name="trg-demanda-saude" value="nao" ${!demandaSaude ? 'checked' : ''} onchange="toggleTriagemField('trg-qual-saude-box', false)">
            Não
          </label>
        </div>
        <div id="trg-qual-saude-box" style="display:${demandaSaude ? 'block' : 'none'};">
          <label class="form-label" style="font-size:0.74rem;">Qual demanda de saúde?</label>
          <input type="text" id="trg-qual-saude" class="form-input" value="${qualDemandaSaude}" placeholder="Ex: Hipertensão, curativo, medicação controlada">
        </div>
      </div>

      <!-- 6. Tem alguma demanda jurídica? -->
      <div class="form-group" style="margin-bottom:0; background:var(--bg-main); padding:10px; border-radius:10px; border:1px solid var(--border-beige);">
        <label class="form-label" style="font-weight:700;">Tem alguma demanda jurídica?</label>
        <div class="form-radio-pills" style="margin-bottom:8px;">
          <label class="radio-pill-label">
            <input type="radio" name="trg-demanda-juridica" value="sim" ${demandaJuridica ? 'checked' : ''} onchange="toggleTriagemField('trg-qual-juridica-box', true)">
            Sim
          </label>
          <label class="radio-pill-label">
            <input type="radio" name="trg-demanda-juridica" value="nao" ${!demandaJuridica ? 'checked' : ''} onchange="toggleTriagemField('trg-qual-juridica-box', false)">
            Não
          </label>
        </div>
        <div id="trg-qual-juridica-box" style="display:${demandaJuridica ? 'block' : 'none'};">
          <label class="form-label" style="font-size:0.74rem;">Qual demanda jurídica?</label>
          <input type="text" id="trg-qual-juridica" class="form-input" value="${qualDemandaJuridica}" placeholder="Ex: Processo em andamento, certidão de antecedentes">
        </div>
      </div>

      <!-- 7 & 8. Primeiro acolhimento e passagens anteriores -->
      <div class="form-group" style="margin-bottom:0; background:var(--bg-main); padding:10px; border-radius:10px; border:1px solid var(--border-beige);">
        <label class="form-label" style="font-weight:700;">É o primeiro acolhimento na Cristolândia?</label>
        <div class="form-radio-pills" style="margin-bottom:8px;">
          <label class="radio-pill-label">
            <input type="radio" name="trg-primeiro" value="sim" ${primeiroAcolhimento ? 'checked' : ''} onchange="toggleTriagemField('trg-quantas-vezes-box', false)">
            Sim
          </label>
          <label class="radio-pill-label">
            <input type="radio" name="trg-primeiro" value="nao" ${!primeiroAcolhimento ? 'checked' : ''} onchange="toggleTriagemField('trg-quantas-vezes-box', true)">
            Não
          </label>
        </div>
        <div id="trg-quantas-vezes-box" style="display:${!primeiroAcolhimento ? 'block' : 'none'};">
          <label class="form-label" style="font-size:0.74rem;">Se não, quantas vezes já passou?</label>
          <input type="number" id="trg-quantas-vezes" class="form-input" value="${quantasVezes}" placeholder="Ex: 2" min="1">
        </div>
      </div>

    </form>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="${triagemId ? `viewTriagemDetails('${triagemId}')` : `openMissaoTriagens('${_triagemFilterDate}', '${_triagemSearchTerm}')`}">Cancelar</button>
      <button type="button" id="btn-save-triagem" class="btn-primary-action" style="flex:1.5;" onclick="handleSaveTriagem('${triagemId || ''}')">
        Salvar Triagem
      </button>
    </div>
  `;
}
window.openTriagemForm = openTriagemForm;

function toggleTriagemField(elementId, show) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = show ? 'block' : 'none';
}
window.toggleTriagemField = toggleTriagemField;

async function handleSaveTriagem(triagemId) {
  const btn = document.getElementById('btn-save-triagem');
  const nome = document.getElementById('trg-nome')?.value.trim();
  const idadeVal = document.getElementById('trg-idade')?.value.trim();
  const dateVal = document.getElementById('trg-date')?.value || (typeof getLocalDateStr === 'function' ? getLocalDateStr() : new Date().toISOString().split('T')[0]);
  
  if (!nome) {
    showToast('Por favor, informe o nome do acolhido.', 'warning');
    document.getElementById('trg-nome')?.focus();
    return;
  }

  const moradiaEl = document.querySelector('input[name="trg-moradia"]:checked');
  const moradia = moradiaEl ? moradiaEl.value : 'rua';

  const temDocsEl = document.querySelector('input[name="trg-tem-docs"]:checked');
  const temDocumentos = temDocsEl ? (temDocsEl.value === 'sim') : false;
  const quaisDocumentos = temDocumentos ? (document.getElementById('trg-quais-docs')?.value.trim() || '') : '';

  const demandaSaudeEl = document.querySelector('input[name="trg-demanda-saude"]:checked');
  const demandaSaude = demandaSaudeEl ? (demandaSaudeEl.value === 'sim') : false;
  const qualDemandaSaude = demandaSaude ? (document.getElementById('trg-qual-saude')?.value.trim() || '') : '';

  const demandaJuridicaEl = document.querySelector('input[name="trg-demanda-juridica"]:checked');
  const demandaJuridica = demandaJuridicaEl ? (demandaJuridicaEl.value === 'sim') : false;
  const qualDemandaJuridica = demandaJuridica ? (document.getElementById('trg-qual-juridica')?.value.trim() || '') : '';

  const primeiroEl = document.querySelector('input[name="trg-primeiro"]:checked');
  const primeiroAcolhimento = primeiroEl ? (primeiroEl.value === 'sim') : true;
  const quantasVezesVal = !primeiroAcolhimento ? (document.getElementById('trg-quantas-vezes')?.value.trim() || '') : '';

  const triagemData = {
    id: triagemId || undefined,
    unitId: 'missao',
    unitName: 'Missão',
    date: dateVal,
    nome: nome,
    idade: idadeVal ? parseInt(idadeVal, 10) : null,
    moradia: moradia,
    temDocumentos: temDocumentos,
    quaisDocumentos: quaisDocumentos,
    demandaSaude: demandaSaude,
    qualDemandaSaude: qualDemandaSaude,
    demandaJuridica: demandaJuridica,
    qualDemandaJuridica: qualDemandaJuridica,
    primeiroAcolhimento: primeiroAcolhimento,
    quantasVezes: quantasVezesVal ? parseInt(quantasVezesVal, 10) : null
  };

  if (btn) btn.disabled = true;
  showLoading('Salvando triagem...');

  try {
    const saved = await dbManager.saveTriagem(triagemData);
    showToast(`Triagem de ${nome} salva com sucesso!`, 'success');
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);

    // Atualiza Painel Diário (métrica de Triagens)
    if (typeof updateHeroMetrics === 'function') {
      updateHeroMetrics();
    }

    viewTriagemDetails(saved.id);
  } catch (err) {
    console.error('Erro ao salvar triagem:', err);
    showToast('Erro ao salvar triagem: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}
window.handleSaveTriagem = handleSaveTriagem;

// ==========================================================================
// MÓDULO EXCLUSIVO: UNIDADES MACEDÔNIA & FEMININA
// (HISTÓRICO + CALENDÁRIO + NOVO RELATÓRIO COM 12 PERGUNTAS OFICIAIS)
// ==========================================================================

// Ícones SVG de traço limpo na cor verde oficial para cada uma das perguntas
const STANDARD_UNIT_ICONS = {
  data: MISSAO_ICONS.data,
  missionario: MISSAO_ICONS.missionario,
  refeicoes: MISSAO_ICONS.refeicoes,
  sociais: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  saude: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>`,
  psico: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`,
  juridico: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><polyline points="2 7 12 5 22 7"/><path d="M6 7l-4 7h8l-4-7z"/><path d="M18 7l-4 7h8l-4-7z"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`,
  estudos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><line x1="6" y1="8" x2="8" y2="8"/><line x1="6" y1="11" x2="8" y2="11"/></svg>`,
  cultos: MISSAO_ICONS.cultos,
  musica: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  coro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  esporte: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>`,
  acolhidosEsporte: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  decisoes: MISSAO_ICONS.decisoes
};
const MACEDONIA_ICONS = STANDARD_UNIT_ICONS;
const FEMININA_ICONS = STANDARD_UNIT_ICONS;

// 1. Menu de Escolha da Unidade (Histórico vs Novo Relatório)
function openStandardUnitFlow(unitId) {
  const unit = UNIT_PROFILES[unitId] || { name: 'Unidade', fullName: 'Unidade Cristolândia', defaultReporter: 'Missionário' };
  window._currentScreen = { type: `${unitId}-choice`, unitId };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const reports = dbManager.getReports();
  const todayReport = reports.find(r => r.unitId === unitId && r.date === todayStr);

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <div class="modal-unit-icon">
        ${unit.iconSvg || '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="9"/></svg>'}
      </div>
      <div>
        <h2>Unidade ${unit.name}</h2>
        <p style="margin-bottom:2px;">${unit.fullName}</p>
        ${todayReport 
          ? `<span style="display:inline-block; margin-top:2px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Relatório de hoje registrado</span>` 
          : `<span style="display:inline-block; margin-top:2px; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#FFF8E1; color:#C58908;">📝 Relatório de hoje pendente</span>`}
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <div style="text-align:center; margin: 6px 0 14px;">
      <p style="font-size:0.82rem; color:var(--text-muted);">Selecione a ação desejada para o relatório da ${unit.name}:</p>
    </div>

    <div class="missao-choice-grid">
      <!-- Opção 1: Histórico com Calendário Mensal -->
      <div class="btn-choice-card" onclick="openStandardUnitCalendar('${unitId}')">
        <div class="btn-choice-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="btn-choice-title">Histórico</div>
        <div class="btn-choice-desc">Consulta por calendário mensal</div>
      </div>

      <!-- Opção 2: Novo Relatório -->
      <div class="btn-choice-card" onclick="openStandardUnitForm('${unitId}')">
        <div class="btn-choice-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <div class="btn-choice-title">Novo Relatório</div>
        <div class="btn-choice-desc">Preencher o relatório diário</div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-secondary-action" style="width:100%;" onclick="closeModal('modal-generic')">Fechar</button>
  `;

  openModal('modal-generic');
}

// 2. Histórico com Calendário Mensal
let _standardUnitCalYear = {};
let _standardUnitCalMonth = {};

function openStandardUnitCalendar(unitId, targetYear, targetMonth) {
  const unit = UNIT_PROFILES[unitId] || { name: 'Unidade' };
  window._currentScreen = { type: `${unitId}-calendar`, unitId };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const now = new Date();
  if (targetYear === undefined || targetYear === null) {
    _standardUnitCalYear[unitId] = now.getFullYear();
    _standardUnitCalMonth[unitId] = now.getMonth();
  } else {
    _standardUnitCalYear[unitId] = targetYear;
    _standardUnitCalMonth[unitId] = targetMonth;
  }

  const curYear = _standardUnitCalYear[unitId];
  const curMonth = _standardUnitCalMonth[unitId];

  const reports = dbManager.getReports().filter(r => r.unitId === unitId);
  const filledDatesMap = {};
  reports.forEach(r => {
    if (r && r.date) filledDatesMap[r.date] = r;
  });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const firstDayOfWeek = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const prevMonthDays = new Date(curYear, curMonth, 0).getDate();

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStandardUnitFlow('${unitId}')" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div>
        <h2>Histórico ${unit.name}</h2>
        <p style="margin-bottom:2px;">Calendário de Atividades</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  let daysHtml = '';

  // Dias do mês anterior
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    daysHtml += `<div class="calendar-day-btn day-outside">${dayNum}</div>`;
  }

  // Dias do mês atual
  let filledCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayPad = String(day).padStart(2, '0');
    const monthPad = String(curMonth + 1).padStart(2, '0');
    const dateStr = `${curYear}-${monthPad}-${dayPad}`;

    const isFuture = (dateStr > todayStr);
    const isFilled = !isFuture && !!filledDatesMap[dateStr];
    if (isFilled) filledCount++;
    const isToday = (dateStr === todayStr);

    let btnClass = 'day-empty';
    if (isFuture) {
      btnClass = 'day-future';
    } else if (isFilled) {
      btnClass = 'day-filled';
    }
    const todayClass = isToday ? 'day-today' : '';
    const clickFn = isFuture
      ? ''
      : (isFilled ? `viewStandardUnitDayReport('${unitId}', '${dateStr}')` : `openStandardUnitForm('${unitId}', '${dateStr}')`);
    const titleAttr = isFuture
      ? 'Data futura não permitida'
      : (isFilled ? `Relatório preenchido em ${dayPad}/${monthPad}` : `Toque para preencher este dia`);

    daysHtml += `
      <button type="button" 
        class="calendar-day-btn ${btnClass} ${todayClass}" 
        ${isFuture ? 'disabled' : ''}
        ${clickFn ? `onclick="${clickFn}"` : ''} 
        title="${titleAttr}">
        ${day}
      </button>
    `;
  }

  modalBody.innerHTML = `
    <div class="calendar-card">
      <div class="calendar-header-nav">
        <button type="button" class="calendar-nav-btn" onclick="navStandardUnitCalendar('${unitId}', -1)">←</button>
        <div class="calendar-month-title">${monthNames[curMonth]} de ${curYear}</div>
        <button type="button" class="calendar-nav-btn" onclick="navStandardUnitCalendar('${unitId}', 1)">→</button>
      </div>

      <div class="calendar-weekdays">
        <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
      </div>

      <div class="calendar-grid">
        ${daysHtml}
      </div>

      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-dot filled"></span>
          <span>Preenchido</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot empty"></span>
          <span>Não preenchido</span>
        </div>
      </div>
    </div>

    <div style="background:var(--bg-cream); border:1px solid var(--border-beige); border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:0.75rem; color:var(--text-muted);">Relatórios no mês:</span>
      <span style="font-family:var(--font-gothic); font-size:0.85rem; font-weight:800; color:var(--green-primary);">${filledCount} / ${daysInMonth} dias</span>
    </div>

    <div style="margin-top:10px; text-align:center;">
      <span style="font-size:0.72rem; color:var(--text-muted);">Toque em um dia verde para visualizar ou em um dia cinza para registrar.</span>
    </div>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openStandardUnitFlow('${unitId}')">← Voltar</button>
      <button type="button" class="btn-primary-action" style="flex:1;" onclick="openStandardUnitForm('${unitId}')">📝 Novo de Hoje</button>
    </div>
  `;

  openModal('modal-generic');
}

function navStandardUnitCalendar(unitId, delta) {
  let newMonth = (_standardUnitCalMonth[unitId] || 0) + delta;
  let newYear = _standardUnitCalYear[unitId] || new Date().getFullYear();
  if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }
  openStandardUnitCalendar(unitId, newYear, newMonth);
}

// 3. Visualização do Relatório por Data (12 Perguntas)
function viewStandardUnitDayReport(unitId, dateStr) {
  const unit = UNIT_PROFILES[unitId] || { name: 'Unidade', defaultReporter: 'Missionário' };
  window._currentScreen = { type: `${unitId}-view`, unitId, dateStr };
  const reports = dbManager.getReports();
  const r = reports.find(rep => rep.unitId === unitId && rep.date === dateStr);
  if (!r) {
    openStandardUnitForm(unitId, dateStr);
    return;
  }

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const ref = r.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStandardUnitCalendar('${unitId}')" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        ${unit.iconSvg || '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="9"/></svg>'}
      </div>
      <div>
        <h2>Relatório ${unit.name}</h2>
        <p style="margin-bottom:2px;">${formatDateBR(dateStr)} • ${r.reporterName || unit.defaultReporter}</p>
        <span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Relatório Registrado</span>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <!-- Data e Missionário -->
    <div style="background:var(--bg-cream); border:1px solid var(--border-beige); border-radius:12px; padding:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Data do Relatório</span>
        <div style="font-family:var(--font-gothic); font-size:0.95rem; font-weight:800; color:var(--green-primary);">${formatDateBR(dateStr)}</div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Missionário(a)</span>
        <div style="font-family:var(--font-gothic); font-size:0.9rem; font-weight:800; color:var(--text-main);">${r.reporterName || unit.defaultReporter}</div>
      </div>
    </div>

    <!-- Indicadores Numéricos em Cards (12 Perguntas) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
      <!-- 1. Refeições -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px; grid-column: span 2;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.refeicoes}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Refeições Servidas na Unidade</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--gold-primary);">${totalRef}</div>
        <div style="font-size:0.66rem; color:var(--text-muted); line-height:1.3;">
          Café: ${ref.cafe || 0} | Almoço: ${ref.almoco || 0} | Jantar: ${ref.jantar || 0} | Abordagens: ${ref.abordagens || 0} | Eventos: ${ref.eventosEspeciais || 0}
        </div>
      </div>

      <!-- 2. Encaminhamentos Sociais -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.sociais}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Encam. Sociais</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.encaminhamentosSociais || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">CRAS, CREAS, INSS, Docs</div>
      </div>

      <!-- 3. Encaminhamentos de Saúde -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.saude}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Encam. de Saúde</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.encaminhamentosSaude || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Consultas, vacinas, exames</div>
      </div>

      <!-- 4. Atendimentos Psicológicos -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.psico}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Atend. Psicológicos</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.atendimentosPsicologicos || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Sessões & escuta ativa</div>
      </div>

      <!-- 5. Demandas Jurídicas -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.juridico}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Demandas Jurídicas</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.demandasJuridicas || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Advogado, fóruns, varas</div>
      </div>

      <!-- 6. Estudos Bíblicos -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.estudos}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Estudos Bíblicos</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.estudosBiblicos || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Qtd de estudos realizados</div>
      </div>

      <!-- 7. Cultos e Vigílias -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.cultos}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Cultos & Vigílias</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.cultosVigilias || r.cultos || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Momentos de celebração</div>
      </div>

      <!-- 8. Sons da Missão (Oficinas de Instrumentos) -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.musica}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Sons da Missão</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.sonsDaMissao || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Acolhidos nas oficinas</div>
      </div>

      <!-- 9. Ensaios do Coro -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.coro}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Ensaios do Coro</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.ensaiosCoro || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Ensaios realizados</div>
      </div>

      <!-- 10. Atividades Físicas / Esportes Realizados -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.esporte}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Atividades Físicas</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.atividadesFisicas || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Esportes realizados</div>
      </div>

      <!-- 11. Acolhidos nas Atividades Físicas -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-beige); border-radius:12px; padding:10px 12px;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span style="color:var(--green-primary);">${STANDARD_UNIT_ICONS.acolhidosEsporte}</span>
          <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted);">Acolhidos no Esporte</span>
        </div>
        <div style="font-family:var(--font-gothic); font-size:1.4rem; font-weight:800; color:var(--green-primary);">${r.participantesAtividadesFisicas || 0}</div>
        <div style="font-size:0.64rem; color:var(--text-muted);">Acolhidos participantes</div>
      </div>
    </div>

    <!-- 12. Decisões por Cristo em destaque nobre ouro -->
    <div style="background:linear-gradient(135deg, rgba(197, 137, 8, 0.12), rgba(30, 77, 43, 0.08)); border:1.5px solid var(--gold-primary); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--gold-primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center;">
          ${STANDARD_UNIT_ICONS.decisoes}
        </div>
        <div>
          <div style="font-family:var(--font-gothic); font-size:0.9rem; font-weight:800; color:var(--text-main);">Decisões por Cristo</div>
          <div style="font-size:0.68rem; color:var(--text-muted);">Decisões e reconciliações</div>
        </div>
      </div>
      <div style="font-family:var(--font-gothic); font-size:1.8rem; font-weight:900; color:var(--gold-primary);">${r.decisoesCristo || 0}</div>
    </div>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openStandardUnitCalendar('${unitId}')">← Calendário</button>
      <button type="button" class="btn-primary-action" style="flex:1.2;" onclick="openStandardUnitForm('${unitId}', '${dateStr}', true)">✏️ Editar Relatório</button>
    </div>
  `;

  openModal('modal-generic');
}

// 4. Formulário do Relatório (Novo ou Edição com as 12 Perguntas Oficiais)
function openStandardUnitForm(unitId, targetDate, isEdit) {
  const unit = UNIT_PROFILES[unitId] || { name: 'Unidade', defaultReporter: 'Missionário' };
  window._currentScreen = { type: `${unitId}-form`, unitId, targetDate, isEdit };
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const selectedDate = targetDate || todayStr;
  const isToday = (selectedDate === todayStr);

  const reports = dbManager.getReports();
  const existing = reports.find(r => r.unitId === unitId && r.date === selectedDate);

  // Valores pré-carregados
  const reporter = existing ? (r_name => r_name || unit.defaultReporter)(existing.reporterName) : unit.defaultReporter;

  // Detecção de status de ativação prévio
  const ans = existing?.answeredQuestions || {};
  const sub = existing?.answeredSubfields || {};
  const hasAns = !!existing?.answeredQuestions;

  // Bloco Refeições (5 subcampos)
  const isCafeActive = hasAns ? (sub.rCafe ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.cafe === 'number');
  const isAlmocoActive = hasAns ? (sub.rAlmoco ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.almoco === 'number');
  const isJantarActive = hasAns ? (sub.rJantar ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.jantar === 'number');
  const isAbordagensActive = hasAns ? (sub.rAbordagens ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.abordagens === 'number');
  const isEventosActive = hasAns ? (sub.rEventos ?? !!ans.refeicoes) : (!!existing && typeof existing.refeicoes?.eventosEspeciais === 'number');
  const isRefeicoesComplete = isCafeActive && isAlmocoActive && isJantarActive && isAbordagensActive && isEventosActive;

  // Campos individuais (11 restantes)
  const isSociaisActive = hasAns ? !!ans.sociais : (!!existing && (typeof existing.encaminhamentosSociais === 'number' || typeof existing.novasTriagens === 'number'));
  const isSaudeActive = hasAns ? !!ans.saude : (!!existing && typeof existing.encaminhamentosSaude === 'number');
  const isPsicoActive = hasAns ? !!ans.psicologicos : (!!existing && typeof existing.atendimentosPsicologicos === 'number');
  const isJuridicoActive = hasAns ? !!ans.juridicas : (!!existing && typeof existing.demandasJuridicas === 'number');
  const isEstudosActive = hasAns ? !!ans.estudosBiblicos : (!!existing && typeof existing.estudosBiblicos === 'number');
  const isCultosActive = hasAns ? !!ans.cultosVigilias : (!!existing && (typeof existing.cultosVigilias === 'number' || typeof existing.cultos === 'number'));
  const isMusicaActive = hasAns ? !!ans.sonsDaMissao : (!!existing && typeof existing.sonsDaMissao === 'number');
  const isCoroActive = hasAns ? !!ans.ensaiosCoro : (!!existing && typeof existing.ensaiosCoro === 'number');
  const isEsporteActive = hasAns ? !!ans.atividadesFisicas : (!!existing && typeof existing.atividadesFisicas === 'number');
  const isAcolhidosEsporteActive = hasAns ? !!ans.participantesAtividadesFisicas : (!!existing && typeof existing.participantesAtividadesFisicas === 'number');
  const isDecisoesActive = hasAns ? !!ans.decisoes : (!!existing && typeof existing.decisoesCristo === 'number');

  // Valores numéricos carregados
  const ref = existing?.refeicoes || {};
  const rCafe = ref.cafe ?? 0;
  const rAlmoco = ref.almoco ?? 0;
  const rJantar = ref.jantar ?? 0;
  const rAbordagens = ref.abordagens ?? 0;
  const rEventos = ref.eventosEspeciais ?? 0;
  const rTotal = rCafe + rAlmoco + rJantar + rAbordagens + rEventos;

  const sociais = existing?.encaminhamentosSociais ?? existing?.novasTriagens ?? 0;
  const saude = existing?.encaminhamentosSaude ?? 0;
  const psico = existing?.atendimentosPsicologicos ?? 0;
  const juridico = existing?.demandasJuridicas ?? 0;
  const estudos = existing?.estudosBiblicos ?? 0;
  const cultos = existing?.cultosVigilias ?? existing?.cultos ?? 0;
  const musica = existing?.sonsDaMissao ?? 0;
  const coro = existing?.ensaiosCoro ?? 0;
  const esporte = existing?.atividadesFisicas ?? 0;
  const acolhidosEsporte = existing?.participantesAtividadesFisicas ?? 0;
  const decisoes = existing?.decisoesCristo ?? 0;

  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStandardUnitFlow('${unitId}')" style="width:32px;height:32px;font-size:0.95rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        ${unit.iconSvg || '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="9"/></svg>'}
      </div>
      <div>
        <h2>${existing ? 'Editar' : 'Preencher'} ${unit.name}</h2>
        <p style="margin-bottom:2px;">${isToday ? 'Relatório de Hoje' : 'Relatório de ' + formatDateBR(selectedDate)}</p>
        ${existing 
          ? `<span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#E8F5E9; color:#1E4D2B;">✓ Modo de edição</span>`
          : `<span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:700; background:#FFF8E1; color:#C58908;">📝 Novo preenchimento</span>`}
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="${unitId}-report-form" onsubmit="event.preventDefault();">
      <input type="hidden" id="${unitId}-rep-id" value="${existing ? existing.id : ''}">

      <!-- DATA -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${STANDARD_UNIT_ICONS.data}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Data</div>
            <div class="missao-q-sub">Padrão "Hoje" ou toque no calendário para alterar</div>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <div style="flex:1; background:var(--bg-cream); border:1.5px solid var(--border-beige); border-radius:10px; padding:8px 12px; display:flex; align-items:center; justify-content:space-between;">
            <span style="font-family:var(--font-gothic); font-weight:800; color:var(--green-primary); font-size:0.95rem;" id="${unitId}-date-label">
              ${isToday ? `Hoje (${formatDateBR(selectedDate)})` : formatDateBR(selectedDate)}
            </span>
            <input type="date" id="${unitId}-rep-date" value="${selectedDate}" max="${todayStr}" class="form-input" style="width:auto; padding:4px 8px; font-size:0.8rem;" onchange="onStandardUnitDateChanged('${unitId}', this.value)">
          </div>
        </div>
      </div>

      <!-- MISSIONÁRIO -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${STANDARD_UNIT_ICONS.missionario}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">${unitId === 'feminina' ? 'Missionária' : 'Missionário'}</div>
          </div>
        </div>
        <input type="text" id="${unitId}-rep-reporter" class="form-input" value="${reporter}" placeholder="Ex: ${unit.defaultReporter}" required>
      </div>

      <!-- 1. Nº REFEIÇÕES SERVIDAS NA UNIDADE -->
      <div class="missao-q-card">
        <div class="missao-q-header">
          <div class="missao-q-icon">${STANDARD_UNIT_ICONS.refeicoes}</div>
          <div class="missao-q-title-box">
            <div class="missao-q-title">Nº Refeições servidas na unidade</div>
            <div class="missao-q-sub">Contabilizar café da manhã, almoço, jantar, abordagens de rua e eventos especiais - de todas as fases; considerar usuários, equipe e voluntários</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">TOTAL</span>
            <div class="missao-total-val ${isRefeicoesComplete ? 'active-val' : ''}" id="${unitId}-total-refeicoes">${isRefeicoesComplete ? rTotal : '-'}</div>
          </div>
        </div>

        <div class="missao-sub-grid">
          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Café da Manhã</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-cafe', -1, 'refeicoes')">-</button>
              <input type="number" id="${unitId}-r-cafe" class="missao-step-input ${isCafeActive ? 'active-val' : ''}" data-activated="${isCafeActive ? 'true' : 'false'}" value="${isCafeActive ? rCafe : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" onclick="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" oninput="activateStandardUnitInput('${unitId}', this.id, 'refeicoes'); recalcStandardUnitTotal('${unitId}', 'refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-cafe', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Almoço</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-almoco', -1, 'refeicoes')">-</button>
              <input type="number" id="${unitId}-r-almoco" class="missao-step-input ${isAlmocoActive ? 'active-val' : ''}" data-activated="${isAlmocoActive ? 'true' : 'false'}" value="${isAlmocoActive ? rAlmoco : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" onclick="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" oninput="activateStandardUnitInput('${unitId}', this.id, 'refeicoes'); recalcStandardUnitTotal('${unitId}', 'refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-almoco', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Jantar</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-jantar', -1, 'refeicoes')">-</button>
              <input type="number" id="${unitId}-r-jantar" class="missao-step-input ${isJantarActive ? 'active-val' : ''}" data-activated="${isJantarActive ? 'true' : 'false'}" value="${isJantarActive ? rJantar : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" onclick="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" oninput="activateStandardUnitInput('${unitId}', this.id, 'refeicoes'); recalcStandardUnitTotal('${unitId}', 'refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-jantar', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item">
            <div class="missao-sub-item-header"><span>Abordagens de Rua</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-abordagens', -1, 'refeicoes')">-</button>
              <input type="number" id="${unitId}-r-abordagens" class="missao-step-input ${isAbordagensActive ? 'active-val' : ''}" data-activated="${isAbordagensActive ? 'true' : 'false'}" value="${isAbordagensActive ? rAbordagens : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" onclick="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" oninput="activateStandardUnitInput('${unitId}', this.id, 'refeicoes'); recalcStandardUnitTotal('${unitId}', 'refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-abordagens', 1, 'refeicoes')">+</button>
            </div>
          </div>

          <div class="missao-sub-item" style="grid-column: span 2;">
            <div class="missao-sub-item-header"><span>Eventos Especiais</span></div>
            <div class="missao-stepper-controls" style="justify-content:center;">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-eventos', -1, 'refeicoes')">-</button>
              <input type="number" id="${unitId}-r-eventos" class="missao-step-input ${isEventosActive ? 'active-val' : ''}" data-activated="${isEventosActive ? 'true' : 'false'}" value="${isEventosActive ? rEventos : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" onclick="activateStandardUnitInput('${unitId}', this.id, 'refeicoes')" oninput="activateStandardUnitInput('${unitId}', this.id, 'refeicoes'); recalcStandardUnitTotal('${unitId}', 'refeicoes')">
              <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-r-eventos', 1, 'refeicoes')">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Nº ENCAMINHAMENTOS SOCIAIS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.sociais}</div>
            <div>
              <div class="missao-q-title">Nº Encaminhamentos Sociais</div>
              <div class="missao-q-sub">CRAS, CREAS, INSS, DETRAN, emissão de documentos e outros</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-sociais', -1)">-</button>
            <input type="number" id="${unitId}-rep-sociais" class="missao-step-input ${isSociaisActive ? 'active-val' : ''}" data-activated="${isSociaisActive ? 'true' : 'false'}" value="${isSociaisActive ? sociais : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-sociais', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 3. Nº ENCAMINHAMENTOS DE SAÚDE -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.saude}</div>
            <div>
              <div class="missao-q-title">Nº Encaminhamentos de saúde</div>
              <div class="missao-q-sub">Consultas médicas e odontológicas, vacinas, exames e outros</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-saude', -1)">-</button>
            <input type="number" id="${unitId}-rep-saude" class="missao-step-input ${isSaudeActive ? 'active-val' : ''}" data-activated="${isSaudeActive ? 'true' : 'false'}" value="${isSaudeActive ? saude : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-saude', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 4. Nº ATENDIMENTOS PSICOLÓGICOS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.psico}</div>
            <div>
              <div class="missao-q-title">Nº Atendimentos Psicológicos</div>
              <div class="missao-q-sub">Atendimentos e acompanhamentos psicológicos na unidade</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-psico', -1)">-</button>
            <input type="number" id="${unitId}-rep-psico" class="missao-step-input ${isPsicoActive ? 'active-val' : ''}" data-activated="${isPsicoActive ? 'true' : 'false'}" value="${isPsicoActive ? psico : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-psico', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 5. Nº DE DEMANDAS JURÍDICAS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.juridico}</div>
            <div>
              <div class="missao-q-title">Nº de demandas jurídicas</div>
              <div class="missao-q-sub">Atendimento com advogado presencial ou online, idas a fóruns, varas e outros departamentos da justiça</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-juridico', -1)">-</button>
            <input type="number" id="${unitId}-rep-juridico" class="missao-step-input ${isJuridicoActive ? 'active-val' : ''}" data-activated="${isJuridicoActive ? 'true' : 'false'}" value="${isJuridicoActive ? juridico : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-juridico', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 6. Nº ESTUDOS BÍBLICOS REALIZADOS NA UNIDADE -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.estudos}</div>
            <div>
              <div class="missao-q-title">Nº Estudos Bíblicos realizados na unidade</div>
              <div class="missao-q-sub">Contabilizar a quantidade de estudos realizados e não o número de pessoas que participaram dos estudos bíblicos</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-estudos', -1)">-</button>
            <input type="number" id="${unitId}-rep-estudos" class="missao-step-input ${isEstudosActive ? 'active-val' : ''}" data-activated="${isEstudosActive ? 'true' : 'false'}" value="${isEstudosActive ? estudos : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-estudos', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 7. Nº CULTOS E VIGÍLIAS REALIZADAS NA UNIDADE -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.cultos}</div>
            <div>
              <div class="missao-q-title">Nº Cultos e Vigílias realizadas na unidade</div>
              <div class="missao-q-sub">Cultos, vigílias e celebrações espirituais</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-cultos', -1)">-</button>
            <input type="number" id="${unitId}-rep-cultos" class="missao-step-input ${isCultosActive ? 'active-val' : ''}" data-activated="${isCultosActive ? 'true' : 'false'}" value="${isCultosActive ? cultos : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-cultos', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 8. Nº DE ACOLHIDOS QUE PARTICIPARAM DAS OFICINAS DE INSTRUMENTOS SONS DA MISSÃO -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.musica}</div>
            <div>
              <div class="missao-q-title">Nº de acolhidos que participaram das oficinas de instrumentos musicais do Sons da Missão</div>
              <div class="missao-q-sub">Oficinas de música e prática instrumental</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-musica', -1)">-</button>
            <input type="number" id="${unitId}-rep-musica" class="missao-step-input ${isMusicaActive ? 'active-val' : ''}" data-activated="${isMusicaActive ? 'true' : 'false'}" value="${isMusicaActive ? musica : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-musica', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 9. Nº DE ENSAIOS DO CORO -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.coro}</div>
            <div>
              <div class="missao-q-title">Nº de ensaios do coro</div>
              <div class="missao-q-sub">Ensaios do coro e grupo vocal da unidade</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-coro', -1)">-</button>
            <input type="number" id="${unitId}-rep-coro" class="missao-step-input ${isCoroActive ? 'active-val' : ''}" data-activated="${isCoroActive ? 'true' : 'false'}" value="${isCoroActive ? coro : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-coro', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 10. Nº DE ATIVIDADES FÍSICAS/ESPORTES FORAM REALIZADAS -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.esporte}</div>
            <div>
              <div class="missao-q-title">Nº de atividades físicas/esportes foram realizadas</div>
              <div class="missao-q-sub">Treinos, partidas e atividades esportivas na unidade</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-esporte', -1)">-</button>
            <input type="number" id="${unitId}-rep-esporte" class="missao-step-input ${isEsporteActive ? 'active-val' : ''}" data-activated="${isEsporteActive ? 'true' : 'false'}" value="${isEsporteActive ? esporte : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-esporte', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 11. Nº DE ACOLHIDOS PARTICIPARAM DAS ATIVIDADES FÍSICAS/ESPORTES -->
      <div class="missao-q-card">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon">${STANDARD_UNIT_ICONS.acolhidosEsporte}</div>
            <div>
              <div class="missao-q-title">Nº de acolhidos participaram das atividades físicas/esportes</div>
              <div class="missao-q-sub">Quantidade total de acolhidos participantes</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-acolhidos-esporte', -1)">-</button>
            <input type="number" id="${unitId}-rep-acolhidos-esporte" class="missao-step-input ${isAcolhidosEsporteActive ? 'active-val' : ''}" data-activated="${isAcolhidosEsporteActive ? 'true' : 'false'}" value="${isAcolhidosEsporteActive ? acolhidosEsporte : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-acolhidos-esporte', 1)">+</button>
          </div>
        </div>
      </div>

      <!-- 12. Nº DECISÕES POR CRISTO -->
      <div class="missao-q-card" style="border:1.5px solid var(--gold-primary); background:rgba(197, 137, 8, 0.04);">
        <div class="missao-stepper-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="missao-q-icon" style="background:var(--gold-primary); color:#FFFFFF;">${STANDARD_UNIT_ICONS.decisoes}</div>
            <div>
              <div class="missao-q-title" style="color:var(--gold-primary);">Nº Decisões por Cristo</div>
              <div class="missao-q-sub">Contabilizar decisões e reconciliações</div>
            </div>
          </div>
          <div class="missao-stepper-controls">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-decisoes', -1)">-</button>
            <input type="number" id="${unitId}-rep-decisoes" class="missao-step-input ${isDecisoesActive ? 'active-val' : ''}" data-activated="${isDecisoesActive ? 'true' : 'false'}" value="${isDecisoesActive ? decisoes : ''}" onfocus="activateStandardUnitInput('${unitId}', this.id)" onclick="activateStandardUnitInput('${unitId}', this.id)" oninput="activateStandardUnitInput('${unitId}', this.id)">
            <button type="button" class="btn-missao-step" onclick="adjustStandardUnitStep('${unitId}', '${unitId}-rep-decisoes', 1)">+</button>
          </div>
        </div>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <div style="display:flex; gap:8px; width:100%;">
      <button type="button" class="btn-secondary-action" style="flex:1;" onclick="openStandardUnitFlow('${unitId}')">Cancelar</button>
      <button type="button" id="btn-save-${unitId}-report" class="btn-primary-action" style="flex:1.5;" onclick="handleSaveStandardUnitReport('${unitId}')">
        💾 Salvar Relatório
      </button>
    </div>
  `;

  openModal('modal-generic');
}

// Funções de Interação e Steppers
function onStandardUnitDateChanged(unitId, newDate) {
  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  if (newDate > todayStr) {
    showToast('Não é possível selecionar uma data futura!', 'warning');
    const input = document.getElementById(`${unitId}-rep-date`);
    if (input) input.value = todayStr;
    newDate = todayStr;
  }
  const label = document.getElementById(`${unitId}-date-label`);
  if (label) {
    label.textContent = (newDate === todayStr) ? `Hoje (${formatDateBR(newDate)})` : formatDateBR(newDate);
  }
}

function activateStandardUnitInput(unitId, inputId, group) {
  const el = document.getElementById(inputId);
  if (!el) return;

  if (el.value === '' || el.value === undefined || el.value === null) {
    el.value = '0';
  }
  el.classList.add('active-val');
  el.setAttribute('data-activated', 'true');

  if (group) {
    recalcStandardUnitTotal(unitId, group);
  }
}

function adjustStandardUnitStep(unitId, inputId, delta, group) {
  const el = document.getElementById(inputId);
  if (!el) return;

  let val = parseInt(el.value, 10);
  if (isNaN(val) || el.value === '') {
    val = 0;
  }
  val = Math.max(0, val + delta);
  el.value = val;
  el.classList.add('active-val');
  el.setAttribute('data-activated', 'true');

  if (group) {
    recalcStandardUnitTotal(unitId, group);
  }
  if (navigator.vibrate) navigator.vibrate(10);
}

function recalcStandardUnitTotal(unitId, group) {
  if (group === 'refeicoes') {
    const elCafe = document.getElementById(`${unitId}-r-cafe`);
    const elAlmoco = document.getElementById(`${unitId}-r-almoco`);
    const elJantar = document.getElementById(`${unitId}-r-jantar`);
    const elAbordagens = document.getElementById(`${unitId}-r-abordagens`);
    const elEventos = document.getElementById(`${unitId}-r-eventos`);

    const cAct = elCafe?.getAttribute('data-activated') === 'true';
    const aAct = elAlmoco?.getAttribute('data-activated') === 'true';
    const jAct = elJantar?.getAttribute('data-activated') === 'true';
    const abAct = elAbordagens?.getAttribute('data-activated') === 'true';
    const evAct = elEventos?.getAttribute('data-activated') === 'true';
    const allFilled = cAct && aAct && jAct && abAct && evAct;

    const cafe = parseInt(elCafe?.value, 10) || 0;
    const almoco = parseInt(elAlmoco?.value, 10) || 0;
    const jantar = parseInt(elJantar?.value, 10) || 0;
    const abordagens = parseInt(elAbordagens?.value, 10) || 0;
    const eventos = parseInt(elEventos?.value, 10) || 0;

    const totalEl = document.getElementById(`${unitId}-total-refeicoes`);
    if (totalEl) {
      if (allFilled) {
        totalEl.textContent = (cafe + almoco + jantar + abordagens + eventos);
        totalEl.classList.add('active-val');
      } else {
        const partial = (cAct ? cafe : 0) + (aAct ? almoco : 0) + (jAct ? jantar : 0) + (abAct ? abordagens : 0) + (evAct ? eventos : 0);
        totalEl.textContent = (cAct || aAct || jAct || abAct || evAct) ? partial : '-';
        totalEl.classList.remove('active-val');
      }
    }
  }
}

// 5. Salvamento Oficial do Relatório da Unidade (12 Perguntas)
async function handleSaveStandardUnitReport(unitId) {
  const unit = UNIT_PROFILES[unitId] || { name: 'Unidade', defaultReporter: 'Missionário' };
  const btn = document.getElementById(`btn-save-${unitId}-report`);
  const dateVal = document.getElementById(`${unitId}-rep-date`)?.value;
  const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  if (!dateVal) {
    showToast('Informe a data do relatório.', 'danger');
    return;
  }
  if (dateVal > todayStr) {
    showToast('Não é permitido salvar relatório com data futura.', 'danger');
    return;
  }

  const rCafe = parseInt(document.getElementById(`${unitId}-r-cafe`)?.value, 10) || 0;
  const rAlmoco = parseInt(document.getElementById(`${unitId}-r-almoco`)?.value, 10) || 0;
  const rJantar = parseInt(document.getElementById(`${unitId}-r-jantar`)?.value, 10) || 0;
  const rAbordagens = parseInt(document.getElementById(`${unitId}-r-abordagens`)?.value, 10) || 0;
  const rEventos = parseInt(document.getElementById(`${unitId}-r-eventos`)?.value, 10) || 0;

  const sociais = parseInt(document.getElementById(`${unitId}-rep-sociais`)?.value, 10) || 0;
  const saude = parseInt(document.getElementById(`${unitId}-rep-saude`)?.value, 10) || 0;
  const psico = parseInt(document.getElementById(`${unitId}-rep-psico`)?.value, 10) || 0;
  const juridico = parseInt(document.getElementById(`${unitId}-rep-juridico`)?.value, 10) || 0;
  const estudos = parseInt(document.getElementById(`${unitId}-rep-estudos`)?.value, 10) || 0;
  const cultos = parseInt(document.getElementById(`${unitId}-rep-cultos`)?.value, 10) || 0;
  const musica = parseInt(document.getElementById(`${unitId}-rep-musica`)?.value, 10) || 0;
  const coro = parseInt(document.getElementById(`${unitId}-rep-coro`)?.value, 10) || 0;
  const esporte = parseInt(document.getElementById(`${unitId}-rep-esporte`)?.value, 10) || 0;
  const acolhidosEsporte = parseInt(document.getElementById(`${unitId}-rep-acolhidos-esporte`)?.value, 10) || 0;
  const decisoes = parseInt(document.getElementById(`${unitId}-rep-decisoes`)?.value, 10) || 0;
  const reporter = document.getElementById(`${unitId}-rep-reporter`)?.value.trim() || unit.defaultReporter;
  const repId = document.getElementById(`${unitId}-rep-id`)?.value;

  // Bloco Refeições: só é considerado preenchido se TODOS os 5 subcampos forem ativados
  const cafeAct = document.getElementById(`${unitId}-r-cafe`)?.getAttribute('data-activated') === 'true';
  const almocoAct = document.getElementById(`${unitId}-r-almoco`)?.getAttribute('data-activated') === 'true';
  const jantarAct = document.getElementById(`${unitId}-r-jantar`)?.getAttribute('data-activated') === 'true';
  const abordagensAct = document.getElementById(`${unitId}-r-abordagens`)?.getAttribute('data-activated') === 'true';
  const eventosAct = document.getElementById(`${unitId}-r-eventos`)?.getAttribute('data-activated') === 'true';
  const isRefeicoesComplete = cafeAct && almocoAct && jantarAct && abordagensAct && eventosAct;

  // Campos individuais (11 restantes)
  const isSociaisComplete = document.getElementById(`${unitId}-rep-sociais`)?.getAttribute('data-activated') === 'true';
  const isSaudeComplete = document.getElementById(`${unitId}-rep-saude`)?.getAttribute('data-activated') === 'true';
  const isPsicoComplete = document.getElementById(`${unitId}-rep-psico`)?.getAttribute('data-activated') === 'true';
  const isJuridicoComplete = document.getElementById(`${unitId}-rep-juridico`)?.getAttribute('data-activated') === 'true';
  const isEstudosComplete = document.getElementById(`${unitId}-rep-estudos`)?.getAttribute('data-activated') === 'true';
  const isCultosComplete = document.getElementById(`${unitId}-rep-cultos`)?.getAttribute('data-activated') === 'true';
  const isMusicaComplete = document.getElementById(`${unitId}-rep-musica`)?.getAttribute('data-activated') === 'true';
  const isCoroComplete = document.getElementById(`${unitId}-rep-coro`)?.getAttribute('data-activated') === 'true';
  const isEsporteComplete = document.getElementById(`${unitId}-rep-esporte`)?.getAttribute('data-activated') === 'true';
  const isAcolhidosEsporteComplete = document.getElementById(`${unitId}-rep-acolhidos-esporte`)?.getAttribute('data-activated') === 'true';
  const isDecisoesComplete = document.getElementById(`${unitId}-rep-decisoes`)?.getAttribute('data-activated') === 'true';

  const answeredQuestions = {
    refeicoes: isRefeicoesComplete,
    sociais: isSociaisComplete,
    saude: isSaudeComplete,
    psicologicos: isPsicoComplete,
    juridicas: isJuridicoComplete,
    estudosBiblicos: isEstudosComplete,
    cultosVigilias: isCultosComplete,
    sonsDaMissao: isMusicaComplete,
    ensaiosCoro: isCoroComplete,
    atividadesFisicas: isEsporteComplete,
    participantesAtividadesFisicas: isAcolhidosEsporteComplete,
    decisoes: isDecisoesComplete
  };

  const answeredSubfields = {
    rCafe: cafeAct,
    rAlmoco: almocoAct,
    rJantar: jantarAct,
    rAbordagens: abordagensAct,
    rEventos: eventosAct
  };

  // Mantém acolhidosPresentes herdado ou padrão da unidade para integridade do censo geral
  const existingRep = dbManager.getReports().find(r => r.unitId === unitId && r.date === dateVal);
  const defAcolhidos = (unitId === 'macedonia' ? 60 : unitId === 'feminina' ? 30 : 45);
  const acolhidosPresentes = (existingRep && typeof existingRep.acolhidosPresentes === 'number') ? existingRep.acolhidosPresentes : defAcolhidos;

  const reportData = {
    id: repId || `rep_${unitId}_${dateVal}`,
    unitId: unitId,
    unitName: unit.name,
    date: dateVal,
    reporterName: reporter,
    acolhidosPresentes: acolhidosPresentes,
    novasTriagens: sociais,
    desligamentos: 0,
    refeicoes: {
      cafe: rCafe,
      almoco: rAlmoco,
      jantar: rJantar,
      abordagens: rAbordagens,
      eventosEspeciais: rEventos
    },
    encaminhamentosSociais: sociais,
    encaminhamentosSaude: saude,
    atendimentosPsicologicos: psico,
    demandasJuridicas: juridico,
    estudosBiblicos: estudos,
    cultosVigilias: cultos,
    cultos: cultos,
    sonsDaMissao: musica,
    ensaiosCoro: coro,
    atividadesFisicas: esporte,
    participantesAtividadesFisicas: acolhidosEsporte,
    decisoesCristo: decisoes,
    answeredQuestions: answeredQuestions,
    answeredSubfields: answeredSubfields,
    status: 'concluido'
  };

  if (btn) btn.disabled = true;
  showLoading('Sincronizando...');

  try {
    await dbManager.saveReport(reportData);
    closeModal('modal-generic');
    showToast(`Relatório da ${unit.name} (${formatDateBR(dateVal)}) salvo com sucesso!`, 'success');
    if (navigator.vibrate) navigator.vibrate([15, 40, 15]);
    
    // Atualiza Painel Diário e bolinhas de progresso neon
    if (typeof updateHeroMetrics === 'function') updateHeroMetrics();
    if (unitId === 'macedonia' && typeof updateMacedoniaDots === 'function') updateMacedoniaDots();
    if (unitId === 'feminina' && typeof updateFemininaDots === 'function') updateFemininaDots();
  } catch (err) {
    showToast('Erro ao salvar relatório: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}

// Aliases e Exportações Globais
window.openMacedoniaFlow = () => openStandardUnitFlow('macedonia');
window.openFemininaFlow = () => openStandardUnitFlow('feminina');
window.openStandardUnitFlow = openStandardUnitFlow;
window.openStandardUnitCalendar = openStandardUnitCalendar;
window.navStandardUnitCalendar = navStandardUnitCalendar;
window.viewStandardUnitDayReport = viewStandardUnitDayReport;
window.openStandardUnitForm = openStandardUnitForm;
window.onStandardUnitDateChanged = onStandardUnitDateChanged;
window.activateStandardUnitInput = activateStandardUnitInput;
window.adjustStandardUnitStep = adjustStandardUnitStep;
window.recalcStandardUnitTotal = recalcStandardUnitTotal;
window.handleSaveStandardUnitReport = handleSaveStandardUnitReport;

// --- MÓDULOS DE UNIDADE (MISSÃO, MACEDÔNIA, FEMININA) ---
function openUnitReportModal(unitId) {
  if (unitId === 'missao') {
    openMissaoFlow();
    return;
  }
  if (unitId === 'macedonia') {
    openStandardUnitFlow('macedonia');
    return;
  }
  if (unitId === 'feminina') {
    openStandardUnitFlow('feminina');
    return;
  }
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
  const acolhidos = existing 
    ? (typeof existing.acolhidosPresentes === 'number' ? existing.acolhidosPresentes : (parseInt(existing.acolhidosPresentes, 10) || 0))
    : (lastReport && typeof lastReport.acolhidosPresentes === 'number' ? lastReport.acolhidosPresentes : defaultAcolhidos);
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
  { id: 'todas', label: 'Todas' },
  { id: 'alimentos_grossos', label: 'Alimentos Grossos' },
  { id: 'proteinas', label: 'Proteínas' },
  { id: 'temperos', label: 'Temperos' },
  { id: 'lanches', label: 'Lanches' },
  { id: 'verduras_legumes', label: 'Verduras e Legumes' }
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
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div class="stock-action-title">Atualizar</div>
        <div class="stock-action-desc">Contar itens, acrescentar ou remover quantidades do estoque</div>
      </div>

      <!-- 2. Analisar Gráficos -->
      <div class="stock-action-choice-card" onclick="openStockAnalyticsView('${unitId}')">
        <div class="stock-action-icon-box analytics">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
            <line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
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
        <button type="button" onclick="openAddStockItemModal('${unitId}')" class="btn-step" title="Cadastrar novo alimento nesta despensa" style="width:38px; height:38px; background:var(--green-light); border-color:var(--green-primary); color:var(--green-primary); font-weight:800; font-size:1.1rem; flex-shrink:0;">＋</button>
      </div>

      <!-- Tags das Categorias Sempre Fixas (Sem Emojis) -->
      <div class="stock-tags-scroll">
        ${STOCK_CATEGORIES_INFO.map(cat => `
          <button type="button" class="chip-filter ${cat.id === (window.currentStockCategory || 'todas') ? 'active' : ''}" data-cat="${cat.id}" onclick="setStockCategoryFilter('${cat.id}', this)">
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
          <span>${cat.label.toUpperCase()}</span>
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

function promptAddNewStockItem(unitId) {
  openAddStockItemModal(unitId);
}

function openAddStockItemModal(unitId) {
  window.currentStockUnit = unitId;
  const unit = getStockUnitObj(unitId);
  const currentCat = window.currentStockCategory || 'todas';
  const defaultSelectedCat = currentCat !== 'todas' ? currentCat : 'alimentos_grossos';

  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  modalHeader.className = 'modal-header theme-estoque';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openStockUpdateView('${unitId}')" title="Voltar para a despensa" style="width:32px; height:32px; font-size:1rem; margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
      <div>
        <h2>Novo Alimento</h2>
        <p style="font-size:0.75rem;">Será acrescido em todas as 3 despensas</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  // Categorias disponíveis para seleção (excluindo 'todas')
  const availableCats = STOCK_CATEGORIES_INFO.filter(c => c.id !== 'todas');

  modalBody.innerHTML = `
    <form id="new-stock-item-form" onsubmit="event.preventDefault(); handleSaveNewStockItem('${unitId}');">
      <div class="form-group">
        <label class="form-label">Nome do Alimento ou Item *</label>
        <input type="text" id="new-stock-name" class="form-input" placeholder="Ex: Azeite, Canela em pó, Carne seca..." required autofocus>
      </div>

      <div class="form-group">
        <label class="form-label">Categoria * (para agrupamento em todos os estoques)</label>
        <select id="new-stock-category" class="form-input" required style="font-weight:700;">
          ${availableCats.map(cat => `
            <option value="${cat.id}" ${cat.id === defaultSelectedCat ? 'selected' : ''}>${cat.label}</option>
          `).join('')}
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Qtd Inicial na ${unit.name}</label>
          <input type="number" id="new-stock-qty" class="form-input" value="10" min="0" required inputmode="numeric">
          <span style="font-size:0.68rem; color:var(--text-muted); display:block; margin-top:2px;">(Nas outras despensas iniciará com 0 para contagem independente)</span>
        </div>

        <div class="form-group">
          <label class="form-label">Unidade de Medida</label>
          <select id="new-stock-unit" class="form-input">
            <option value="und" selected>Unidade (und)</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="pct">Pacote (pct)</option>
            <option value="cx">Caixa (cx)</option>
            <option value="l">Litro (l)</option>
            <option value="g">Grama (g)</option>
            <option value="lata">Lata</option>
            <option value="garrafa">Garrafa</option>
          </select>
        </div>
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" style="width:100%; background:linear-gradient(135deg, #1E4D2B, #2E6A3B); color:#FFF; font-weight:800; box-shadow:0 4px 12px rgba(30,77,43,0.3);" onclick="handleSaveNewStockItem('${unitId}')">
      💾 Salvar em Todos os Estoques
    </button>
  `;
}

async function handleSaveNewStockItem(unitId) {
  const nameInput = document.getElementById('new-stock-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    showToast('Informe o nome do alimento ou item!', 'warning');
    if (nameInput) nameInput.focus();
    return;
  }

  const categorySelect = document.getElementById('new-stock-category');
  const categoryId = categorySelect ? categorySelect.value : 'alimentos_grossos';
  const categoryObj = STOCK_CATEGORIES_INFO.find(c => c.id === categoryId);
  const categoryLabel = categoryObj ? categoryObj.label : 'Alimentos Grossos';

  const qtyInput = document.getElementById('new-stock-qty');
  const parsedQty = qtyInput ? parseInt(qtyInput.value, 10) : 0;
  const quantity = isNaN(parsedQty) ? 0 : Math.max(0, parsedQty);

  const unitSelect = document.getElementById('new-stock-unit');
  const unit = unitSelect ? unitSelect.value.trim().toLowerCase() : 'und';

  const allUnits = ['missao', 'macedonia', 'feminina'];
  const baseTimestamp = Date.now();
  const baseId = `c_${baseTimestamp}`;

  showLoading('Cadastrando alimento em todos os estoques...');
  try {
    for (const targetUnitId of allUnits) {
      const itemData = {
        id: `stk_${targetUnitId}_custom_${baseTimestamp}`,
        baseId: baseId,
        name: name,
        category: categoryId,
        categoryLabel: categoryLabel,
        quantity: (targetUnitId === unitId) ? quantity : 0,
        unit: unit,
        minQty: 5,
        unitId: targetUnitId
      };

      if (typeof dbManager.addStockItem === 'function') {
        await dbManager.addStockItem(itemData);
      } else if (typeof dbManager.saveStockItem === 'function') {
        await dbManager.saveStockItem(itemData);
      }
    }

    showToast(`"${name}" adicionado em todos os estoques!`, 'success');
    // Retorna à tela de atualização da despensa atual
    openStockUpdateView(unitId);
  } catch (e) {
    showToast('Erro ao cadastrar alimento: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
}

async function removeStockItem(itemId, unitId) {
  const item = dbManager.getStock(unitId).find(i => i.id === itemId);
  if (!item) return;

  if (!confirm(`Deseja realmente remover "${item.name}" do estoque desta despensa?`)) {
    return;
  }

  showLoading('Removendo alimento...');
  try {
    if (typeof dbManager.deleteStockItem === 'function') {
      await dbManager.deleteStockItem(itemId);
    } else {
      const stock = dbManager.getStock();
      const filtered = stock.filter(s => s.id !== itemId);
      localStorage.setItem('cristolandia_stock_items', JSON.stringify(filtered));
      if (dbManager.firebaseDb) {
        await dbManager.firebaseDb.ref(`cristolandia_check/stock/${itemId}`).remove();
      }
    }
    showToast(`"${item.name}" removido do estoque.`, 'info');
    renderStockList();
  } catch (e) {
    showToast('Erro ao remover: ' + e.message, 'danger');
  } finally {
    hideLoading();
  }
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
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
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
    <!-- Filtros de Categorias para o Gráfico (Sem Emojis, Apenas Nomes das Tags) -->
    <div class="stock-tags-wrap">
      ${STOCK_CATEGORIES_INFO.map(cat => `
        <button type="button" class="chip-filter ${cat.id === filterCat ? 'active' : ''}" onclick="openStockAnalyticsView('${unitId}', '${cat.id}')">
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

// --- MÓDULO 5: RELATÓRIOS CONSOLIDADOS & FILTROS POR PERÍODO ---
let _selectedReportPeriod = '24h';

function getReportPeriodRange(periodKey) {
  const today = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
  const now = new Date();
  let start = today;
  let label = 'Últimas 24h';
  let daysCount = 1;

  if (periodKey === '7d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    start = (typeof getLocalDateStr === 'function') ? getLocalDateStr(d) : d.toISOString().split('T')[0];
    label = 'Últimos 7 dias';
    daysCount = 7;
  } else if (periodKey === '30d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    start = (typeof getLocalDateStr === 'function') ? getLocalDateStr(d) : d.toISOString().split('T')[0];
    label = 'Últimos 30 dias';
    daysCount = 30;
  } else if (periodKey === '3m') {
    const d = new Date(now);
    d.setDate(d.getDate() - 89);
    start = (typeof getLocalDateStr === 'function') ? getLocalDateStr(d) : d.toISOString().split('T')[0];
    label = 'Últimos 3 meses';
    daysCount = 90;
  } else if (periodKey === '6m') {
    const d = new Date(now);
    d.setDate(d.getDate() - 179);
    start = (typeof getLocalDateStr === 'function') ? getLocalDateStr(d) : d.toISOString().split('T')[0];
    label = 'Últimos 6 meses';
    daysCount = 180;
  } else if (periodKey === '1y') {
    const d = new Date(now);
    d.setDate(d.getDate() - 364);
    start = (typeof getLocalDateStr === 'function') ? getLocalDateStr(d) : d.toISOString().split('T')[0];
    label = 'Último 1 ano';
    daysCount = 365;
  }

  return { start, end: today, label, periodKey, daysCount };
}

function selectReportPeriod(periodKey) {
  _selectedReportPeriod = periodKey;
  document.querySelectorAll('.btn-period-pill').forEach(btn => {
    if (btn.getAttribute('data-period') === periodKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderReportsHistory();
}

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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div>
        <h2>Relatórios de Atendimento</h2>
        <p style="font-size:0.75rem;">Filtros por unidade, período e exportação direta</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <!-- Barra Superior: Filtro de Unidade & Botão WhatsApp -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:8px; margin-bottom:10px;">
      <div style="flex:1;">
        <label style="font-size:0.72rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.4px;">
          Unidade de Atendimento:
        </label>
        <select id="report-filter-unit" class="form-select" onchange="renderReportsHistory()">
          <option value="todas">Todas as Unidades (Consolidado)</option>
          <option value="missao">Unidade Missão</option>
          <option value="macedonia">Unidade Macedônia</option>
          <option value="feminina">Unidade Feminina</option>
        </select>
      </div>

      <button class="btn-primary-action btn-whatsapp-action" style="padding:10px 14px; font-size:0.78rem; flex:none; height:40px;" onclick="shareReportsWhatsApp()" title="Enviar relatório filtrado para WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        WhatsApp
      </button>
    </div>

    <!-- Seletor de Período Dinâmico (24h, 7 dias, 30 dias, 3 meses, 6 meses, 1 ano) -->
    <div class="report-period-container">
      <span class="report-period-label">Período de Análise:</span>
      <div class="report-period-pills">
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '24h' ? 'active' : ''}" data-period="24h" onclick="selectReportPeriod('24h')">Últimas 24h</button>
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '7d' ? 'active' : ''}" data-period="7d" onclick="selectReportPeriod('7d')">7 dias</button>
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '30d' ? 'active' : ''}" data-period="30d" onclick="selectReportPeriod('30d')">30 dias</button>
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '3m' ? 'active' : ''}" data-period="3m" onclick="selectReportPeriod('3m')">3 meses</button>
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '6m' ? 'active' : ''}" data-period="6m" onclick="selectReportPeriod('6m')">6 meses</button>
        <button type="button" class="btn-period-pill ${_selectedReportPeriod === '1y' ? 'active' : ''}" data-period="1y" onclick="selectReportPeriod('1y')">1 ano</button>
      </div>
    </div>

    <!-- Banner com Período Ativo & Quantidade de Registros -->
    <div id="report-active-banner-area"></div>

    <!-- Conteúdo do Relatório Filtrado -->
    <div id="reports-history-list" style="display:flex; flex-direction:column; gap:10px;">
      <!-- Preenchido via renderReportsHistory() -->
    </div>
  `;

  modalFooter.innerHTML = `
    <button type="button" id="btn-download-report-pdf" class="btn-primary-action" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="downloadReportsPDF()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Baixar em PDF
    </button>
  `;

  renderReportsHistory();
  openModal('modal-generic');
}

function getFilteredReportsData(unitFilter, periodKey) {
  const range = getReportPeriodRange(periodKey);
  const allReports = dbManager.getReports() || [];

  // Filtra por data dentro do intervalo
  let matchedReports = allReports.filter(r => {
    if (!r.date) return false;
    return r.date >= range.start && r.date <= range.end;
  });

  // Filtra por unidade se selecionada
  if (unitFilter !== 'todas') {
    matchedReports = matchedReports.filter(r => r.unitId === unitFilter);
  }

  // Ordena decrescente por data
  matchedReports.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return { range, matchedReports, unitFilter, periodKey };
}

function renderReportsHistory() {
  const container = document.getElementById('reports-history-list');
  const bannerArea = document.getElementById('report-active-banner-area');
  if (!container) return;

  const unitFilter = document.getElementById('report-filter-unit')?.value || 'todas';
  const { range, matchedReports } = getFilteredReportsData(unitFilter, _selectedReportPeriod);

  // Nome formatado da unidade
  const unitLabel = unitFilter === 'missao' ? 'Unidade Missão' :
                    unitFilter === 'macedonia' ? 'Unidade Macedônia' :
                    unitFilter === 'feminina' ? 'Unidade Feminina' : 'Todas as Unidades';

  // Atualiza Banner Superior
  if (bannerArea) {
    bannerArea.innerHTML = `
      <div class="report-active-banner">
        <div class="report-active-banner-info">
          <span class="report-active-period-title">${unitLabel} • ${range.label}</span>
          <span class="report-active-period-dates">Intervalo: ${formatDateBR(range.start)} até ${formatDateBR(range.end)}</span>
        </div>
        <span class="report-active-count-tag">${matchedReports.length} relatório(s) computado(s)</span>
      </div>
    `;
  }

  // Estado vazio
  if (matchedReports.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:35px 20px; background:var(--bg-surface); border:1px dashed var(--border-beige); border-radius:12px; color:var(--text-muted);">
        <p style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">Nenhum relatório encontrado</p>
        <p style="font-size:0.78rem;">Não constam relatórios salvos para <strong>${unitLabel}</strong> no período de <strong>${range.label}</strong> (${formatDateBR(range.start)} a ${formatDateBR(range.end)}).</p>
      </div>
    `;
    return;
  }

  // ==========================================
  // AGREGADOR DINÂMICO CONFORME A UNIDADE
  // ==========================================
  let html = '';

  if (unitFilter === 'missao') {
    // Totais específicos da Missão
    let pTotal = 0, pRua = 0, pUnidade = 0, pBusca = 0;
    let rTotal = 0, rCafe = 0, rAlmoco = 0, rLanche = 0, rJantar = 0, rBusca = 0;
    let banhos = 0, cortes = 0, cultos = 0, buscaPessoas = 0, decisoes = 0;

    matchedReports.forEach(r => {
      // Pessoas atendidas
      // Pessoas atendidas
      const p = r.pessoasAtendidas || {};
      pTotal += (p.total || (r.acolhidosPresentes || 0));
      pRua += (p.rua || 0);
      pUnidade += (p.unidade || (r.acolhidosPresentes || 0));
      pBusca += (p.buscaAtiva || (r.novasTriagens || 0));

      // Refeições
      const ref = r.refeicoes || {};
      rCafe += (ref.cafe || 0);
      rAlmoco += (ref.almoco || 0);
      rLanche += (ref.lanche || 0);
      rJantar += (ref.jantar || 0);
      rBusca += (ref.buscaAtiva || 0);
      rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0));

      // Outras perguntas oficiais
      banhos += (r.banhos || 0);
      cortes += (r.cortesCabelo || 0);
      cultos += (r.cultos || 0);
      buscaPessoas += (r.buscaAtivaPessoas || 0);
      decisoes += (r.decisoesCristo || 0);
    });

    // Quantidade de triagens individuais registradas no período
    const triagensNoPeriodo = (typeof dbManager.getTriagens === 'function') 
      ? dbManager.getTriagens().filter(t => t.date >= range.start && t.date <= range.end).length 
      : 0;
    const finalTriagensMissao = Math.max(pBusca, triagensNoPeriodo);

    html += `
      <!-- Card: Pessoas Atendidas e Triagens -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">👥 Pessoas Atendidas & Triagens</span>
          <span class="report-section-badge">${pTotal} atend. | ${finalTriagensMissao} triagens</span>
        </div>
        <div class="report-subitems-grid">
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${pRua}</div>
            <div class="report-subitem-text">Na Rua</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${pUnidade}</div>
            <div class="report-subitem-text">Na Unidade</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num" style="color:var(--gold-primary);">${finalTriagensMissao}</div>
            <div class="report-subitem-text">Triagens (Geral)</div>
          </div>
        </div>
      </div>

      <!-- Card: Refeições Servidas -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">🍽️ Refeições Servidas</span>
          <span class="report-section-badge">${rTotal} refeições</span>
        </div>
        <div class="report-subitems-grid">
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rCafe}</div>
            <div class="report-subitem-text">Café</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rAlmoco}</div>
            <div class="report-subitem-text">Almoço</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rLanche}</div>
            <div class="report-subitem-text">Lanche</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rJantar}</div>
            <div class="report-subitem-text">Jantar</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rBusca}</div>
            <div class="report-subitem-text">Busca Ativa</div>
          </div>
        </div>
      </div>

      <!-- Card: Cuidados & Atividades -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">✨ Cuidados & Espiritualidade</span>
        </div>
        <div class="report-grid-kpis">
          <div class="report-kpi-box">
            <span class="report-kpi-val">${banhos}</span>
            <span class="report-kpi-lbl">Banhos Tomados</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${cortes}</span>
            <span class="report-kpi-lbl">Cortes de Cabelo</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${cultos}</span>
            <span class="report-kpi-lbl">Cultos Realizados</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${buscaPessoas}</span>
            <span class="report-kpi-lbl">Pessoas na Busca Ativa</span>
          </div>
          <div class="report-kpi-box gold-accent">
            <span class="report-kpi-val" style="color:var(--gold-primary);">${decisoes}</span>
            <span class="report-kpi-lbl">Decisões por Cristo</span>
          </div>
        </div>
      </div>
    `;

  } else if (unitFilter === 'macedonia' || unitFilter === 'feminina') {
    // Totais específicos de Macedônia e Feminina (12 perguntas oficiais)
    let rTotal = 0, rCafe = 0, rAlmoco = 0, rJantar = 0, rAbordagens = 0, rEventos = 0;
    let sociais = 0, saude = 0, psico = 0, juridico = 0;
    let estudos = 0, cultos = 0, musica = 0, coro = 0;
    let esportes = 0, acolhidosEsportes = 0, decisoes = 0;

    matchedReports.forEach(r => {
      const ref = r.refeicoes || {};
      rCafe += (ref.cafe || 0);
      rAlmoco += (ref.almoco || 0);
      rJantar += (ref.jantar || 0);
      rAbordagens += (ref.abordagens || 0);
      rEventos += (ref.eventosEspeciais || 0);
      rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0));

      sociais += (r.encaminhamentosSociais || 0);
      saude += (r.encaminhamentosSaude || 0);
      psico += (r.atendimentosPsicologicos || 0);
      juridico += (r.demandasJuridicas || 0);

      estudos += (r.estudosBiblicos || 0);
      cultos += (r.cultosVigilias || r.cultos || 0);
      musica += (r.sonsDaMissao || 0);
      coro += (r.ensaiosCoro || 0);

      esportes += (r.atividadesFisicas || 0);
      acolhidosEsportes += (r.participantesAtividadesFisicas || 0);
      decisoes += (r.decisoesCristo || 0);
    });

    html += `
      <!-- Card: Refeições Servidas -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">🍽️ Refeições Servidas</span>
          <span class="report-section-badge">${rTotal} refeições</span>
        </div>
        <div class="report-subitems-grid">
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rCafe}</div>
            <div class="report-subitem-text">Café</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rAlmoco}</div>
            <div class="report-subitem-text">Almoço</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rJantar}</div>
            <div class="report-subitem-text">Jantar</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rAbordagens}</div>
            <div class="report-subitem-text">Abordagens</div>
          </div>
          <div class="report-subitem-pill">
            <div class="report-subitem-num">${rEventos}</div>
            <div class="report-subitem-text">Eventos</div>
          </div>
        </div>
      </div>

      <!-- Card: Encaminhamentos & Apoio -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">🩺 Encaminhamentos & Assistência</span>
          <span class="report-section-badge">${sociais + saude + psico + juridico} atend.</span>
        </div>
        <div class="report-grid-kpis">
          <div class="report-kpi-box">
            <span class="report-kpi-val">${sociais}</span>
            <span class="report-kpi-lbl">Encaminhamentos Sociais</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${saude}</span>
            <span class="report-kpi-lbl">Encaminhamentos de Saúde</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${psico}</span>
            <span class="report-kpi-lbl">Atendimentos Psicológicos</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${juridico}</span>
            <span class="report-kpi-lbl">Demandas Jurídicas</span>
          </div>
        </div>
      </div>

      <!-- Card: Espiritualidade, Música & Esporte -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">📖 Espiritualidade & Oficinas</span>
        </div>
        <div class="report-grid-kpis">
          <div class="report-kpi-box">
            <span class="report-kpi-val">${estudos}</span>
            <span class="report-kpi-lbl">Estudos Bíblicos</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${cultos}</span>
            <span class="report-kpi-lbl">Cultos e Vigílias</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${musica}</span>
            <span class="report-kpi-lbl">Sons da Missão (Música)</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${coro}</span>
            <span class="report-kpi-lbl">Ensaios do Coro</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${esportes}</span>
            <span class="report-kpi-lbl">Atividades Físicas</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${acolhidosEsportes}</span>
            <span class="report-kpi-lbl">Acolhidos no Esporte</span>
          </div>
          <div class="report-kpi-box gold-accent" style="grid-column: 1 / -1;">
            <span class="report-kpi-val" style="color:var(--gold-primary);">${decisoes}</span>
            <span class="report-kpi-lbl">Decisões e Reconciliações por Cristo</span>
          </div>
        </div>
      </div>
    `;

  } else {
    // TODAS AS UNIDADES (Consolidado Geral)
    let totalRefeicoes = 0;
    let totalPessoasAssistidas = 0;
    let totalTriagens = 0;
    let totalCultosEstudos = 0;
    let totalDecisoes = 0;

    // Totais específicos para breakdown
    const unitBreakdown = {
      missao: { count: 0, ref: 0, assist: 0, decisoes: 0 },
      macedonia: { count: 0, ref: 0, assist: 0, decisoes: 0 },
      feminina: { count: 0, ref: 0, assist: 0, decisoes: 0 }
    };

    matchedReports.forEach(r => {
      const u = r.unitId || 'missao';
      const ref = r.refeicoes || {};
      const refSum = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);
      totalRefeicoes += refSum;

      // Pessoas assistidas CUIDAR
      const banhos = r.banhos || 0;
      const cortes = r.cortesCabelo || 0;
      const busca = r.buscaAtivaPessoas || (r.pessoasAtendidas && r.pessoasAtendidas.buscaAtiva) || 0;
      const soc = r.encaminhamentosSociais || 0;
      const sau = r.encaminhamentosSaude || 0;
      const psi = r.atendimentosPsicologicos || 0;
      const jur = r.demandasJuridicas || 0;
      const mus = r.sonsDaMissao || 0;
      const assistSum = (banhos + cortes + busca + soc + sau + psi + jur + mus);
      totalPessoasAssistidas += assistSum;

      totalTriagens += (r.novasTriagens || 0);
      totalCultosEstudos += (r.cultos || 0) + (r.cultosVigilias || 0) + (r.estudosBiblicos || 0);
      totalDecisoes += (r.decisoesCristo || 0);

      if (unitBreakdown[u]) {
        unitBreakdown[u].count++;
        unitBreakdown[u].ref += refSum;
        unitBreakdown[u].assist += assistSum;
        unitBreakdown[u].decisoes += (r.decisoesCristo || 0);
      }
    });

    // Quantidade geral de triagens cadastradas no período
    const triagensIndividuaisTotal = (typeof dbManager.getTriagens === 'function') 
      ? dbManager.getTriagens().filter(t => t.date >= range.start && t.date <= range.end).length 
      : 0;
    const finalTotalTriagens = Math.max(totalTriagens, triagensIndividuaisTotal);

    html += `
      <!-- Card: Consolidação Geral -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">🌐 Indicadores Gerais Consolidados</span>
          <span class="report-section-badge">3 Unidades</span>
        </div>
        <div class="report-grid-kpis">
          <div class="report-kpi-box">
            <span class="report-kpi-val">${totalRefeicoes}</span>
            <span class="report-kpi-lbl">Total Refeições Servidas</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${totalPessoasAssistidas}</span>
            <span class="report-kpi-lbl">Pessoas Assistidas (CUIDAR)</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${finalTotalTriagens}</span>
            <span class="report-kpi-lbl">Triagens Realizadas (Geral)</span>
          </div>
          <div class="report-kpi-box">
            <span class="report-kpi-val">${totalCultosEstudos}</span>
            <span class="report-kpi-lbl">Cultos & Estudos Bíblicos</span>
          </div>
          <div class="report-kpi-box gold-accent" style="grid-column: 1 / -1;">
            <span class="report-kpi-val" style="color:var(--gold-primary);">${totalDecisoes}</span>
            <span class="report-kpi-lbl">Decisões por Cristo (Todas as Unidades)</span>
          </div>
        </div>
      </div>

      <!-- Card: Resumo por Unidade -->
      <div class="report-section-card">
        <div class="report-section-header">
          <span class="report-section-title">🏢 Comparativo por Unidade</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="background:var(--bg-main); padding:8px 10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--green-primary); font-size:0.82rem;">Missão</strong>
              <div style="font-size:0.70rem; color:var(--text-muted);">${unitBreakdown.missao.count} relatórios</div>
            </div>
            <div style="text-align:right; font-size:0.75rem;">
              <div><strong>${unitBreakdown.missao.ref}</strong> ref. | <strong>${unitBreakdown.missao.assist}</strong> assist.</div>
              <div style="color:var(--gold-primary); font-weight:700;">${unitBreakdown.missao.decisoes} decisões</div>
            </div>
          </div>

          <div style="background:var(--bg-main); padding:8px 10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--green-primary); font-size:0.82rem;">Macedônia</strong>
              <div style="font-size:0.70rem; color:var(--text-muted);">${unitBreakdown.macedonia.count} relatórios</div>
            </div>
            <div style="text-align:right; font-size:0.75rem;">
              <div><strong>${unitBreakdown.macedonia.ref}</strong> ref. | <strong>${unitBreakdown.macedonia.assist}</strong> assist.</div>
              <div style="color:var(--gold-primary); font-weight:700;">${unitBreakdown.macedonia.decisoes} decisões</div>
            </div>
          </div>

          <div style="background:var(--bg-main); padding:8px 10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--green-primary); font-size:0.82rem;">Feminina</strong>
              <div style="font-size:0.70rem; color:var(--text-muted);">${unitBreakdown.feminina.count} relatórios</div>
            </div>
            <div style="text-align:right; font-size:0.75rem;">
              <div><strong>${unitBreakdown.feminina.ref}</strong> ref. | <strong>${unitBreakdown.feminina.assist}</strong> assist.</div>
              <div style="color:var(--gold-primary); font-weight:700;">${unitBreakdown.feminina.decisoes} decisões</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Lista de Relatórios/Dias Computados no Período
  html += `
    <div class="report-section-card">
      <div class="report-section-header">
        <span class="report-section-title">📋 Relatórios Registrados no Período</span>
        <span style="font-size:0.72rem; color:var(--text-muted);">${matchedReports.length} dia(s)</span>
      </div>
      <div class="report-days-accordion">
        ${matchedReports.slice(0, 15).map(r => `
          <div class="report-day-row">
            <div>
              <span style="font-weight:700; color:var(--green-primary);">${formatDateBR(r.date)}</span>
              <span style="color:var(--text-muted); margin-left:6px;">• ${r.unitName || r.unitId}</span>
            </div>
            <span style="color:var(--text-muted); font-size:0.70rem;">${r.reporterName || 'Plantonista'}</span>
          </div>
        `).join('')}
        ${matchedReports.length > 15 ? `<p style="font-size:0.70rem; text-align:center; color:var(--text-muted); margin-top:6px;">+ ${matchedReports.length - 15} relatórios computados neste período</p>` : ''}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ==========================================================================
// BAIXAR RELATÓRIO DIRETAMENTE EM PDF (A4 VERTICAL DIDÁTICO)
// ==========================================================================
async function downloadReportsPDF() {
  const btn = document.getElementById('btn-download-report-pdf');
  const unitFilter = document.getElementById('report-filter-unit')?.value || 'todas';
  const { range, matchedReports } = getFilteredReportsData(unitFilter, _selectedReportPeriod);

  if (matchedReports.length === 0) {
    showToast('Não há relatórios para gerar o PDF neste período.', 'warning');
    return;
  }

  const unitLabel = unitFilter === 'missao' ? 'Unidade Missão' :
                    unitFilter === 'macedonia' ? 'Unidade Macedônia' :
                    unitFilter === 'feminina' ? 'Unidade Feminina' : 'Todas as Unidades (Consolidado)';

  if (btn) btn.disabled = true;
  showLoading('Gerando PDF A4...');

  try {
    // Monta o elemento HTML formatado exatamente para documento A4 vertical
    const printableArea = document.createElement('div');
    printableArea.id = 'report-pdf-printable-doc';
    printableArea.style.width = '740px';
    printableArea.style.padding = '24px 28px';
    printableArea.style.background = '#FFFFFF';
    printableArea.style.color = '#2D3748';
    printableArea.style.fontFamily = "'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    printableArea.style.boxSizing = 'border-box';

    // Agregações de dados para o PDF
    let metricsHtml = '';

    if (unitFilter === 'missao') {
      let pTotal = 0, pRua = 0, pUnidade = 0, pBusca = 0;
      let rTotal = 0, rCafe = 0, rAlmoco = 0, rLanche = 0, rJantar = 0, rBusca = 0;
      let banhos = 0, cortes = 0, cultos = 0, buscaPessoas = 0, decisoes = 0;

      matchedReports.forEach(r => {
        const p = r.pessoasAtendidas || {};
        pTotal += (p.total || (r.acolhidosPresentes || 0));
        pRua += (p.rua || 0);
        pUnidade += (p.unidade || (r.acolhidosPresentes || 0));
        pBusca += (p.buscaAtiva || (r.novasTriagens || 0));

        const ref = r.refeicoes || {};
        rCafe += (ref.cafe || 0);
        rAlmoco += (ref.almoco || 0);
        rLanche += (ref.lanche || 0);
        rJantar += (ref.jantar || 0);
        rBusca += (ref.buscaAtiva || 0);
        rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0));

        banhos += (r.banhos || 0);
        cortes += (r.cortesCabelo || 0);
        cultos += (r.cultos || 0);
        buscaPessoas += (r.buscaAtivaPessoas || 0);
        decisoes += (r.decisoesCristo || 0);
      });

      metricsHtml = `
        <div style="margin-bottom:18px;">
          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            1. Pessoas Atendidas na Unidade Missão (Total: ${pTotal})
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Local / Tipo de Atendimento</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Quantidade Somada no Período</th>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Atendimentos na Rua</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${pRua}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Atendimentos na Unidade</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${pUnidade}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Atendimentos em Busca Ativa</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${pBusca}</td>
            </tr>
            <tr style="background:#FFF9E6; font-weight:bold; color:#A36F04;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Triagens Realizadas no Período (Geral)</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${Math.max(pBusca, (typeof dbManager.getTriagens === 'function' ? dbManager.getTriagens().filter(t => t.date >= range.start && t.date <= range.end).length : 0))}</td>
            </tr>
          </table>

          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            2. Refeições Servidas na Unidade Missão (Total: ${rTotal})
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Tipo de Refeição</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Quantidade Somada no Período</th>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Café da Manhã</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rCafe}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Almoço</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rAlmoco}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Lanche da Tarde</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rLanche}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Jantar</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rJantar}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Refeições em Busca Ativa</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rBusca}</td>
            </tr>
          </table>

          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            3. Atividades & Cuidado Pessoal
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Indicador</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Total</th>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Banhos Tomados na Unidade</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${banhos}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Cortes de Cabelo Realizados</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${cortes}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Cultos Realizados na Unidade</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${cultos}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8;">Pessoas Encontradas na Busca Ativa</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${buscaPessoas}</td>
            </tr>
            <tr style="background:#FFF9E6; font-weight:bold; color:#A36F04;">
              <td style="padding:8px 10px; border:1px solid #E2D9C8;">Decisões por Cristo (Decisões & Reconciliações)</td>
              <td style="padding:8px 10px; border:1px solid #E2D9C8; text-align:center; font-size:14px;">${decisoes}</td>
            </tr>
          </table>
        </div>
      `;

    } else if (unitFilter === 'macedonia' || unitFilter === 'feminina') {
      let rTotal = 0, rCafe = 0, rAlmoco = 0, rJantar = 0, rAbordagens = 0, rEventos = 0;
      let sociais = 0, saude = 0, psico = 0, juridico = 0;
      let estudos = 0, cultos = 0, musica = 0, coro = 0;
      let esportes = 0, acolhidosEsportes = 0, decisoes = 0;

      matchedReports.forEach(r => {
        const ref = r.refeicoes || {};
        rCafe += (ref.cafe || 0);
        rAlmoco += (ref.almoco || 0);
        rJantar += (ref.jantar || 0);
        rAbordagens += (ref.abordagens || 0);
        rEventos += (ref.eventosEspeciais || 0);
        rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0));

        sociais += (r.encaminhamentosSociais || 0);
        saude += (r.encaminhamentosSaude || 0);
        psico += (r.atendimentosPsicologicos || 0);
        juridico += (r.demandasJuridicas || 0);

        estudos += (r.estudosBiblicos || 0);
        cultos += (r.cultosVigilias || r.cultos || 0);
        musica += (r.sonsDaMissao || 0);
        coro += (r.ensaiosCoro || 0);

        esportes += (r.atividadesFisicas || 0);
        acolhidosEsportes += (r.participantesAtividadesFisicas || 0);
        decisoes += (r.decisoesCristo || 0);
      });

      metricsHtml = `
        <div style="margin-bottom:18px;">
          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            1. Refeições Servidas na ${unitLabel} (Total: ${rTotal})
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Tipo de Refeição</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Quantidade Somada</th>
            </tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Café da Manhã</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rCafe}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Almoço</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rAlmoco}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Jantar</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rJantar}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Abordagens de Rua</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rAbordagens}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Eventos Especiais</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${rEventos}</td></tr>
          </table>

          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            2. Atendimentos & Encaminhamentos
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Atendimento</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Total</th>
            </tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Encaminhamentos Sociais (CRAS, INSS, Documentos)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${sociais}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Encaminhamentos de Saúde (Médicos, Odonto, Vacinas)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${saude}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Atendimentos Psicológicos</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${psico}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Demandas Jurídicas (Advogados, Fóruns, Varas)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${juridico}</td></tr>
          </table>

          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            3. Espiritualidade, Oficinas & Atividades Físicas
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Atividade</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Total</th>
            </tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Estudos Bíblicos Realizados na Unidade</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${estudos}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Cultos e Vigílias Realizadas na Unidade</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${cultos}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Participantes do Sons da Missão (Música)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${musica}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Ensaios do Coro Realizados</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${coro}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Atividades Físicas / Esportes Realizadas</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${esportes}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Acolhidos que Participaram das Atividades Físicas</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${acolhidosEsportes}</td></tr>
            <tr style="background:#FFF9E6; font-weight:bold; color:#A36F04;">
              <td style="padding:8px 10px; border:1px solid #E2D9C8;">Decisões por Cristo (Decisões & Reconciliações)</td>
              <td style="padding:8px 10px; border:1px solid #E2D9C8; text-align:center; font-size:14px;">${decisoes}</td>
            </tr>
          </table>
        </div>
      `;

    } else {
      // Consolidado Geral (Todas as Unidades)
      let totalRefeicoes = 0, totalAssistidas = 0, totalTriagens = 0, totalCultos = 0, totalDecisoes = 0;
      const breakdown = {
        missao: { count: 0, ref: 0, assist: 0, decisoes: 0 },
        macedonia: { count: 0, ref: 0, assist: 0, decisoes: 0 },
        feminina: { count: 0, ref: 0, assist: 0, decisoes: 0 }
      };

      matchedReports.forEach(r => {
        const u = r.unitId || 'missao';
        const ref = r.refeicoes || {};
        const refSum = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);
        totalRefeicoes += refSum;

        const assistSum = (r.banhos || 0) + (r.cortesCabelo || 0) + (r.buscaAtivaPessoas || 0) + (r.encaminhamentosSociais || 0) + (r.encaminhamentosSaude || 0) + (r.atendimentosPsicologicos || 0) + (r.demandasJuridicas || 0) + (r.sonsDaMissao || 0);
        totalAssistidas += assistSum;

        totalTriagens += (r.novasTriagens || 0);
        totalCultos += (r.cultos || 0) + (r.cultosVigilias || 0) + (r.estudosBiblicos || 0);
        totalDecisoes += (r.decisoesCristo || 0);

        if (breakdown[u]) {
          breakdown[u].count++;
          breakdown[u].ref += refSum;
          breakdown[u].assist += assistSum;
          breakdown[u].decisoes += (r.decisoesCristo || 0);
        }
      });

      metricsHtml = `
        <div style="margin-bottom:18px;">
          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            1. Indicadores Consolidados Gerais (3 Unidades)
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Métrica Geral</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Total Consolidado</th>
            </tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Total de Refeições Servidas</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${totalRefeicoes}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Pessoas Assistidas (CUIDAR)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${totalAssistidas}</td></tr>
            <tr><td style="padding:6px 10px; border:1px solid #E2D9C8;">Triagens Realizadas no Período (Geral)</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${Math.max(totalTriagens, (typeof dbManager.getTriagens === 'function' ? dbManager.getTriagens().filter(t => t.date >= range.start && t.date <= range.end).length : 0))}</td></tr>
            <tr style="background:#FAF8F5;"><td style="padding:6px 10px; border:1px solid #E2D9C8;">Cultos, Vigílias & Estudos Bíblicos</td><td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold;">${totalCultos}</td></tr>
            <tr style="background:#FFF9E6; font-weight:bold; color:#A36F04;"><td style="padding:8px 10px; border:1px solid #E2D9C8;">Total de Decisões por Cristo</td><td style="padding:8px 10px; border:1px solid #E2D9C8; text-align:center; font-size:14px;">${totalDecisoes}</td></tr>
          </table>

          <h3 style="font-size:13px; color:#1E4D2B; text-transform:uppercase; border-bottom:2px solid #C58908; padding-bottom:4px; margin-bottom:10px;">
            2. Resumo Comparativo por Unidade
          </h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <tr style="background:#F5F1E8; color:#1E4D2B; font-weight:bold;">
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:left;">Unidade</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Relatórios</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Refeições</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Assistidos</th>
              <th style="padding:6px 10px; border:1px solid #D6CEBE; text-align:center;">Decisões</th>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; font-weight:bold; color:#1E4D2B;">Missão</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.missao.count}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.missao.ref}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.missao.assist}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold; color:#A36F04;">${breakdown.missao.decisoes}</td>
            </tr>
            <tr style="background:#FAF8F5;">
              <td style="padding:6px 10px; border:1px solid #E2D9C8; font-weight:bold; color:#1E4D2B;">Macedônia</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.macedonia.count}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.macedonia.ref}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.macedonia.assist}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold; color:#A36F04;">${breakdown.macedonia.decisoes}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; font-weight:bold; color:#1E4D2B;">Feminina</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.feminina.count}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.feminina.ref}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center;">${breakdown.feminina.assist}</td>
              <td style="padding:6px 10px; border:1px solid #E2D9C8; text-align:center; font-weight:bold; color:#A36F04;">${breakdown.feminina.decisoes}</td>
            </tr>
          </table>
        </div>
      `;
    }

    const emissionDate = new Date();
    const emissionStr = `${emissionDate.toLocaleDateString('pt-BR')} às ${emissionDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    printableArea.innerHTML = `
      <!-- Cabeçalho Oficial Cristolândia A4 -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #1E4D2B; padding-bottom:12px; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="icons/app-logo.png" style="width:48px; height:48px; border-radius:10px; object-fit:cover; border:1px solid #C58908;" alt="Logo">
          <div>
            <h1 style="font-size:20px; font-weight:800; color:#1E4D2B; margin:0; line-height:1.1; letter-spacing:0.5px;">CRISTOLÂNDIA CHECK</h1>
            <p style="font-size:11px; color:#C58908; margin:2px 0 0 0; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">Relatório Oficial de Atendimento & Gestão</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="display:inline-block; background:#1E4D2B; color:#FFFFFF; font-size:10px; font-weight:bold; padding:4px 8px; border-radius:4px;">DOCUMENTO OFICIAL</span>
          <div style="font-size:10px; color:#718096; margin-top:3px;">Emitido em: ${emissionStr}</div>
        </div>
      </div>

      <!-- Caixa de Parâmetros do Relatório -->
      <div style="background:#F5F1E8; border:1px solid #D6CEBE; border-left:4px solid #1E4D2B; border-radius:6px; padding:10px 14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:13px; font-weight:bold; color:#1E4D2B;">${unitLabel}</div>
          <div style="font-size:11px; color:#555555; margin-top:2px;">
            Período Selecionado: <strong>${range.label}</strong> (${formatDateBR(range.start)} a ${formatDateBR(range.end)})
          </div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; font-weight:bold; color:#1E4D2B; background:#FFFFFF; border:1px solid #C58908; padding:3px 8px; border-radius:12px;">
            ${matchedReports.length} relatório(s) computado(s)
          </span>
        </div>
      </div>

      <!-- Seção Principal de Métricas -->
      ${metricsHtml}

      <!-- Lista de Relatórios e Plantonistas Computados -->
      <div style="margin-top:16px; border-top:1px dashed #D6CEBE; padding-top:12px;">
        <h4 style="font-size:11px; color:#718096; text-transform:uppercase; margin:0 0 6px 0;">Histórico dos Relatórios Computados neste Período:</h4>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:4px; font-size:10px; color:#555555;">
          ${matchedReports.slice(0, 16).map(r => `
            <div style="padding:2px 0;">• <strong>${formatDateBR(r.date)}</strong> (${r.unitName || r.unitId}) - ${r.reporterName || 'Plantonista'}</div>
          `).join('')}
          ${matchedReports.length > 16 ? `<div style="grid-column:1 / -1; color:#718096; font-style:italic;">+ ${matchedReports.length - 16} outros registros inclusos nos somatórios acima.</div>` : ''}
        </div>
      </div>

      <!-- Rodapé Institucional do PDF -->
      <div style="margin-top:24px; border-top:1px solid #E2D9C8; padding-top:12px; display:flex; justify-content:space-between; align-items:center; font-size:9px; color:#718096;">
        <div>Cristolândia Check PWA • Sincronização em Tempo Real (Motor CUIDAR)</div>
        <div style="text-align:right;">Página 1 de 1 • Formato A4 Vertical</div>
      </div>
    `;

    // Opções de impressão A4 Vertical estrito
    const cleanFilename = `relatorio_cristolandia_${unitFilter}_${_selectedReportPeriod}_${range.end}.pdf`;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: cleanFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf === 'function') {
      await html2pdf().set(opt).from(printableArea).save();
      showToast('Relatório em PDF baixado com sucesso!', 'success');
      if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    } else {
      // Fallback seguro caso script falhe
      const printWin = window.open('', '_blank');
      printWin.document.write(`<html><head><title>${cleanFilename}</title></head><body style="margin:0;">${printableArea.outerHTML}</body></html>`);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    }
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    showToast('Erro ao baixar o PDF: ' + err.message, 'danger');
  } finally {
    hideLoading();
    if (btn) btn.disabled = false;
  }
}

// ==========================================================================
// COMPARTILHAR RELATÓRIO FILTRADO VIA WHATSAPP
// ==========================================================================
function shareReportsWhatsApp() {
  const unitFilter = document.getElementById('report-filter-unit')?.value || 'todas';
  const { range, matchedReports } = getFilteredReportsData(unitFilter, _selectedReportPeriod);

  if (matchedReports.length === 0) {
    showToast('Não há relatórios para enviar no WhatsApp neste período.', 'warning');
    return;
  }

  const unitLabel = unitFilter === 'missao' ? 'UNIDADE MISSÃO' :
                    unitFilter === 'macedonia' ? 'UNIDADE MACEDÔNIA' :
                    unitFilter === 'feminina' ? 'UNIDADE FEMININA' : 'TODAS AS UNIDADES (CONSOLIDADO)';

  let text = `🌿 *CRISTOLÂNDIA CHECK • RELATÓRIO DE ATIVIDADES*\n`;
  text += `📍 *Unidade:* ${unitLabel}\n`;
  text += `📅 *Período:* ${range.label} (${formatDateBR(range.start)} a ${formatDateBR(range.end)})\n`;
  text += `📊 *Total de Relatórios Computados:* ${matchedReports.length} dia(s)\n\n`;

  if (unitFilter === 'missao') {
    let pTotal = 0, pRua = 0, pUnidade = 0, pBusca = 0;
    let rTotal = 0, rCafe = 0, rAlmoco = 0, rLanche = 0, rJantar = 0, rBusca = 0;
    let banhos = 0, cortes = 0, cultos = 0, buscaPessoas = 0, decisoes = 0;

    matchedReports.forEach(r => {
      const p = r.pessoasAtendidas || {};
      pTotal += (p.total || (r.acolhidosPresentes || 0));
      pRua += (p.rua || 0);
      pUnidade += (p.unidade || (r.acolhidosPresentes || 0));
      pBusca += (p.buscaAtiva || (r.novasTriagens || 0));

      const ref = r.refeicoes || {};
      rCafe += (ref.cafe || 0);
      rAlmoco += (ref.almoco || 0);
      rLanche += (ref.lanche || 0);
      rJantar += (ref.jantar || 0);
      rBusca += (ref.buscaAtiva || 0);
      rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0));

      banhos += (r.banhos || 0);
      cortes += (r.cortesCabelo || 0);
      cultos += (r.cultos || 0);
      buscaPessoas += (r.buscaAtivaPessoas || 0);
      decisoes += (r.decisoesCristo || 0);
    });

    text += `*1. PESSOAS ATENDIDAS (TOTAL: ${pTotal})*\n`;
    text += `• Na Rua: ${pRua}\n`;
    text += `• Na Unidade: ${pUnidade}\n`;
    text += `• Busca Ativa: ${pBusca}\n\n`;

    text += `*2. REFEIÇÕES SERVIDAS (TOTAL: ${rTotal})*\n`;
    text += `• Café da Manhã: ${rCafe}\n`;
    text += `• Almoço: ${rAlmoco}\n`;
    text += `• Lanche da Tarde: ${rLanche}\n`;
    text += `• Jantar: ${rJantar}\n`;
    text += `• Busca Ativa: ${rBusca}\n\n`;

    text += `*3. CUIDADOS & ESPIRITUALIDADE*\n`;
    text += `• Banhos Tomados: ${banhos}\n`;
    text += `• Cortes de Cabelo: ${cortes}\n`;
    text += `• Cultos Realizados: ${cultos}\n`;
    text += `• Pessoas na Busca Ativa: ${buscaPessoas}\n`;
    text += `• ✨ *Decisões por Cristo:* ${decisoes}\n\n`;

  } else if (unitFilter === 'macedonia' || unitFilter === 'feminina') {
    let rTotal = 0, rCafe = 0, rAlmoco = 0, rJantar = 0, rAbordagens = 0, rEventos = 0;
    let sociais = 0, saude = 0, psico = 0, juridico = 0;
    let estudos = 0, cultos = 0, musica = 0, coro = 0;
    let esportes = 0, acolhidosEsportes = 0, decisoes = 0;

    matchedReports.forEach(r => {
      const ref = r.refeicoes || {};
      rCafe += (ref.cafe || 0);
      rAlmoco += (ref.almoco || 0);
      rJantar += (ref.jantar || 0);
      rAbordagens += (ref.abordagens || 0);
      rEventos += (ref.eventosEspeciais || 0);
      rTotal += ((ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0));

      sociais += (r.encaminhamentosSociais || 0);
      saude += (r.encaminhamentosSaude || 0);
      psico += (r.atendimentosPsicologicos || 0);
      juridico += (r.demandasJuridicas || 0);

      estudos += (r.estudosBiblicos || 0);
      cultos += (r.cultosVigilias || r.cultos || 0);
      musica += (r.sonsDaMissao || 0);
      coro += (r.ensaiosCoro || 0);

      esportes += (r.atividadesFisicas || 0);
      acolhidosEsportes += (r.participantesAtividadesFisicas || 0);
      decisoes += (r.decisoesCristo || 0);
    });

    text += `*1. REFEIÇÕES SERVIDAS (TOTAL: ${rTotal})*\n`;
    text += `• Café: ${rCafe} | Almoço: ${rAlmoco} | Jantar: ${rJantar}\n`;
    text += `• Abordagens de Rua: ${rAbordagens} | Eventos Especiais: ${rEventos}\n\n`;

    text += `*2. ENCAMINHAMENTOS & APOIO*\n`;
    text += `• Encaminhamentos Sociais: ${sociais}\n`;
    text += `• Encaminhamentos de Saúde: ${saude}\n`;
    text += `• Atendimentos Psicológicos: ${psico}\n`;
    text += `• Demandas Jurídicas: ${juridico}\n\n`;

    text += `*3. ESPIRITUALIDADE & OFICINAS*\n`;
    text += `• Estudos Bíblicos: ${estudos}\n`;
    text += `• Cultos e Vigílias: ${cultos}\n`;
    text += `• Sons da Missão (Música): ${musica}\n`;
    text += `• Ensaios do Coro: ${coro}\n`;
    text += `• Atividades Físicas Realizadas: ${esportes}\n`;
    text += `• Acolhidos nas Atividades Físicas: ${acolhidosEsportes}\n`;
    text += `• ✨ *Decisões por Cristo:* ${decisoes}\n\n`;

  } else {
    // Consolidado Geral
    let totalRefeicoes = 0, totalAssistidas = 0, totalTriagens = 0, totalCultos = 0, totalDecisoes = 0;
    const breakdown = {
      missao: { count: 0, ref: 0, assist: 0, decisoes: 0 },
      macedonia: { count: 0, ref: 0, assist: 0, decisoes: 0 },
      feminina: { count: 0, ref: 0, assist: 0, decisoes: 0 }
    };

    matchedReports.forEach(r => {
      const u = r.unitId || 'missao';
      const ref = r.refeicoes || {};
      const refSum = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);
      totalRefeicoes += refSum;

      const assistSum = (r.banhos || 0) + (r.cortesCabelo || 0) + (r.buscaAtivaPessoas || 0) + (r.encaminhamentosSociais || 0) + (r.encaminhamentosSaude || 0) + (r.atendimentosPsicologicos || 0) + (r.demandasJuridicas || 0) + (r.sonsDaMissao || 0);
      totalAssistidas += assistSum;

      totalTriagens += (r.novasTriagens || 0);
      totalCultos += (r.cultos || 0) + (r.cultosVigilias || 0) + (r.estudosBiblicos || 0);
      totalDecisoes += (r.decisoesCristo || 0);

      if (breakdown[u]) {
        breakdown[u].count++;
        breakdown[u].ref += refSum;
        breakdown[u].assist += assistSum;
        breakdown[u].decisoes += (r.decisoesCristo || 0);
      }
    });

    text += `*1. CONSOLIDADO GERAL (3 UNIDADES)*\n`;
    text += `• Total de Refeições: ${totalRefeicoes}\n`;
    text += `• Pessoas Assistidas (CUIDAR): ${totalAssistidas}\n`;
    text += `• Triagens Realizadas (Geral): ${Math.max(totalTriagens, (typeof dbManager.getTriagens === 'function' ? dbManager.getTriagens().filter(t => t.date >= range.start && t.date <= range.end).length : 0))}\n`;
    text += `• Cultos, Vigílias e Estudos: ${totalCultos}\n`;
    text += `• ✨ *Decisões por Cristo:* ${totalDecisoes}\n\n`;

    text += `*2. COMPARATIVO POR UNIDADE*\n`;
    text += `• *Missão:* ${breakdown.missao.ref} ref. | ${breakdown.missao.assist} assist. | ${breakdown.missao.decisoes} decisões (${breakdown.missao.count} relatórios)\n`;
    text += `• *Macedônia:* ${breakdown.macedonia.ref} ref. | ${breakdown.macedonia.assist} assist. | ${breakdown.macedonia.decisoes} decisões (${breakdown.macedonia.count} relatórios)\n`;
    text += `• *Feminina:* ${breakdown.feminina.ref} ref. | ${breakdown.feminina.assist} assist. | ${breakdown.feminina.decisoes} decisões (${breakdown.feminina.count} relatórios)\n\n`;
  }

  text += `_Cristolândia Check PWA • Sistema Oficial_`;
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
          <div class="history-item clickable" style="border-left:3px solid var(--gold-primary); cursor:pointer;" onclick="openNovaAtividadeForm({}, '${a.id}')">
            <div class="history-item-header">
              <div>
                <h4 style="font-size:0.85rem;font-weight:700;color:var(--green-primary);">${instName}</h4>
                <span style="font-size:0.72rem;color:var(--text-muted);">${formatDateBR(a.date)} · ${unitLabel}</span>
              </div>
              <button onclick="event.stopPropagation(); handleDeleteAtividade('${a.id}')" style="background:none;border:none;color:var(--text-muted);font-size:0.72rem;cursor:pointer;font-weight:600;">Remover</button>
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

function openNovaAtividadeForm(pending, editId = null) {
  // pending = { date, unitId, institutionId, description } — preservado ao retornar do cadastro
  const institutions = dbManager.getChurches();
  const existingAct = editId ? (dbManager.getActivities().find(a => a.id === editId) || null) : null;
  const p = existingAct || pending || {};
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const today = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="openAtividadesView()" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </div>
      <div>
        <h2>${editId ? 'Editar Atividade' : 'Nova Atividade'}</h2>
        <p style="font-size:0.75rem;">${editId ? 'Alterar dados da atividade' : 'Registrar atividade realizada'}</p>
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
        <input type="date" id="atv-date" class="form-input" value="${p.date || today}" max="${today}" required>
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
        <select id="atv-institution" class="form-input" onchange="handleInstituicaoSelectChange(this.value, '${editId || ''}')">
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
    <button type="button" class="btn-primary-action" style="width:100%;background:linear-gradient(135deg,#1E4D2B,#2E6A3B);color:#FFF;font-weight:800;" onclick="handleSaveAtividade('${editId || ''}')">${editId ? '💾 Salvar Alterações' : '💾 Salvar Atividade'}</button>
  `;
}

function handleInstituicaoSelectChange(val, editId) {
  if (val !== '__cadastrar__') return;
  // Coleta dados parciais do formulário antes de navegar
  const pending = {
    id: editId || undefined,
    date: document.getElementById('atv-date')?.value || '',
    unitId: document.getElementById('atv-unit')?.value || 'missao',
    institutionId: '',
    description: document.getElementById('atv-description')?.value || ''
  };
  openCadastroInstituicaoForm(pending);
}

async function handleSaveAtividade(editId) {
  const institutionId = document.getElementById('atv-institution')?.value;
  const date = document.getElementById('atv-date')?.value;
  const unitId = document.getElementById('atv-unit')?.value;
  const description = document.getElementById('atv-description')?.value.trim();

  const today = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];

  if (!institutionId || institutionId === '__cadastrar__') {
    showToast('Selecione uma instituição!', 'warning'); return;
  }
  if (!date) { showToast('Informe a data da atividade!', 'warning'); return; }
  if (date > today) {
    showToast('Não é possível selecionar uma data futura!', 'warning');
    return;
  }
  if (!description) { showToast('Descreva a atividade!', 'warning'); return; }

  const institution = dbManager.getChurches().find(i => i.id === institutionId);

  const actData = {
    id: editId || ('act_' + Date.now()),
    date,
    unitId,
    institutionId,
    institutionName: institution?.name || '',
    description
  };

  showLoading(editId ? 'Atualizando atividade...' : 'Gravando atividade...');
  try {
    await dbManager.saveActivity(actData);
    showToast(editId ? 'Atividade atualizada com sucesso!' : 'Atividade registrada!', 'success');
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
      <div class="history-item clickable" style="border-left:3px solid var(--green-primary); cursor:pointer;" onclick="openCadastroInstituicaoForm(null, '${c.id}')">
        <div class="history-item-header">
          <div>
            <h4 style="font-size:0.9rem;font-weight:700;color:var(--green-primary);">${c.name}</h4>
            <span style="font-size:0.72rem;color:var(--text-muted);">${c.pastor || ''}${c.address ? ' · ' + c.address : ''}</span>
          </div>
          ${rawPhone ? `<a href="${waUrl}" target="_blank" onclick="event.stopPropagation();" style="padding:4px 8px;border-radius:6px;background:var(--green-light);color:var(--green-primary);font-size:0.72rem;font-weight:700;text-decoration:none;">WhatsApp</a>` : ''}
        </div>
        <div style="font-size:0.76rem;background:var(--bg-beige);padding:8px 10px;border-radius:8px;display:flex;flex-direction:column;gap:3px;">
          ${c.phone ? `<div><strong>Telefone:</strong> ${c.phone}</div>` : ''}
          ${c.instagram ? `<div><strong>Instagram/Site:</strong> ${c.instagram}</div>` : ''}
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button onclick="event.stopPropagation(); handleDeleteInstituicao('${c.id}')" style="background:none;border:none;color:var(--text-muted);font-size:0.72rem;cursor:pointer;font-weight:600;">Remover</button>
        </div>
      </div>
    `;
  }).join('');
}

function openCadastroInstituicaoForm(pendingActivityData, editId = null) {
  // pendingActivityData: se vier de openNovaAtividadeForm, guarda os dados parciais
  const modalBody = document.getElementById('modal-generic-body');
  const modalHeader = document.getElementById('modal-generic-header');
  const modalFooter = document.getElementById('modal-generic-footer');

  const fromActivity = pendingActivityData !== null && pendingActivityData !== undefined;
  const pendingJson = fromActivity ? encodeURIComponent(JSON.stringify(pendingActivityData)) : 'null';

  const inst = editId ? dbManager.getChurches().find(x => x.id === editId) : null;

  modalHeader.className = 'modal-header theme-instituicoes';
  modalHeader.innerHTML = `
    <div class="modal-header-title">
      <button type="button" class="btn-step" onclick="${fromActivity ? `openNovaAtividadeForm(JSON.parse(decodeURIComponent('${pendingJson}')))` : 'openCadastrosInstituicoes()'}" style="width:32px;height:32px;font-size:1rem;margin-right:4px;">←</button>
      <div class="modal-unit-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div>
        <h2>${editId ? 'Editar Cadastro' : 'Nova Instituição'}</h2>
        <p style="font-size:0.75rem;">${editId ? 'Atualizar dados cadastrais' : (fromActivity ? 'Cadastrar e retornar ao registro de atividade' : 'Cadastrar instituição parceira')}</p>
      </div>
    </div>
    <button class="btn-close-modal" onclick="closeModal('modal-generic')">&times;</button>
  `;

  modalBody.innerHTML = `
    <form id="inst-add-form" onsubmit="event.preventDefault();">
      ${fromActivity ? `<div style="background:var(--bg-beige);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:0.78rem;color:var(--text-muted);border-left:3px solid var(--gold-primary);">💡 Após salvar, você será redirecionado de volta ao registro de atividade com esta instituição já selecionada.</div>` : ''}

      <div class="form-group">
        <label class="form-label">Nome da Instituição *</label>
        <input type="text" id="inst-name" class="form-input" placeholder="Ex: Igreja Batista Central, ONG Abraço" value="${inst ? (inst.name || '') : ''}" required autofocus>
      </div>

      <div class="form-group">
        <label class="form-label">Endereço</label>
        <input type="text" id="inst-address" class="form-input" placeholder="Ex: Rua das Flores, 123 - Centro" value="${inst ? (inst.address || '') : ''}">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Presidente / Responsável</label>
          <input type="text" id="inst-pastor" class="form-input" placeholder="Ex: Pastor João" value="${inst ? (inst.pastor || '') : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Telefone</label>
          <input type="tel" id="inst-phone" class="form-input" placeholder="(11) 99999-9999" value="${inst ? (inst.phone || '') : ''}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Instagram ou Site</label>
        <input type="text" id="inst-instagram" class="form-input" placeholder="Ex: @nome_instagram ou https://..." value="${inst ? (inst.instagram || '') : ''}">
      </div>
    </form>
  `;

  modalFooter.innerHTML = `
    <button type="button" class="btn-primary-action" style="width:100%;background:linear-gradient(135deg,#1E4D2B,#2E6A3B);color:#FFF;font-weight:800;" onclick="handleSaveInstituicao(${fromActivity ? `JSON.parse(decodeURIComponent('${pendingJson}'))` : 'null'}, '${editId || ''}')">${editId ? '💾 Salvar Alterações' : '💾 Salvar Instituição'}</button>
  `;
}

async function handleSaveInstituicao(pendingActivityData, editId) {
  const name = document.getElementById('inst-name')?.value.trim();
  if (!name) { showToast('Informe o nome da instituição!', 'warning'); return; }

  const existingInst = editId ? dbManager.getChurches().find(x => x.id === editId) : null;

  const instData = {
    id: editId || ('chu_' + Date.now()),
    name,
    address: document.getElementById('inst-address')?.value.trim() || '',
    pastor: document.getElementById('inst-pastor')?.value.trim() || '',
    phone: document.getElementById('inst-phone')?.value.trim() || '',
    instagram: document.getElementById('inst-instagram')?.value.trim() || '',
    city: existingInst?.city || '',
    neighborhood: existingInst?.neighborhood || '',
    supportType: existingInst?.supportType || '',
    lastVisit: existingInst?.lastVisit || '',
    notes: existingInst?.notes || ''
  };

  showLoading(editId ? 'Atualizando cadastro...' : 'Cadastrando instituição...');
  try {
    await dbManager.saveChurch(instData);
    showToast(editId ? `"${name}" atualizada com sucesso!` : `"${name}" cadastrada!`, 'success');
    if (pendingActivityData !== null && pendingActivityData !== undefined) {
      // Retorna ao formulário de atividade com instituição já selecionada
      const updated = { ...pendingActivityData, institutionId: instData.id };
      openNovaAtividadeForm(updated, pendingActivityData.id || null);
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
