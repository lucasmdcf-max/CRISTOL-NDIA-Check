/* ==========================================================================
   CRISTOLÂNDIA CHECK - CAMADA DE DADOS E PERSISTÊNCIA DUAL-LAYER
   Arquitetura CUIDAR: In-Memory First + LocalStorage Instantâneo + Firebase RTDB
   ========================================================================== */

const DB_KEYS = {
  REPORTS: 'cristolandia_check_reports_v1',
  STOCK: 'cristolandia_check_stock_v1',
  CHURCHES: 'cristolandia_check_churches_v1',
  FIREBASE_CONFIG: 'cristolandia_check_firebase_cfg_v1',
  APP_CONFIG: 'cristolandia_check_app_cfg_v1'
};

// Dados Iniciais Demonstrativos de Alta Qualidade
const STOCK_ITEMS_TEMPLATE = [
  // ALIMENTOS GROSSOS 🫘
  { baseId: 'g01', name: 'Feijões', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 198, unit: 'und', minQty: 20 },
  { baseId: 'g02', name: 'Arroz', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 130, unit: 'und', minQty: 20 },
  { baseId: 'g03', name: 'Macarrão', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 80, unit: 'und', minQty: 15 },
  { baseId: 'g04', name: 'Fubá', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 300, unit: 'und', minQty: 30 },
  { baseId: 'g05', name: 'Açúcar', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 100, unit: 'und', minQty: 15 },
  { baseId: 'g06', name: 'Sal', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 48, unit: 'und', minQty: 10 },
  { baseId: 'g07', name: 'Farinha', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 30, unit: 'und', minQty: 10 },
  { baseId: 'g08', name: 'Leite em pó', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 8, unit: 'und', minQty: 5 },
  { baseId: 'g09', name: 'Nescafé', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 5, unit: 'und', minQty: 3 },
  { baseId: 'g10', name: 'Molho de tomate', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 2, unit: 'und', minQty: 5 },
  { baseId: 'g11', name: 'Vinagre', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 20, unit: 'und', minQty: 5 },
  { baseId: 'g12', name: 'Óleo', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 10, unit: 'und', minQty: 5 },
  { baseId: 'g13', name: 'Margarina 3kg', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 3, unit: 'und', minQty: 2 },

  // PROTEÍNAS 🍖
  { baseId: 'p01', name: 'Ovos', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 122, unit: 'und', minQty: 30 },
  { baseId: 'p02', name: 'Fígado', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'p03', name: 'Peito de frango', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 4, unit: 'und', minQty: 5 },
  { baseId: 'p04', name: 'Pct de salsicha c/60 und', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 4, unit: 'pct', minQty: 3 },
  { baseId: 'p05', name: 'Coxa e sobrecoxa', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 6, unit: 'und', minQty: 5 },
  { baseId: 'p06', name: 'Carne moída', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 7, unit: 'und', minQty: 5 },

  // TEMPEROS 🧄
  { baseId: 't01', name: 'Colorau', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 3, unit: 'und', minQty: 2 },
  { baseId: 't02', name: 'Tempero misto', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 1, unit: 'und', minQty: 2 },
  { baseId: 't03', name: 'Cabeça de alho', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 6, unit: 'und', minQty: 3 },
  { baseId: 't04', name: 'Kinnor', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 20, unit: 'uni', minQty: 5 },
  { baseId: 't05', name: 'Cominho', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 1, unit: 'und', minQty: 2 },

  // LANCHES 🍟
  { baseId: 'l01', name: 'Pct de bolacha salgada', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 3, unit: 'pct', minQty: 3 },
  { baseId: 'l02', name: 'Pct de biscoito recheado', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 1, unit: 'pct', minQty: 3 },
  { baseId: 'l03', name: 'Pct bolacha doce', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 3, unit: 'pct', minQty: 3 },
  { baseId: 'l04', name: 'Caixa de suco em pó', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 3, unit: 'cx', minQty: 2 },
  { baseId: 'l05', name: 'Pct de club social', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 5, unit: 'pct', minQty: 3 },
  { baseId: 'l06', name: 'Salgadinhos', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 6, unit: 'und', minQty: 3 },

  // VERDURAS E LEGUMES 🫑
  { baseId: 'v01', name: 'Cebola', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 8, unit: 'und', minQty: 4 },
  { baseId: 'v02', name: 'Cenoura', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 3, unit: 'und', minQty: 2 },
  { baseId: 'v03', name: 'Tomate', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 11, unit: 'und', minQty: 5 },
  { baseId: 'v04', name: 'Pimentão', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 3, unit: 'und', minQty: 2 },
  { baseId: 'v05', name: 'Chuchu', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 2, unit: 'und', minQty: 2 }
];

function buildStockSeedFor3Units() {
  const units = ['missao', 'macedonia', 'feminina'];
  const stock = [];
  units.forEach(unitId => {
    STOCK_ITEMS_TEMPLATE.forEach(item => {
      stock.push({
        id: `stk_${unitId}_${item.baseId}`,
        name: item.name,
        category: item.category,
        categoryLabel: item.categoryLabel,
        categoryIcon: item.categoryIcon,
        quantity: item.quantity,
        unit: item.unit,
        minQty: item.minQty,
        unitId: unitId
      });
    });
  });
  return stock;
}

const INITIAL_SEED = {
  reports: [
    {
      id: 'rep_demo_01',
      unitId: 'missao',
      unitName: 'Missão',
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now() - 3600000 * 3,
      reporterName: 'Pr. Marcos Lima',
      acolhidosPresentes: 48,
      novasTriagens: 4,
      desligamentos: 1,
      refeicoes: {
        cafe: 48,
        almoco: 52,
        lanche: 48,
        jantar: 50
      },
      atividades: 'Culto matinal de louvor e testemunhos, palestra sobre reconstrução de vínculos familiares.',
      saude: '2 acolhidos encaminhados para consulta médica de rotina na UBS.',
      necessidades: 'Reposição urgente de sabonetes e escovas de dente.',
      status: 'concluido'
    },
    {
      id: 'rep_demo_02',
      unitId: 'macedonia',
      unitName: 'Macedônia',
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now() - 3600000 * 5,
      reporterName: 'Missionário Carlos Eduardo',
      acolhidosPresentes: 62,
      novasTriagens: 2,
      desligamentos: 0,
      refeicoes: {
        cafe: 62,
        almoco: 65,
        lanche: 62,
        jantar: 64
      },
      atividades: 'Oficina de marcenaria comunitária, horta agroecológica e discipulado bíblico nível 2.',
      saude: 'Medicação continuada administrada pontualmente pela equipe de enfermagem.',
      necessidades: 'Sacos de arroz e óleo para a cozinha central.',
      status: 'concluido'
    },
    {
      id: 'rep_demo_03',
      unitId: 'feminina',
      unitName: 'Feminina',
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now() - 3600000 * 2,
      reporterName: 'Missionária Sarah Silva',
      acolhidosPresentes: 29,
      novasTriagens: 1,
      desligamentos: 0,
      refeicoes: {
        cafe: 29,
        almoco: 31,
        lanche: 29,
        jantar: 30
      },
      atividades: 'Oficina de artesanato, roda de conversa terapêutica e momento devocional.',
      saude: 'Acompanhamento pré-natal de 1 acolhida e atendimento psicológico individual.',
      necessidades: 'Fraldas tamanho M e kits de absorventes íntimos.',
      status: 'concluido'
    }
  ],
  stock: buildStockSeedFor3Units(),
  churches: [
    {
      id: 'chu_01',
      name: 'Primeira Igreja Batista de Mooca',
      pastor: 'Pr. Roberto Albuquerque',
      phone: '(11) 98765-4321',
      city: 'São Paulo - SP',
      neighborhood: 'Mooca',
      supportType: 'Cestas Básicas & Voluntários',
      lastVisit: '2026-09-12',
      notes: 'Grupo de jovens vem todo segundo sábado do mês para ministrar almoço e louvor na Missão.'
    },
    {
      id: 'chu_02',
      name: 'Igreja Presbiteriana Esperança',
      pastor: 'Rev. Samuel Ferreira',
      phone: '(11) 97654-3210',
      city: 'São Paulo - SP',
      neighborhood: 'Tatuapé',
      supportType: 'Doação Financeira & Material de Higiene',
      lastVisit: '2026-09-05',
      notes: 'Mantenedora de 3 leitos da Unidade Macedônia.'
    },
    {
      id: 'chu_03',
      name: 'Comunidade Cristã Ebenézer',
      pastor: 'Pr. André Santos',
      phone: '(11) 96543-2109',
      city: 'Guarulhos - SP',
      neighborhood: 'Centro',
      supportType: 'Atendimento Médico Voluntário',
      lastVisit: '2026-09-15',
      notes: 'Equipe de dentistas e médicos voluntários atendem a cada 15 dias.'
    }
  ]
};

// Gerenciador Central de Banco e Sincronização
class CristolandiaDB {
  constructor() {
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.isFirebaseConnected = false;
    this.onStatusChangeCallbacks = [];
  }

  // Sanitização anti-undefined conforme Pilar 1.4 do Guia CUIDAR
  sanitize(data) {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      return value === undefined ? null : value;
    }));
  }

  // Inicialização local e checagem de Firebase
  async init() {
    this.ensureLocalSeed();
    this.initNetworkWatcher();
    this.tryInitFirebase();
  }

  onStatusChange(callback) {
    this.onStatusChangeCallbacks.push(callback);
  }

  notifyStatus(status, label) {
    this.onStatusChangeCallbacks.forEach(cb => {
      try { cb(status, label); } catch (e) { console.error(e); }
    });
  }

  initNetworkWatcher() {
    window.addEventListener('online', () => {
      this.notifyStatus(this.isFirebaseConnected ? 'online' : 'connecting', 'Online');
    });
    window.addEventListener('offline', () => {
      this.notifyStatus('offline', 'Modo Offline (Salvo Local)');
    });
  }

  ensureLocalSeed() {
    if (!localStorage.getItem(DB_KEYS.REPORTS)) {
      localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(INITIAL_SEED.reports));
    }
    
    // Forçar atualização do estoque para a lista oficial das 3 Despensas (Missão, Macedônia, Feminina)
    const STOCK_VERSION_KEY = 'cristolandia_stock_seed_3_units_v2';
    if (localStorage.getItem(STOCK_VERSION_KEY) !== 'yes') {
      localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(INITIAL_SEED.stock));
      localStorage.setItem(STOCK_VERSION_KEY, 'yes');
    } else if (!localStorage.getItem(DB_KEYS.STOCK)) {
      localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(INITIAL_SEED.stock));
    }

    if (!localStorage.getItem(DB_KEYS.CHURCHES)) {
      localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(INITIAL_SEED.churches));
    }
  }

  // Configuração e Conexão Firebase
  tryInitFirebase() {
    const rawConfig = localStorage.getItem(DB_KEYS.FIREBASE_CONFIG);
    if (!rawConfig) {
      this.notifyStatus(navigator.onLine ? 'online' : 'offline', navigator.onLine ? 'Local Sincronizado' : 'Offline');
      return;
    }

    try {
      const config = JSON.parse(rawConfig);
      if (!config.apiKey || !config.databaseURL) {
        this.notifyStatus(navigator.onLine ? 'online' : 'offline', 'Local');
        return;
      }

      if (window.firebase && !window.firebase.apps.length) {
        this.firebaseApp = window.firebase.initializeApp(config);
        this.firebaseDb = window.firebase.database();

        // Ouvinte de conexão oficial do Firebase Realtime Database
        this.firebaseDb.ref('.info/connected').on('value', (snap) => {
          this.isFirebaseConnected = (snap.val() === true);
          if (this.isFirebaseConnected) {
            this.notifyStatus('online', 'Nuvem Conectada');
            this.syncDownFromFirebase();
          } else {
            this.notifyStatus(navigator.onLine ? 'connecting' : 'offline', navigator.onLine ? 'Conectando...' : 'Offline');
          }
        });
      }
    } catch (err) {
      console.warn('Firebase não inicializado, operando modo local offline:', err);
      this.notifyStatus(navigator.onLine ? 'online' : 'offline', 'Local');
    }
  }

  // Sincronização da nuvem para o LocalStorage
  async syncDownFromFirebase() {
    if (!this.firebaseDb) return;
    try {
      const snap = await this.firebaseDb.ref('cristolandia_check').once('value');
      const data = snap.val();
      if (data) {
        if (data.reports) localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(data.reports));
        if (data.stock) localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(data.stock));
        if (data.churches) localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(data.churches));
        window.dispatchEvent(new CustomEvent('db:cloud-synced'));
      }
    } catch (e) {
      console.warn('Erro ao sincronizar com nuvem:', e);
    }
  }

  // --- MÉTODOS DE RELATÓRIOS ---
  getReports() {
    try {
      const raw = localStorage.getItem(DB_KEYS.REPORTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async saveReport(reportData) {
    const reports = this.getReports();
    const existingIndex = reports.findIndex(r => r.id === reportData.id);
    
    const sanitized = this.sanitize({
      ...reportData,
      updatedAt: Date.now()
    });

    if (existingIndex >= 0) {
      reports[existingIndex] = sanitized;
    } else {
      reports.unshift(sanitized);
    }

    // 1. Salva localmente de imediato (inquebrável)
    localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(reports));

    // 2. Despacha para o Firebase caso conectado
    if (this.firebaseDb) {
      try {
        await this.firebaseDb.ref(`cristolandia_check/reports/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente (salvo localmente):', e);
      }
    }

    return sanitized;
  }

  // --- MÉTODOS DE ESTOQUE ---
  getStock(unitId) {
    try {
      const raw = localStorage.getItem(DB_KEYS.STOCK);
      const list = raw ? JSON.parse(raw) : [];
      if (unitId && unitId !== 'todas') {
        return list.filter(item => (item.unitId || 'missao') === unitId);
      }
      return list;
    } catch {
      return [];
    }
  }

  async saveStockItem(itemData) {
    const stock = this.getStock();
    const index = stock.findIndex(s => s.id === itemData.id);
    const sanitized = this.sanitize(itemData);

    if (index >= 0) {
      stock[index] = sanitized;
    } else {
      stock.push(sanitized);
    }

    localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(stock));

    if (this.firebaseDb) {
      try {
        await this.firebaseDb.ref(`cristolandia_check/stock/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente:', e);
      }
    }

    return sanitized;
  }

  async adjustStockQuantity(itemId, delta) {
    const stock = this.getStock();
    const item = stock.find(s => s.id === itemId);
    if (!item) return null;

    item.quantity = Math.max(0, (item.quantity || 0) + delta);
    return await this.saveStockItem(item);
  }

  async setStockQuantity(itemId, newQty) {
    const stock = this.getStock();
    const item = stock.find(s => s.id === itemId);
    if (!item) return null;

    const parsed = parseInt(newQty, 10);
    item.quantity = isNaN(parsed) ? 0 : Math.max(0, parsed);
    return await this.saveStockItem(item);
  }

  // --- MÉTODOS DE IGREJAS ---
  getChurches() {
    try {
      const raw = localStorage.getItem(DB_KEYS.CHURCHES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async saveChurch(churchData) {
    const churches = this.getChurches();
    const index = churches.findIndex(c => c.id === churchData.id);
    const sanitized = this.sanitize(churchData);

    if (index >= 0) {
      churches[index] = sanitized;
    } else {
      churches.unshift(sanitized);
    }

    localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(churches));

    if (this.firebaseDb) {
      try {
        await this.firebaseDb.ref(`cristolandia_check/churches/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente:', e);
      }
    }

    return sanitized;
  }

  async deleteChurch(id) {
    let churches = this.getChurches();
    churches = churches.filter(c => c.id !== id);
    localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(churches));

    if (this.firebaseDb) {
      try {
        await this.firebaseDb.ref(`cristolandia_check/churches/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover no Firebase:', e);
      }
    }
  }

  // Configuração do Firebase
  setFirebaseConfig(config) {
    localStorage.setItem(DB_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
    window.location.reload();
  }

  getFirebaseConfig() {
    try {
      const raw = localStorage.getItem(DB_KEYS.FIREBASE_CONFIG);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  resetAllData() {
    localStorage.removeItem(DB_KEYS.REPORTS);
    localStorage.removeItem(DB_KEYS.STOCK);
    localStorage.removeItem(DB_KEYS.CHURCHES);
    this.ensureLocalSeed();
  }
}

// Instância singleton global
const dbManager = new CristolandiaDB();
