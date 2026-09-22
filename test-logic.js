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

console.log('✅ Todos os testes de lógica de sanitização e dados passaram com 100% de sucesso!');

