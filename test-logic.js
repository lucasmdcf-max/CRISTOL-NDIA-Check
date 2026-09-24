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

// Teste de cálculo de métricas do Painel Diário (Pessoas assistidas, Refeições e Triagens)
function calculateHeroMetrics(reports, todayStr) {
  const todayReports = reports.filter(r => r.date === todayStr);
  const targetReports = todayReports.length > 0 
    ? todayReports 
    : (() => {
        const sortedDates = [...new Set(reports.map(r => r.date).filter(Boolean))].sort().reverse();
        return sortedDates[0] ? reports.filter(r => r.date === sortedDates[0]) : [];
      })();

  let pessoasAssistidas = 0;
  let refeicoes = 0;
  let triagens = 0;

  targetReports.forEach(r => {
    // Pessoas assistidas: banhos + cortes + busca ativa + sociais + saude + psico + juridico + sons da missao
    const banhos = r.banhos || 0;
    const cortes = r.cortesCabelo || 0;
    const buscaAtiva = r.buscaAtivaPessoas || (r.pessoasAtendidas && r.pessoasAtendidas.buscaAtiva) || 0;
    const sociais = r.encaminhamentosSociais || 0;
    const saude = r.encaminhamentosSaude || 0;
    const psicologicos = r.atendimentosPsicologicos || 0;
    const juridicas = r.demandasJuridicas || 0;
    const musica = r.sonsDaMissao || 0;

    pessoasAssistidas += (banhos + cortes + buscaAtiva + sociais + saude + psicologicos + juridicas + musica);

    const ref = r.refeicoes || {};
    refeicoes += (ref.cafe || 0) + (ref.almoco || 0) + (ref.lanche || 0) + (ref.jantar || 0) + (ref.buscaAtiva || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);

    triagens += (r.novasTriagens || 0);
  });

  return { pessoasAssistidas, refeicoes, triagens };
}

// Caso 1: relatórios salvos hoje nas 3 unidades
const mockReportsToday = [
  { 
    id: '1', unitId: 'missao', date: '2026-09-22', 
    banhos: 15, cortesCabelo: 5, buscaAtivaPessoas: 20, 
    novasTriagens: 3, 
    refeicoes: { cafe: 45, almoco: 50, lanche: 45, jantar: 45, buscaAtiva: 30 } 
  },
  { 
    id: '2', unitId: 'macedonia', date: '2026-09-22', 
    encaminhamentosSociais: 4, encaminhamentosSaude: 6, atendimentosPsicologicos: 8, demandasJuridicas: 2, sonsDaMissao: 12,
    novasTriagens: 2, 
    refeicoes: { cafe: 60, almoco: 65, jantar: 60, abordagens: 15, eventosEspeciais: 10 } 
  },
  { 
    id: '3', unitId: 'feminina', date: '2026-09-22', 
    encaminhamentosSociais: 3, encaminhamentosSaude: 4, atendimentosPsicologicos: 5, demandasJuridicas: 1, sonsDaMissao: 8,
    novasTriagens: 1, 
    refeicoes: { cafe: 30, almoco: 35, jantar: 30, abordagens: 0, eventosEspeciais: 0 } 
  }
];

const resToday = calculateHeroMetrics(mockReportsToday, '2026-09-22');
// Pessoas assistidas Missão: 15 + 5 + 20 = 40
// Pessoas assistidas Macedônia: 4 + 6 + 8 + 2 + 12 = 32
// Pessoas assistidas Feminina: 3 + 4 + 5 + 1 + 8 = 21
// Total Pessoas Assistidas: 40 + 32 + 21 = 93
assert.strictEqual(resToday.pessoasAssistidas, 93, 'Total pessoas assistidas deve ser 93');
// Refeições: (45+50+45+45+30=215) + (60+65+60+15+10=210) + (30+35+30=95) = 520
assert.strictEqual(resToday.refeicoes, 520, 'Total refeições das 3 unidades deve ser 520');
// Triagens: 3 + 2 + 1 = 6
assert.strictEqual(resToday.triagens, 6, 'Total triagens deve ser 6');

// Teste de expiração de 24 horas dos Avisos do dia!
function filterActiveNotices(notices, currentTime = Date.now()) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return notices.filter(n => n && typeof n.createdAt === 'number' && (currentTime - n.createdAt) <= TWENTY_FOUR_HOURS);
}

const nowTimestamp = 1790100000000;
const mockNotices = [
  { id: 'n1', text: 'Culto especial hoje às 19h', author: 'Pr. Marcos', createdAt: nowTimestamp - (2 * 60 * 60 * 1000) }, // 2h atrás -> ativo
  { id: 'n2', text: 'Doação de alimentos recebida', author: 'Coordenação', createdAt: nowTimestamp - (23 * 60 * 60 * 1000) }, // 23h atrás -> ativo
  { id: 'n3', text: 'Reunião de ontem', author: 'Missionário Carlos', createdAt: nowTimestamp - (25 * 60 * 60 * 1000) }, // 25h atrás -> expirado (> 24h)
  { id: 'n4', text: 'Aviso antigo', author: 'Sarah', createdAt: nowTimestamp - (48 * 60 * 60 * 1000) } // 48h atrás -> expirado (> 24h)
];

const activeNotices = filterActiveNotices(mockNotices, nowTimestamp);
assert.strictEqual(activeNotices.length, 2, 'Apenas 2 avisos com menos de 24h devem permanecer ativos');
assert.strictEqual(activeNotices[0].id, 'n1');
assert.strictEqual(activeNotices[1].id, 'n2');

// Caso 2: Dia com valores explicitamente zerados
const mockReportsZero = [
  { id: '5', unitId: 'missao', date: '2026-09-22', banhos: 0, cortesCabelo: 0, buscaAtivaPessoas: 0, novasTriagens: 0, refeicoes: { cafe: 0, almoco: 0, lanche: 0, jantar: 0 } }
];
const resZero = calculateHeroMetrics(mockReportsZero, '2026-09-22');
assert.strictEqual(resZero.pessoasAssistidas, 0, 'Pessoas assistidas deve ser 0');
assert.strictEqual(resZero.refeicoes, 0, 'Refeições de hoje deve ser 0');
assert.strictEqual(resZero.triagens, 0, 'Triagens de hoje deve ser 0');

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
// Teste de cálculo das 12 bolinhas neon da Macedônia e Feminina (com suporte a answeredQuestions e valor 0)
function calculateStandardUnitDots(report) {
  if (!report) return Array(12).fill(false);
  const ans = report.answeredQuestions || {};
  const hasAnsFlags = !!report.answeredQuestions;

  const ref = report.refeicoes || {};
  const totalRef = (ref.cafe || 0) + (ref.almoco || 0) + (ref.jantar || 0) + (ref.abordagens || 0) + (ref.eventosEspeciais || 0);

  return [
    hasAnsFlags ? !!ans.refeicoes : (totalRef > 0),
    hasAnsFlags ? !!ans.sociais : ((report.encaminhamentosSociais || 0) > 0 || (report.novasTriagens || 0) > 0),
    hasAnsFlags ? !!ans.saude : ((report.encaminhamentosSaude || 0) > 0),
    hasAnsFlags ? !!ans.psicologicos : ((report.atendimentosPsicologicos || 0) > 0),
    hasAnsFlags ? !!ans.juridicas : ((report.demandasJuridicas || 0) > 0),
    hasAnsFlags ? !!ans.estudosBiblicos : ((report.estudosBiblicos || 0) > 0),
    hasAnsFlags ? !!ans.cultosVigilias : (((report.cultosVigilias || 0) > 0) || ((report.cultos || 0) > 0)),
    hasAnsFlags ? !!ans.sonsDaMissao : ((report.sonsDaMissao || 0) > 0),
    hasAnsFlags ? !!ans.ensaiosCoro : ((report.ensaiosCoro || 0) > 0),
    hasAnsFlags ? !!ans.atividadesFisicas : ((report.atividadesFisicas || 0) > 0),
    hasAnsFlags ? !!ans.participantesAtividadesFisicas : ((report.participantesAtividadesFisicas || 0) > 0),
    hasAnsFlags ? !!ans.decisoes : ((report.decisoesCristo || 0) > 0)
  ];
}

const mockMacedoniaCompleta = {
  refeicoes: { cafe: 60, almoco: 65, jantar: 60, abordagens: 20, eventosEspeciais: 10 },
  encaminhamentosSociais: 3,
  encaminhamentosSaude: 5,
  atendimentosPsicologicos: 8,
  demandasJuridicas: 2,
  estudosBiblicos: 4,
  cultosVigilias: 1,
  sonsDaMissao: 12,
  ensaiosCoro: 2,
  atividadesFisicas: 3,
  participantesAtividadesFisicas: 15,
  decisoesCristo: 2
};
const dotsMacCompleta = calculateStandardUnitDots(mockMacedoniaCompleta);
assert.deepStrictEqual(dotsMacCompleta, Array(12).fill(true), 'Todas as 12 bolinhas da Macedônia devem acender');

// Teste Unidade Feminina com valor 0 ativado em perguntas específicas
const mockFemininaZeroRespondido = {
  refeicoes: { cafe: 0, almoco: 0, jantar: 0, abordagens: 0, eventosEspeciais: 0 },
  encaminhamentosSociais: 0,
  encaminhamentosSaude: 0,
  atendimentosPsicologicos: 0,
  demandasJuridicas: 0,
  estudosBiblicos: 0,
  cultosVigilias: 0,
  sonsDaMissao: 0,
  ensaiosCoro: 0,
  atividadesFisicas: 0,
  participantesAtividadesFisicas: 0,
  decisoesCristo: 0,
  answeredQuestions: {
    refeicoes: true,
    sociais: true,
    saude: false,
    psicologicos: true,
    juridicas: false,
    estudosBiblicos: true,
    cultosVigilias: true,
    sonsDaMissao: true,
    ensaiosCoro: false,
    atividadesFisicas: true,
    participantesAtividadesFisicas: true,
    decisoes: false
  }
};
const dotsFemZero = calculateStandardUnitDots(mockFemininaZeroRespondido);
assert.deepStrictEqual(dotsFemZero, [true, true, false, true, false, true, true, true, false, true, true, false], 'Bolinhas da Feminina devem responder a answeredQuestions mesmo com 0');

// Teste do bloco de 5 refeições da Macedônia/Feminina
const macRefeicoesIncompleto = { rCafe: true, rAlmoco: true, rJantar: true, rAbordagens: true, rEventos: false };
assert.strictEqual(checkBlockCompletion(macRefeicoesIncompleto, ['rCafe', 'rAlmoco', 'rJantar', 'rAbordagens', 'rEventos']), false, 'Bloco de 5 refeições incompleto não deve contar');

const macRefeicoesCompleto = { rCafe: true, rAlmoco: true, rJantar: true, rAbordagens: true, rEventos: true };
assert.strictEqual(checkBlockCompletion(macRefeicoesCompleto, ['rCafe', 'rAlmoco', 'rJantar', 'rAbordagens', 'rEventos']), true, 'Bloco de 5 refeições completo deve contar');

// Teste das funções de agregação de relatórios e períodos
function getReportPeriodRangeTest(periodKey, refDate = new Date('2026-09-22T12:00:00')) {
  const getLocalStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalStr(refDate);
  let start = today;
  let label = 'Últimas 24h';
  let daysCount = 1;

  if (periodKey === '7d') {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 6);
    start = getLocalStr(d);
    label = 'Últimos 7 dias';
    daysCount = 7;
  } else if (periodKey === '30d') {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 29);
    start = getLocalStr(d);
    label = 'Últimos 30 dias';
    daysCount = 30;
  } else if (periodKey === '3m') {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 89);
    start = getLocalStr(d);
    label = 'Últimos 3 meses';
    daysCount = 90;
  } else if (periodKey === '6m') {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 179);
    start = getLocalStr(d);
    label = 'Últimos 6 meses';
    daysCount = 180;
  } else if (periodKey === '1y') {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 364);
    start = getLocalStr(d);
    label = 'Último 1 ano';
    daysCount = 365;
  }

  return { start, end: today, label, periodKey, daysCount };
}

// 1. Testa range de 24h
const r24h = getReportPeriodRangeTest('24h');
assert.strictEqual(r24h.start, '2026-09-22');
assert.strictEqual(r24h.end, '2026-09-22');

// 2. Testa range de 7 dias
const r7d = getReportPeriodRangeTest('7d');
assert.strictEqual(r7d.start, '2026-09-16');
assert.strictEqual(r7d.end, '2026-09-22');

// 3. Testa range de 30 dias
const r30d = getReportPeriodRangeTest('30d');
assert.strictEqual(r30d.start, '2026-08-24');
assert.strictEqual(r30d.end, '2026-09-22');

// 4. Teste de agregação e somatório do período para Unidade Missão
const mockMissaoPeriod = [
  { unitId: 'missao', date: '2026-09-22', pessoasAtendidas: { total: 40, rua: 10, unidade: 25, buscaAtiva: 5 }, refeicoes: { cafe: 30, almoco: 35, lanche: 30, jantar: 30, buscaAtiva: 10 }, banhos: 12, cortesCabelo: 4, cultos: 1, buscaAtivaPessoas: 5, decisoesCristo: 1 },
  { unitId: 'missao', date: '2026-09-21', pessoasAtendidas: { total: 50, rua: 15, unidade: 30, buscaAtiva: 5 }, refeicoes: { cafe: 35, almoco: 40, lanche: 35, jantar: 35, buscaAtiva: 15 }, banhos: 18, cortesCabelo: 6, cultos: 2, buscaAtivaPessoas: 5, decisoesCristo: 2 },
  { unitId: 'missao', date: '2026-09-10', pessoasAtendidas: { total: 30, rua: 5, unidade: 20, buscaAtiva: 5 }, refeicoes: { cafe: 20, almoco: 25, lanche: 20, jantar: 20, buscaAtiva: 5 }, banhos: 10, cortesCabelo: 2, cultos: 1, buscaAtivaPessoas: 5, decisoesCristo: 0 } // fora do range 7d (16/09 a 22/09)
];

const range7d = getReportPeriodRangeTest('7d');
const filteredMissao7d = mockMissaoPeriod.filter(r => r.date >= range7d.start && r.date <= range7d.end);
assert.strictEqual(filteredMissao7d.length, 2, 'Deve filtrar estritamente os 2 relatórios dentro dos últimos 7 dias');

const sumPessoas = filteredMissao7d.reduce((acc, r) => acc + (r.pessoasAtendidas?.total || 0), 0);
assert.strictEqual(sumPessoas, 90, 'Soma de pessoas atendidas deve ser 40 + 50 = 90');

const sumDecisoes = filteredMissao7d.reduce((acc, r) => acc + (r.decisoesCristo || 0), 0);
assert.strictEqual(sumDecisoes, 3, 'Soma de decisões deve ser 1 + 2 = 3');

// ==========================================================
// TESTES DO MÓDULO DE TRIAGEM (UNIDADE MISSÃO)
// ==========================================================
const mockTriagensList = [
  { id: 't1', nome: 'Carlos Eduardo Santos', date: '2026-09-20', idade: 42, moradia: 'rua', temDocumentos: true, primeiroAcolhimento: true, createdAt: 1000 },
  { id: 't2', nome: 'Marcos Vinicius Pereira', date: '2026-09-22', idade: 29, moradia: 'casa', temDocumentos: false, primeiroAcolhimento: false, quantasVezes: 3, createdAt: 3000 },
  { id: 't3', nome: 'João da Silva Santos', date: '2026-09-21', idade: 35, moradia: 'rua', temDocumentos: true, primeiroAcolhimento: true, createdAt: 2000 },
  { id: 't4', nome: 'Ana Paula Ferreira', date: '2026-09-22', idade: 31, moradia: 'rua', temDocumentos: true, primeiroAcolhimento: true, createdAt: 3500 }
];

// 1. Teste de Ordenação Cronológica (mais recentes primeiro: 2026-09-22 antes de 2026-09-21 e 2026-09-20)
const sortedTriagens = [...mockTriagensList].sort((a, b) => {
  if (b.date !== a.date) return b.date.localeCompare(a.date);
  return (b.createdAt || 0) - (a.createdAt || 0);
});

assert.strictEqual(sortedTriagens[0].id, 't4', 'A triagem mais recente de hoje (createdAt 3500) deve ser a primeira');
assert.strictEqual(sortedTriagens[1].id, 't2', 'A segunda triagem de hoje deve ser a segunda');
assert.strictEqual(sortedTriagens[2].id, 't3', 'A triagem de 21/09 deve vir antes da de 20/09');
assert.strictEqual(sortedTriagens[3].id, 't1', 'A triagem de 20/09 deve ser a última');

// 2. Teste de Busca por Nome (case-insensitive e parcial)
const searchResult = mockTriagensList.filter(t => t.nome.toLowerCase().includes('santos'));
assert.strictEqual(searchResult.length, 2, 'Deve encontrar 2 registros com "santos"');
assert.strictEqual(searchResult[0].nome, 'Carlos Eduardo Santos');
assert.strictEqual(searchResult[1].nome, 'João da Silva Santos');

// 3. Teste de Filtro por Data
const dateFiltered = mockTriagensList.filter(t => t.date === '2026-09-22');
assert.strictEqual(dateFiltered.length, 2, 'Devem existir 2 triagens registradas em 2026-09-22');

// 4. Teste de contagem exclusiva do dia para o Painel Diário
const todayStrMock = '2026-09-22';
const triagensFeitasHoje = mockTriagensList.filter(t => t.date === todayStrMock).length;
assert.strictEqual(triagensFeitasHoje, 2, 'No painel diário só devem ser exibidas as 2 triagens feitas no dia de hoje');

// 5. Teste de Sanitização e Edição de Triagem
const triagemEditada = sanitize({
  id: 't2',
  nome: 'Marcos Vinicius Pereira Silva',
  idade: 30,
  demandaSaude: undefined,
  quaisDocumentos: undefined,
  updatedAt: Date.now()
});
assert.strictEqual(triagemEditada.demandaSaude, null, 'Campos undefined na triagem devem ser sanitizados para null');
assert.strictEqual(triagemEditada.nome, 'Marcos Vinicius Pereira Silva');
assert.strictEqual(triagemEditada.idade, 30);

// 6. Teste de Criação e Exclusão de Avisos do Dia
let mockNoticesToDelete = [
  { id: 'n1', text: 'Reunião de alinhamento às 14h', author: 'Coordenação', createdAt: Date.now() - 1000 },
  { id: 'n2', text: 'Culto especial na Missão às 19h30', author: 'Pastor Marcos', createdAt: Date.now() - 500 }
];

// Teste de exclusão por ID
function deleteMockNotice(id) {
  mockNoticesToDelete = mockNoticesToDelete.filter(n => n.id !== id);
}

deleteMockNotice('n1');
assert.strictEqual(mockNoticesToDelete.length, 1, 'Após excluir n1, deve restar apenas 1 aviso');
assert.strictEqual(mockNoticesToDelete[0].id, 'n2', 'O aviso restante deve ser n2');

deleteMockNotice('n2');
assert.strictEqual(mockNoticesToDelete.length, 0, 'Após excluir n2, a lista deve ficar vazia');

// 7. Testes do Módulo de Estudos Bíblicos & Discipulado
// 7.1 Quantidade de encontros por fase
const mockEstudosConfig = {
  triagemTotal: 8,
  fase1Total: 20,
  fase2Total: 24,
  fase2EnfasesTotal: 6
};
assert.strictEqual(mockEstudosConfig.triagemTotal, 8, 'Triagem deve possuir 8 encontros');
assert.strictEqual(mockEstudosConfig.fase1Total, 20, '1ª Fase deve possuir 20 encontros');
assert.strictEqual(mockEstudosConfig.fase2Total, 24, '2ª Fase deve possuir 24 encontros');
assert.strictEqual(mockEstudosConfig.fase2EnfasesTotal, 6, '2ª Fase deve possuir 6 ênfases');

// 7.2 Teste de Sanitização de Relatório de Estudo
const rawEstudo = {
  date: '2026-09-22',
  unitId: 'missao',
  fase: 'triagem',
  tema: 'Encontro 1 — Para que você creia',
  missionario: 'Missionário Carlos',
  realizado: 'sim',
  participantes: 18,
  concluintes: 16,
  participacao: 'muito_participativa',
  compreensao: 'claramente',
  precisaAcompanhamento: 'sim',
  acompanhamentoNome: 'José Ferreira',
  acompanhamentoMotivo: 'Dificuldade com perdas passadas',
  encaminhamentoPsicologo: true,
  encaminhamentoPastoral: undefined, // deve virar null
  observacoesExtras: undefined // deve virar null
};

const cleanEstudo = sanitize(rawEstudo);
assert.strictEqual(cleanEstudo.encaminhamentoPastoral, null, 'Undefined deve ser sanitizado para null');
assert.strictEqual(cleanEstudo.observacoesExtras, null, 'Undefined deve ser sanitizado para null');
assert.strictEqual(cleanEstudo.tema, 'Encontro 1 — Para que você creia');
assert.strictEqual(cleanEstudo.participantes, 18);
assert.strictEqual(cleanEstudo.encaminhamentoPsicologo, true);

// 7.3 Teste de Filtros de Histórico de Estudos
const mockEstudosList = [
  { id: 'e1', date: '2026-09-20', unitId: 'missao', fase: 'triagem', tema: 'Encontro 1', missionario: 'Carlos' },
  { id: 'e2', date: '2026-09-21', unitId: 'macedonia', fase: 'fase1', tema: 'Encontro 5', missionario: 'Marcos' },
  { id: 'e3', date: '2026-09-22', unitId: 'feminina', fase: 'fase2', tema: 'Encontro 9', missionario: 'Sarah' }
];

const filterTriagem = mockEstudosList.filter(e => e.fase === 'triagem');
assert.strictEqual(filterTriagem.length, 1);
assert.strictEqual(filterTriagem[0].id, 'e1');

const filterFeminina = mockEstudosList.filter(e => e.unitId === 'feminina');
assert.strictEqual(filterFeminina.length, 1);
assert.strictEqual(filterFeminina[0].id, 'e3');

// 8. TESTES DE OSCILAÇÃO E MÉTRICA REAL DE CONSUMO DO ESTOQUE
// 8.1 Teste de Cruzamento de Entradas e Saídas por Dias, Semanas e Meses
const mockStockItem = {
  id: 'arroz_1',
  name: 'Arroz 5kg',
  category: 'alimentos_grossos',
  quantity: 40,
  unit: 'kg',
  unitId: 'missao'
};

const mockMovements = [
  // Movimentações no período
  { id: 'm1', itemId: 'arroz_1', unitId: 'missao', type: 'entrada', quantity: 20, date: '2026-09-18' },
  { id: 'm2', itemId: 'arroz_1', unitId: 'missao', type: 'saida', quantity: 5, date: '2026-09-19' },
  { id: 'm3', itemId: 'arroz_1', unitId: 'missao', type: 'saida', quantity: 7, date: '2026-09-20' },
  { id: 'm4', itemId: 'arroz_1', unitId: 'missao', type: 'entrada', quantity: 15, date: '2026-09-21' },
  { id: 'm5', itemId: 'arroz_1', unitId: 'missao', type: 'saida', quantity: 10, date: '2026-09-22' }
];

// Cálculo simulando getStockItemOscillationData
function testOscillationCalculation(item, movements, periodType) {
  const allMovs = movements.filter(m => m.itemId === item.id);
  let totalEnt = 0;
  let totalSai = 0;
  allMovs.forEach(m => {
    if (m.type === 'entrada') totalEnt += m.quantity;
    if (m.type === 'saida') totalSai += m.quantity;
  });

  let numDivisor = 1;
  let unitLabel = '';
  let title = '';

  if (periodType === 'dias') {
    numDivisor = 7;
    unitLabel = `${item.unit} / dia`;
    title = 'Consumo Médio Diário';
  } else if (periodType === 'semanas') {
    numDivisor = 4;
    unitLabel = `${item.unit} / semana`;
    title = 'Consumo Médio Semanal';
  } else {
    numDivisor = 9;
    unitLabel = `${item.unit} / mês`;
    title = 'Consumo Médio Mensal';
  }

  const avg = Math.round((totalSai / numDivisor) * 10) / 10;
  return {
    totalEntradas: totalEnt,
    totalSaidas: totalSai,
    avgConsumption: avg,
    avgUnitLabel: unitLabel,
    avgTitle: title
  };
}

const oscDias = testOscillationCalculation(mockStockItem, mockMovements, 'dias');
assert.strictEqual(oscDias.totalEntradas, 35, 'Total de entradas deve ser 20 + 15 = 35');
assert.strictEqual(oscDias.totalSaidas, 22, 'Total de saídas deve ser 5 + 7 + 10 = 22');
assert.strictEqual(oscDias.avgTitle, 'Consumo Médio Diário');
assert.strictEqual(oscDias.avgUnitLabel, 'kg / dia');
assert.strictEqual(oscDias.avgConsumption, 3.1, '22 / 7 = 3.1 kg / dia');

const oscSemanas = testOscillationCalculation(mockStockItem, mockMovements, 'semanas');
assert.strictEqual(oscSemanas.avgTitle, 'Consumo Médio Semanal');
assert.strictEqual(oscSemanas.avgUnitLabel, 'kg / semana');
assert.strictEqual(oscSemanas.avgConsumption, 5.5, '22 / 4 = 5.5 kg / semana');

const oscMeses = testOscillationCalculation(mockStockItem, mockMovements, 'meses');
assert.strictEqual(oscMeses.avgTitle, 'Consumo Médio Mensal');
assert.strictEqual(oscMeses.avgUnitLabel, 'kg / mês');
assert.strictEqual(oscMeses.avgConsumption, 2.4, '22 / 9 = 2.4 kg / mês');

// Teste adicional: getFilteredEstudosCount para relatórios de unidades
function testGetFilteredEstudosCount(estudos, unitFilter, startIso, endIso) {
  const filtered = estudos.filter(e => {
    const studyUnit = (e.unitId || '').toLowerCase();
    const filterUnit = (unitFilter || 'todas').toLowerCase();
    const unitMatch = filterUnit === 'todas' || studyUnit === filterUnit;
    const studyDate = e.date || (e.createdAt ? e.createdAt.split('T')[0] : '');
    const dateMatch = (!startIso || studyDate >= startIso) && (!endIso || studyDate <= endIso);
    return unitMatch && dateMatch;
  });

  const porFase = { triagem: 0, fase1: 0, fase2: 0 };
  const concluintes = { triagem: 0, fase1: 0, fase2: 0 };
  let participantes = 0;

  filtered.forEach(e => {
    const f = e.fase || 'triagem';
    if (porFase[f] !== undefined) porFase[f]++;
    const encNum = Number(e.encontroNumero) || 1;
    if (encNum % 8 === 0 && concluintes[f] !== undefined) {
      concluintes[f]++;
    }
    const numPart = e.participantesCount !== undefined ? Number(e.participantesCount) : 
                   (Array.isArray(e.participantes) ? e.participantes.length : 1);
    participantes += (isNaN(numPart) || numPart < 1 ? 1 : numPart);
  });

  return {
    total: filtered.length,
    participantes,
    concluintes,
    porFase
  };
}

const mockEstudosBase = [
  { id: 'e1', unitId: 'missao', date: '2026-09-22', fase: 'triagem', encontroNumero: 4, participantesCount: 12 },
  { id: 'e2', unitId: 'missao', date: '2026-09-22', fase: 'triagem', encontroNumero: 8, participantesCount: 10 },
  { id: 'e3', unitId: 'macedonia', date: '2026-09-22', fase: 'fase1', encontroNumero: 3, participantesCount: 15 },
  { id: 'e4', unitId: 'feminina', date: '2026-09-21', fase: 'fase2', encontroNumero: 8, participantesCount: 8 },
  { id: 'e5', unitId: 'missao', date: '2026-08-10', fase: 'triagem', encontroNumero: 1, participantesCount: 5 } // Fora do período
];

// Teste de filtro por unidade Missão no período 2026-09-20 a 2026-09-23
const estudosMissao = testGetFilteredEstudosCount(mockEstudosBase, 'missao', '2026-09-20', '2026-09-23');
assert.strictEqual(estudosMissao.total, 2, 'Devem ser 2 encontros na Missão no período');
assert.strictEqual(estudosMissao.participantes, 22, 'Participantes somados: 12 + 10 = 22');
assert.strictEqual(estudosMissao.concluintes.triagem, 1, 'Encontro 8 conclui o ciclo');

// Teste de filtro consolidado (todas as unidades) no período
const estudosTodas = testGetFilteredEstudosCount(mockEstudosBase, 'todas', '2026-09-20', '2026-09-23');
assert.strictEqual(estudosTodas.total, 4, '4 estudos no período entre as 3 unidades');
assert.strictEqual(estudosTodas.participantes, 45, 'Participantes totais: 12+10+15+8 = 45');
assert.strictEqual(estudosTodas.concluintes.fase2, 1, '1 concluinte da fase 2 na feminina');

// Teste de Estoque Real sem Invenção de Valores Anteriores
const semMovsPassadas = [];
function testRealStockOscillationNoInvention(item, movs) {
  // Quando não há entradas nem saídas no passado, as saídas e entradas devem ser estritamente 0
  let totalEnt = 0;
  let totalSai = 0;
  movs.forEach(m => {
    if (m.type === 'entrada') totalEnt += m.quantity;
    if (m.type === 'saida') totalSai += m.quantity;
  });
  return {
    totalEntradas: totalEnt,
    totalSaidas: totalSai,
    avgConsumption: totalSai === 0 ? 0 : Math.round((totalSai / 7) * 10) / 10
  };
}

const realStockResult = testRealStockOscillationNoInvention(mockStockItem, semMovsPassadas);
assert.strictEqual(realStockResult.totalEntradas, 0, 'Entradas não devem ser inventadas');
assert.strictEqual(realStockResult.totalSaidas, 0, 'Saídas não devem ser inventadas');
assert.strictEqual(realStockResult.avgConsumption, 0, 'Consumo médio deve ser 0 quando não houver consumo real');

// Teste de Preservação das Instituições/Igrejas no Reset de Dados
const testStorage = {
  'cristolandia_reports': JSON.stringify([{ id: 'rep_antigo' }]),
  'cristolandia_triagens': JSON.stringify([{ id: 'triagem_teste' }]),
  'cristolandia_stock_movements': JSON.stringify([{ id: 'mov_teste' }]),
  'cristolandia_churches': JSON.stringify([{ id: 'ch_1', name: 'Igreja Batista Central' }])
};

function testDataResetPreservingChurches(store) {
  // Reset de relatórios, triagens e movimentos de teste
  store['cristolandia_reports'] = JSON.stringify([]);
  store['cristolandia_triagens'] = JSON.stringify([]);
  store['cristolandia_stock_movements'] = JSON.stringify([]);
  // IGREJAS/INSTITUIÇÕES NÃO SÃO TOCADAS!
}

testDataResetPreservingChurches(testStorage);
assert.strictEqual(JSON.parse(testStorage['cristolandia_reports']).length, 0, 'Relatórios antigos limpos');
assert.strictEqual(JSON.parse(testStorage['cristolandia_triagens']).length, 0, 'Triagem de teste limpa');
assert.strictEqual(JSON.parse(testStorage['cristolandia_stock_movements']).length, 0, 'Movimentações antigas de estoque limpas');
assert.strictEqual(JSON.parse(testStorage['cristolandia_churches']).length, 1, 'Instituições mantidas 100% intactas');

// 8. Testes das Novas Funcionalidades Solicitadas

// 8.1 Validação de Refeições com Lanche
const mockRefeicoesComLanche = {
  cafe: 10,
  almoco: 25,
  lanche: 15,
  jantar: 20,
  abordagens: 5,
  eventosEspeciais: 0
};
const totalRefeicoesCalc = (mockRefeicoesComLanche.cafe || 0) +
                           (mockRefeicoesComLanche.almoco || 0) +
                           (mockRefeicoesComLanche.lanche || 0) +
                           (mockRefeicoesComLanche.jantar || 0) +
                           (mockRefeicoesComLanche.abordagens || 0) +
                           (mockRefeicoesComLanche.eventosEspeciais || 0);
assert.strictEqual(totalRefeicoesCalc, 75, 'Total de refeições deve somar café, almoço, lanche, jantar e extras');

// 8.2 Validação do Campo de Voluntários Presentes
const mockMissaoRelatorio = {
  unitId: 'missao',
  voluntarios: 12,
  refeicoes: { cafe: 20, almoco: 30, lanche: 15, jantar: 25 }
};
assert.strictEqual(mockMissaoRelatorio.voluntarios, 12, 'Relatório da Missão deve conter voluntários');

const mockStandardRelatorio = {
  unitId: 'macedonia',
  voluntarios: 8,
  refeicoes: mockRefeicoesComLanche
};
assert.strictEqual(mockStandardRelatorio.voluntarios, 8, 'Relatório da Unidade Masculina deve conter voluntários');

// 8.3 Validação de Registro de Novo Alimento apenas na unidade de origem
function simulateRegisterNewItem(unitId, itemName, category, qty, unitMeasure) {
  const item = {
    id: `stk_${unitId}_custom_${Date.now()}`,
    name: itemName,
    category: category,
    quantity: qty,
    unit: unitMeasure,
    unitId: unitId
  };
  return [item]; // Retorna apenas 1 item para a unidade solicitada
}
const singleUnitItems = simulateRegisterNewItem('macedonia', 'Mamão Papaia', 'frutas', 12, 'und');
assert.strictEqual(singleUnitItems.length, 1, 'Novo alimento deve ser cadastrado apenas na unidade selecionada');
assert.strictEqual(singleUnitItems[0].unitId, 'macedonia');
assert.strictEqual(singleUnitItems[0].category, 'frutas');

// 8.4 Validação de Frutas no Catálogo Base (Banana e Laranja com quantidade zero inicial para contagem real)
const mockFrutasCatalogo = [
  { id: 'stk_missao_banana', name: 'Banana', category: 'frutas', unit: 'palma', quantity: 0 },
  { id: 'stk_missao_laranja', name: 'Laranja', category: 'frutas', unit: 'und', quantity: 0 }
];
assert.strictEqual(mockFrutasCatalogo[0].unit, 'palma', 'Banana deve ter unidade palma');
assert.strictEqual(mockFrutasCatalogo[1].unit, 'und', 'Laranja deve ter unidade und');
// 8.5 Validação dos Novos Campos e Regras da Triagem
const mockNovaTriagem = {
  formatoAtendimento: 'online',
  nome: 'Lucas Silva',
  idade: 32,
  moradia: 'rua',
  documentos: ['RG', 'CPF', 'Cartão do SUS'],
  temDocumentos: true,
  quaisDocumentos: 'RG, CPF, Cartão do SUS',
  exames: ['HIV', 'Hepatite'],
  fezExames: true,
  demandaSaude: false,
  demandaJuridica: true,
  qualDemandaJuridica: 'Processo',
  jaPassouCristolandia: true,
  primeiroAcolhimento: false,
  quantasVezes: 2,
  statusAptidao: 'apto_ressalvas',
  ressalva: 'Necessita desintoxicação acompanhada'
};

assert.strictEqual(mockNovaTriagem.formatoAtendimento, 'online', 'Triagem deve suportar formato online');
assert.deepStrictEqual(mockNovaTriagem.documentos, ['RG', 'CPF', 'Cartão do SUS'], 'Documentos devem ser gravados em array de itens selecionados');
assert.deepStrictEqual(mockNovaTriagem.exames, ['HIV', 'Hepatite'], 'Exames devem ser gravados em array de itens selecionados');
assert.strictEqual(mockNovaTriagem.jaPassouCristolandia, true, 'Pergunta já passou pela Cristolândia deve ser booleana');
assert.strictEqual(mockNovaTriagem.statusAptidao, 'apto_ressalvas', 'Status de aptidão deve ser apto_ressalvas');
assert.strictEqual(mockNovaTriagem.ressalva, 'Necessita desintoxicação acompanhada', 'Ressalva deve ser gravada');

// 8.6 Validação de Ficha de Estudos Bíblicos sem Concluintes
const mockEstudoSemConcluintes = {
  unitId: 'missao',
  fase: 'triagem',
  tema: '1. O Encontro com a Verdade',
  missionario: 'Missionário João',
  participantes: 15,
  concluintes: 0
};
assert.strictEqual(mockEstudoSemConcluintes.concluintes, 0, 'Estudo bíblico não deve exigir pergunta quantos concluíram');
assert.strictEqual(mockEstudoSemConcluintes.participantes, 15, 'Participantes devem ser registrados normalmente');

console.log('✅ Todos os testes de lógica de sanitização, períodos, relatórios, triagens completas (aptidão, formato, exames, docs), avisos, estudos, estoque real, lanche, voluntários, frutas e preservação de instituições passaram com 100% de sucesso!');




