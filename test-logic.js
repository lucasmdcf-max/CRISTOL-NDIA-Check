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
    if (repToday && typeof repToday.acolhidosPresentes === 'number') {
      acolhidos += repToday.acolhidosPresentes;
      return;
    }
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

// Caso 3: Missão alterada para 0 acolhidos presentes pelo usuário
const mockReportsZero = [
  ...mockReportsPast,
  { id: '5', unitId: 'missao', date: '2026-09-22', acolhidosPresentes: 0, novasTriagens: 0, refeicoes: { cafe: 0, almoco: 0, lanche: 0, jantar: 0 } }
];
const res3 = calculateHeroMetrics(mockReportsZero, '2026-09-22');
assert.strictEqual(res3.acolhidos, 90, 'Acolhidos deve ser 0 + 60 + 30 = 90 quando Missão for zerada');
assert.strictEqual(res3.refeicoes, 0, 'Refeições de hoje deve ser 0');
assert.strictEqual(res3.triagens, 0, 'Triagens de hoje deve ser 0');

// Teste de cálculo das 7 bolinhas neon da Missão (com suporte a answeredQuestions e valor 0)
function calculateMissaoDots(report) {
  if (!report) return [false, false, false, false, false, false, false];
  const ans = report.answeredQuestions || {};
  const hasAnsFlags = !!report.answeredQuestions;

  const pTotal = report.pessoasAtendidas?.total ?? report.acolhidosPresentes ?? 0;
  const ref = report.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0);

  return [
    hasAnsFlags ? !!ans.pessoas : (pTotal > 0),
    hasAnsFlags ? !!ans.refeicoes : (totalRef > 0),
    hasAnsFlags ? !!ans.banhos : ((report.banhos || 0) > 0),
    hasAnsFlags ? !!ans.cortes : ((report.cortesCabelo || 0) > 0),
    hasAnsFlags ? !!ans.cultos : ((report.cultos || 0) > 0),
    hasAnsFlags ? !!ans.buscaAtiva : (((report.buscaAtivaPessoas || 0) > 0) || ((report.pessoasAtendidas?.buscaAtiva || 0) > 0)),
    hasAnsFlags ? !!ans.decisoes : ((report.decisoesCristo || 0) > 0)
  ];
}

const mockMissaoCompleta = {
  pessoasAtendidas: { total: 45, rua: 10, unidade: 20, buscaAtiva: 15 },
  refeicoes: { cafe: 20, almoco: 30, lanche: 20, jantar: 20, buscaAtiva: 10 },
  banhos: 18,
  cortesCabelo: 5,
  cultos: 2,
  buscaAtivaPessoas: 15,
  decisoesCristo: 3
};
const dotsCompleta = calculateMissaoDots(mockMissaoCompleta);
assert.deepStrictEqual(dotsCompleta, [true, true, true, true, true, true, true], 'Todas as 7 bolinhas devem acender');

// Teste com answeredQuestions ativados mesmo com valor 0
const mockMissaoComZeroRespondido = {
  pessoasAtendidas: { total: 0, rua: 0, unidade: 0, buscaAtiva: 0 },
  refeicoes: { cafe: 0, almoco: 0, lanche: 0, jantar: 0, buscaAtiva: 0 },
  banhos: 0,
  cortesCabelo: 0,
  cultos: 1,
  buscaAtivaPessoas: 0,
  decisoesCristo: 0,
  answeredQuestions: {
    pessoas: true, // Ativado mesmo sendo 0
    refeicoes: true, // Ativado mesmo sendo 0
    banhos: true, // Ativado mesmo sendo 0
    cortes: false, // NÃO ativado
    cultos: true,
    buscaAtiva: false, // NÃO ativado
    decisoes: true // Ativado mesmo sendo 0
  }
};
const dotsComZero = calculateMissaoDots(mockMissaoComZeroRespondido);
assert.deepStrictEqual(dotsComZero, [true, true, true, false, true, false, true], 'Perguntas ativadas devem acender bolinhas mesmo se o valor for 0');

// Teste de validação por bloco (só considera preenchido se TODOS os campos do bloco forem ativados)
function checkBlockCompletion(subfields, requiredKeys) {
  return requiredKeys.every(k => subfields[k] === true);
}

const blocoPessoasIncompleto = { pRua: true, pUnidade: true, pBusca: false };
assert.strictEqual(checkBlockCompletion(blocoPessoasIncompleto, ['pRua', 'pUnidade', 'pBusca']), false, 'Bloco de pessoas incompleto não deve contar como respondido');

const blocoPessoasCompleto = { pRua: true, pUnidade: true, pBusca: true };
assert.strictEqual(checkBlockCompletion(blocoPessoasCompleto, ['pRua', 'pUnidade', 'pBusca']), true, 'Bloco de pessoas completo deve contar como respondido');

const blocoRefeicoesIncompleto = { rCafe: true, rAlmoco: true, rLanche: true, rJantar: true, rBusca: false };
assert.strictEqual(checkBlockCompletion(blocoRefeicoesIncompleto, ['rCafe', 'rAlmoco', 'rLanche', 'rJantar', 'rBusca']), false, 'Bloco de refeições incompleto não deve contar');

const blocoRefeicoesCompleto = { rCafe: true, rAlmoco: true, rLanche: true, rJantar: true, rBusca: true };
assert.strictEqual(checkBlockCompletion(blocoRefeicoesCompleto, ['rCafe', 'rAlmoco', 'rLanche', 'rJantar', 'rBusca']), true, 'Bloco de refeições completo deve contar');

// Teste de integridade de estoque: adicionar item NÃO pode apagar os itens existentes
const stockSeed = [
  { id: 'stk_missao_g01', name: 'Feijões', unitId: 'missao' },
  { id: 'stk_missao_g02', name: 'Arroz', unitId: 'missao' }
];
function testMergeStock(current, defaults) {
  const map = new Map();
  defaults.forEach(d => map.set(d.id, { ...d }));
  (current || []).forEach(c => map.set(c.id, c));
  return Array.from(map.values());
}
const initialStock = testMergeStock([], stockSeed);
assert.strictEqual(initialStock.length, 2, 'Estoque inicial deve ter 2 itens');

const newItem = { id: 'stk_missao_custom_123', name: 'Azeite', unitId: 'missao' };
const stockAfterAdd = testMergeStock([...initialStock, newItem], stockSeed);
assert.strictEqual(stockAfterAdd.length, 3, 'Estoque após adição deve ter 3 itens');
assert(stockAfterAdd.some(i => i.id === 'stk_missao_g01'), 'Feijões devem continuar no estoque');
assert(stockAfterAdd.some(i => i.id === 'stk_missao_g02'), 'Arroz deve continuar no estoque');
assert(stockAfterAdd.some(i => i.id === 'stk_missao_custom_123'), 'Novo item deve estar no estoque');

console.log('✅ Todos os testes de lógica de sanitização e dados passaram com 100% de sucesso!');

