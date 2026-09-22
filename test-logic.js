// Teste de integridade de lógica de dados e sanitização
const assert = require('assert');

// Mock de localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Teste de Sanitização (Pilar 1.4 do Guia CUIDAR)
function sanitize(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

const dirtyObject = {
  name: 'Relatório Teste',
  idade: undefined,
  detalhes: {
    obs: undefined,
    status: 'ok'
  }
};

const clean = sanitize(dirtyObject);
assert.strictEqual(clean.idade, null, 'Undefined deve ser convertido para null');
assert.strictEqual(clean.detalhes.obs, null, 'Undefined aninhado deve ser convertido para null');
assert.strictEqual(clean.detalhes.status, 'ok');

// Teste de formato de data BR
function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

assert.strictEqual(formatDateBR('2026-09-18'), '18/09/2026');

// Teste de cálculo de métricas com censo residencial contínuo
function calculateHeroMetrics(reports, todayStr) {
  const unitDefaults = { missao: 45, macedonia: 60, feminina: 30 };
  const unitIds = ['missao', 'macedonia', 'feminina'];

  let acolhidos = 0;
  unitIds.forEach(uId => {
    const repToday = reports.find(r => r.unitId === uId && r.date === todayStr);
    if (repToday && repToday.acolhidosPresentes > 0) {
      acolhidos += repToday.acolhidosPresentes;
      return;
    }
    const unitReports = reports
      .filter(r => r.unitId === uId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.updatedAt || 0) - (a.updatedAt || 0));
    
    const latestRep = unitReports.find(r => (r.acolhidosPresentes || 0) > 0);
    if (latestRep && latestRep.acolhidosPresentes > 0) {
      acolhidos += latestRep.acolhidosPresentes;
    } else {
      acolhidos += unitDefaults[uId] || 0;
    }
  });

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

  return { acolhidos, refeicoes, triagens };
}

// Caso 1: relatórios salvos ontem, nenhum hoje -> censo contínuo ativo
const mockReportsPast = [
  { id: '1', unitId: 'missao', date: '2026-09-21', acolhidosPresentes: 45, novasTriagens: 2, refeicoes: { cafe: 45, almoco: 49, lanche: 45, jantar: 45 } },
  { id: '2', unitId: 'macedonia', date: '2026-09-21', acolhidosPresentes: 60, novasTriagens: 2, refeicoes: { cafe: 60, almoco: 62, lanche: 60, jantar: 60 } },
  { id: '3', unitId: 'feminina', date: '2026-09-21', acolhidosPresentes: 30, novasTriagens: 1, refeicoes: { cafe: 30, almoco: 32, lanche: 30, jantar: 30 } }
];
const res1 = calculateHeroMetrics(mockReportsPast, '2026-09-22');
assert.strictEqual(res1.acolhidos, 135, 'Total acolhidos residentes deve ser 135');
assert.strictEqual(res1.refeicoes, 548, 'Total refeicoes do fechamento anterior deve ser 548');
assert.strictEqual(res1.triagens, 5, 'Total triagens do fechamento anterior deve ser 5');

// Caso 2: Missão salvou hoje com 46 acolhidos e 1 triagem
const mockReportsToday = [
  ...mockReportsPast,
  { id: '4', unitId: 'missao', date: '2026-09-22', acolhidosPresentes: 46, novasTriagens: 1, refeicoes: { cafe: 46, almoco: 48, lanche: 46, jantar: 46 } }
];
const res2 = calculateHeroMetrics(mockReportsToday, '2026-09-22');
assert.strictEqual(res2.acolhidos, 136, 'Acolhidos deve atualizar para 46 + 60 + 30 = 136');
assert.strictEqual(res2.refeicoes, 186, 'Refeições de hoje deve ser apenas as lançadas hoje na Missão (186)');
assert.strictEqual(res2.triagens, 1, 'Triagens de hoje deve ser 1');

console.log('✅ Todos os testes de lógica de sanitização e dados passaram com 100% de sucesso!');
