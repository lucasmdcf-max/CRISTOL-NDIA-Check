/* ==========================================================================
   CRISTOLÂNDIA CHECK - CAMADA DE DADOS E PERSISTÊNCIA DUAL-LAYER
   Arquitetura CUIDAR: In-Memory First + LocalStorage Instantâneo + Firebase RTDB
   ========================================================================== */

const DB_KEYS = {
  REPORTS: 'cristolandia_check_reports_v1',
  STOCK: 'cristolandia_check_stock_v1',
  STOCK_MOVEMENTS: 'cristolandia_check_stock_movements_v1',
  CHURCHES: 'cristolandia_check_churches_v1',
  ACTIVITIES: 'cristolandia_check_activities_v1',
  NOTICES: 'cristolandia_check_notices_v1',
  TRIAGENS: 'cristolandia_check_triagens_v1',
  ESTUDOS: 'cristolandia_check_estudos_v1',
  FIREBASE_CONFIG: 'cristolandia_check_firebase_cfg_v1',
  APP_CONFIG: 'cristolandia_check_app_cfg_v1'
};

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

// Configuração Oficial Nativa do Firebase (Provisionada e Integrada)
const OFFICIAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBCoSFxtSYEXAaU-4JbHhFNT84CEFYjjTw",
  authDomain: "cristolandia-check-app.firebaseapp.com",
  databaseURL: "https://cristolandia-check-app-default-rtdb.firebaseio.com",
  projectId: "cristolandia-check-app",
  storageBucket: "cristolandia-check-app.firebasestorage.app",
  messagingSenderId: "346049139190",
  appId: "1:346049139190:web:0152b706e2ce6f23aef7d7"
};

// Catálogo Base de Alimentos (Quantidades iniciais zeradas — a autoridade é sempre a contagem real dos usuários)
const STOCK_ITEMS_TEMPLATE = [
  // ALIMENTOS GROSSOS 🫘
  { baseId: 'g01', name: 'Feijões', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 20 },
  { baseId: 'g02', name: 'Arroz', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 20 },
  { baseId: 'g03', name: 'Macarrão', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 15 },
  { baseId: 'g04', name: 'Fubá', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 30 },
  { baseId: 'g05', name: 'Açúcar', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 15 },
  { baseId: 'g06', name: 'Sal', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 10 },
  { baseId: 'g07', name: 'Farinha', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 10 },
  { baseId: 'g08', name: 'Leite em pó', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'g09', name: 'Nescafé', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 3 },
  { baseId: 'g10', name: 'Molho de tomate', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'g11', name: 'Vinagre', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'g12', name: 'Óleo', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'g13', name: 'Margarina 3kg', category: 'alimentos_grossos', categoryLabel: 'Alimentos Grossos', categoryIcon: '🫘', quantity: 0, unit: 'und', minQty: 2 },

  // PROTEÍNAS 🍖
  { baseId: 'p01', name: 'Ovos', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 30 },
  { baseId: 'p02', name: 'Fígado', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'p03', name: 'Peito de frango', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'p04', name: 'Pct de salsicha c/60 und', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'pct', minQty: 3 },
  { baseId: 'p05', name: 'Coxa e sobrecoxa', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'p06', name: 'Carne moída', category: 'proteinas', categoryLabel: 'Proteínas', categoryIcon: '🍖', quantity: 0, unit: 'und', minQty: 5 },

  // TEMPEROS 🧄
  { baseId: 't01', name: 'Colorau', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 0, unit: 'und', minQty: 2 },
  { baseId: 't02', name: 'Tempero misto', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 0, unit: 'und', minQty: 2 },
  { baseId: 't03', name: 'Cabeça de alho', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 0, unit: 'und', minQty: 3 },
  { baseId: 't04', name: 'Kinnor', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 0, unit: 'uni', minQty: 5 },
  { baseId: 't05', name: 'Cominho', category: 'temperos', categoryLabel: 'Temperos', categoryIcon: '🧄', quantity: 0, unit: 'und', minQty: 2 },

  // LANCHES 🍟
  { baseId: 'l01', name: 'Pct de bolacha salgada', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'pct', minQty: 3 },
  { baseId: 'l02', name: 'Pct de biscoito recheado', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'pct', minQty: 3 },
  { baseId: 'l03', name: 'Pct bolacha doce', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'pct', minQty: 3 },
  { baseId: 'l04', name: 'Caixa de suco em pó', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'cx', minQty: 2 },
  { baseId: 'l05', name: 'Pct de club social', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'pct', minQty: 3 },
  { baseId: 'l06', name: 'Salgadinhos', category: 'lanches', categoryLabel: 'Lanches', categoryIcon: '🍟', quantity: 0, unit: 'und', minQty: 3 },

  // VERDURAS E LEGUMES 🫑
  { baseId: 'v01', name: 'Cebola', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 0, unit: 'und', minQty: 4 },
  { baseId: 'v02', name: 'Cenoura', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 0, unit: 'und', minQty: 2 },
  { baseId: 'v03', name: 'Tomate', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 0, unit: 'und', minQty: 5 },
  { baseId: 'v04', name: 'Pimentão', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 0, unit: 'und', minQty: 2 },
  { baseId: 'v05', name: 'Chuchu', category: 'verduras_legumes', categoryLabel: 'Verduras e Legumes', categoryIcon: '🫑', quantity: 0, unit: 'und', minQty: 2 },

  // FRUTAS 🍎
  { baseId: 'fr01', name: 'Banana', category: 'frutas', categoryLabel: 'Frutas', categoryIcon: '🍌', quantity: 0, unit: 'palma', minQty: 2 },
  { baseId: 'fr02', name: 'Laranja', category: 'frutas', categoryLabel: 'Frutas', categoryIcon: '🍊', quantity: 0, unit: 'und', minQty: 10 }
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
  reports: [],
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
      notes: 'Mantenedora de 3 leitos da Unidade Masculina.'
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
    // Controle de sincronização em tempo real (Pilar 1 Motor CUIDAR)
    this._realtimeListenersActive = false;
    this._lastLocalWrite = 0; // Timestamp da última escrita local — suprime toast em eco
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
    // Reset seguro para início limpo a partir de hoje (remove relatórios antigos, triagem teste e movimentações antigas)
    const cleanFlag = 'cristolandia_clean_start_today_v45';
    if (!localStorage.getItem(cleanFlag)) {
      localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.TRIAGENS, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.STOCK_MOVEMENTS, JSON.stringify([]));
      localStorage.setItem(cleanFlag, 'done');
    }

    // Autoridade do Estoque dos Usuários: remove resquícios de estoques antigos com valores fictícios de código fonte
    const userStockAuthFlag = 'cristolandia_stock_user_authority_v2';
    if (!localStorage.getItem(userStockAuthFlag)) {
      localStorage.removeItem(DB_KEYS.STOCK);
      localStorage.setItem(userStockAuthFlag, 'done');
    }

    if (!localStorage.getItem(DB_KEYS.REPORTS)) {
      localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(INITIAL_SEED.reports));
    }
    
    // Na instalação inicial, não preenche quantidades falsas: catálogo inicia limpo com 0 ou carrega da nuvem
    if (!localStorage.getItem(DB_KEYS.STOCK)) {
      localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(buildStockSeedFor3Units()));
    }

    // Mantém o cadastro das instituições/igrejas 100% preservado
    if (!localStorage.getItem(DB_KEYS.CHURCHES)) {
      localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(INITIAL_SEED.churches));
    }
  }

  getDeletedStockIds() {
    try {
      const raw = localStorage.getItem('cristolandia_deleted_stock_ids');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Mescla catálogo base preservando 100% as contagens e itens preenchidos pelos usuários
  mergeWithDefaultStock(currentList) {
    const list = Array.isArray(currentList) ? currentList : [];
    const defaultCatalog = buildStockSeedFor3Units();
    const deletedIds = this.getDeletedStockIds();

    const map = new Map();
    // 1. Carrega itens do catálogo padrão oficial com quantidade zerada (exceto deletados)
    defaultCatalog.forEach(item => {
      if (!deletedIds.includes(item.id)) {
        map.set(item.id, { ...item, quantity: 0 });
      }
    });

    // 2. Sobrepõe com a lista real dos usuários (PREVALECE TOTALMENTE a contagem de estoque e itens novos cadastrados)
    list.forEach(item => {
      if (item && item.id && !deletedIds.includes(item.id)) {
        map.set(item.id, { ...(map.get(item.id) || {}), ...item });
      }
    });

    return Array.from(map.values());
  }

  async syncStockToCloud(stockList) {
    if (!this.firebaseDb) return;
    try {
      const payload = {};
      const list = stockList || this.getStock();
      list.forEach(item => {
        if (item && item.id) {
          payload[item.id] = this.sanitize(item);
        }
      });
      this._lastLocalWrite = Date.now();
      await this.firebaseDb.ref('cristolandia_check/stock').set(payload);
      console.log('[CUIDAR] Estoque das 3 Despensas sincronizado integralmente na nuvem.');
    } catch (e) {
      console.warn('Erro ao sincronizar estoque na nuvem:', e);
    }
  }

  // Configuração e Conexão Firebase
  tryInitFirebase() {
    const config = this.getFirebaseConfig();
    if (!config || !config.apiKey || !config.databaseURL) {
      this.notifyStatus(navigator.onLine ? 'online' : 'offline', 'Local');
      return;
    }

    try {
      if (window.firebase && !window.firebase.apps.length) {
        this.firebaseApp = window.firebase.initializeApp(config);
        this.firebaseDb = window.firebase.database();

        // Ouvinte de conexão oficial do Firebase Realtime Database
        this.firebaseDb.ref('.info/connected').on('value', (snap) => {
          this.isFirebaseConnected = (snap.val() === true);
          if (this.isFirebaseConnected) {
            this.notifyStatus('online', 'Nuvem Conectada');
            this.startRealtimeListeners(); // Pilar 1: listeners persistentes

            // Limpeza na nuvem de relatórios antigos, triagens de teste e estoque anterior (mantendo instituições)
            const cloudCleanFlag = 'cristolandia_cloud_clean_v45';
            if (!localStorage.getItem(cloudCleanFlag) && this.firebaseDb) {
              try {
                this._lastLocalWrite = Date.now();
                this.firebaseDb.ref('cristolandia_check/reports').set({});
                this.firebaseDb.ref('cristolandia_check/triagens').set({});
                this.firebaseDb.ref('cristolandia_check/stock_movements').set({});
                localStorage.setItem(cloudCleanFlag, 'done');
              } catch (e) {
                console.warn('Aviso ao sincronizar limpeza na nuvem:', e);
              }
            }

            // Não sobrescreve o estoque na nuvem: aguarda o ouvinte em tempo real para obter os dados preenchidos pelos usuários
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

  // PILAR 1 — Sincronização WebSocket Nativa em Tempo Real
  startRealtimeListeners() {
    if (!this.firebaseDb || this._realtimeListenersActive) return;
    this._realtimeListenersActive = true;

    const toArray = (obj) => {
      if (!obj) return [];
      if (Array.isArray(obj)) return obj;
      return Object.values(obj).filter(v => v !== null && v !== undefined);
    };

    let isFirstFire = true;

    this.firebaseDb.ref('cristolandia_check').on('value', async (snap) => {
      const data = snap.val();

      if (!data) {
        if (isFirstFire) {
          isFirstFire = false;
          await this.pushLocalToFirebase();
        }
        return;
      }

      if (data.reports !== undefined) {
        localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(toArray(data.reports)));
      }

      // Tratamento resiliente do estoque: nunca permite truncamento da lista oficial
      if (data.stock !== undefined) {
        const cloudStock = toArray(data.stock);
        const merged = this.mergeWithDefaultStock(cloudStock);
        localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(merged));
        if (cloudStock.length < merged.length && this.isFirebaseConnected) {
          this.syncStockToCloud(merged);
        }
      } else {
        const merged = this.mergeWithDefaultStock(this.getStock());
        localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(merged));
        if (this.isFirebaseConnected) {
          this.syncStockToCloud(merged);
        }
      }
      if (data.churches !== undefined) {
        localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify(toArray(data.churches)));
      } else {
        localStorage.setItem(DB_KEYS.CHURCHES, JSON.stringify([]));
      }
      if (data.activities !== undefined) {
        localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(toArray(data.activities)));
      } else {
        localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify([]));
      }
      if (data.notices !== undefined) {
        localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify(toArray(data.notices)));
      } else {
        localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify([]));
      }
      if (data.triagens !== undefined) {
        localStorage.setItem(DB_KEYS.TRIAGENS, JSON.stringify(toArray(data.triagens)));
      } else {
        localStorage.setItem(DB_KEYS.TRIAGENS, JSON.stringify([]));
      }
      if (data.estudos !== undefined) {
        localStorage.setItem(DB_KEYS.ESTUDOS, JSON.stringify(toArray(data.estudos)));
      } else {
        localStorage.setItem(DB_KEYS.ESTUDOS, JSON.stringify([]));
      }
      if (data.stock_movements !== undefined) {
        localStorage.setItem(DB_KEYS.STOCK_MOVEMENTS, JSON.stringify(toArray(data.stock_movements)));
      } else {
        if (!localStorage.getItem(DB_KEYS.STOCK_MOVEMENTS)) {
          localStorage.setItem(DB_KEYS.STOCK_MOVEMENTS, JSON.stringify([]));
        }
      }

      // Atualiza timestamps de last_update por unidade
      if (data.stock_last_update) {
        Object.keys(data.stock_last_update).forEach(unitId => {
          if (data.stock_last_update[unitId]) {
            localStorage.setItem(`cristolandia_stock_last_update_${unitId}`, data.stock_last_update[unitId]);
          }
        });
      }

      const firstLoad = isFirstFire;
      isFirstFire = false;

      // Detecta eco de escrita local (< 3s após última gravação deste dispositivo)
      const isLocalWrite = !firstLoad && (Date.now() - this._lastLocalWrite) < 3000;

      window.dispatchEvent(new CustomEvent('db:cloud-synced', {
        detail: { firstLoad, isLocalWrite }
      }));
    }, (err) => {
      console.warn('[CUIDAR] Erro no listener em tempo real:', err);
    });
  }

  // Upload inicial dos dados locais para a nuvem caso banco esteja vazio
  async pushLocalToFirebase() {
    if (!this.firebaseDb) return;
    try {
      const reports = this.getReports();
      const stock = this.getStock();
      const churches = this.getChurches();
      const activities = this.getActivities();
      const notices = this.getNotices(false); // todos incluindo recentes
      const triagens = this.getTriagens();
      const estudos = this.getEstudos();
      const stockMovements = this.getStockMovements();

      const payload = {
        reports: {},
        stock: {},
        churches: {},
        activities: {},
        notices: {},
        triagens: {},
        estudos: {},
        stock_movements: {}
      };

      reports.forEach(r => { if (r && r.id) payload.reports[r.id] = this.sanitize(r); });
      stock.forEach(s => { if (s && s.id) payload.stock[s.id] = this.sanitize(s); });
      churches.forEach(c => { if (c && c.id) payload.churches[c.id] = this.sanitize(c); });
      activities.forEach(a => { if (a && a.id) payload.activities[a.id] = this.sanitize(a); });
      notices.forEach(n => { if (n && n.id) payload.notices[n.id] = this.sanitize(n); });
      triagens.forEach(t => { if (t && t.id) payload.triagens[t.id] = this.sanitize(t); });
      estudos.forEach(e => { if (e && e.id) payload.estudos[e.id] = this.sanitize(e); });
      stockMovements.forEach(m => { if (m && m.id) payload.stock_movements[m.id] = this.sanitize(m); });

      this._lastLocalWrite = Date.now();
      await this.firebaseDb.ref('cristolandia_check').set(payload);
      console.log('[CUIDAR] Banco em nuvem inicializado com dados locais.');
    } catch (e) {
      console.warn('Erro ao inicializar dados na nuvem:', e);
    }
  }

  // --- MÉTODOS DE RELATÓRIOS ---
  getReports() {
    try {
      const raw = localStorage.getItem(DB_KEYS.REPORTS);
      const list = raw ? JSON.parse(raw) : [];
      return list.map(r => {
        if (!r) return r;
        // Assegura tipo numérico válido respeitando o valor exato (inclusive 0)
        if (typeof r.acolhidosPresentes !== 'number') {
          const parsed = parseInt(r.acolhidosPresentes, 10);
          r.acolhidosPresentes = !isNaN(parsed) ? parsed : 0;
        }
        return r;
      });
    } catch {
      return [];
    }
  }

  async saveReport(reportData) {
    const reports = this.getReports();
    // Identifica por ID explícito ou por combinação única de unidade + data
    const existingIndex = reports.findIndex(r => 
      (reportData.id && r.id === reportData.id) ||
      (r.unitId === reportData.unitId && r.date === reportData.date)
    );
    
    const finalId = (existingIndex >= 0 && reports[existingIndex].id) 
      ? reports[existingIndex].id 
      : (reportData.id || `rep_${reportData.unitId}_${reportData.date}_${Date.now()}`);

    const sanitized = this.sanitize({
      ...reportData,
      id: finalId,
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
        this._lastLocalWrite = Date.now();
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
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/stock/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente:', e);
      }
    }

    return sanitized;
  }

  async addStockItem(itemData) {
    return await this.saveStockItem(itemData);
  }

  async deleteStockItem(itemId) {
    const stock = this.getStock();
    const filtered = stock.filter(s => s.id !== itemId);
    localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(filtered));

    const deletedIds = this.getDeletedStockIds();
    if (!deletedIds.includes(itemId)) {
      deletedIds.push(itemId);
      localStorage.setItem('cristolandia_deleted_stock_ids', JSON.stringify(deletedIds));
    }

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/stock/${itemId}`).remove();
      } catch (e) {
        console.warn('Firebase pendente (removido localmente):', e);
      }
    }
    return true;
  }

  async adjustStockQuantity(itemId, delta, notes = null) {
    const stock = this.getStock();
    const item = stock.find(s => s.id === itemId);
    if (!item) return null;

    const prevQty = Number(item.quantity) || 0;
    item.quantity = Math.max(0, prevQty + delta);
    const saved = await this.saveStockItem(item);

    const actualDelta = item.quantity - prevQty;
    if (actualDelta !== 0) {
      await this.recordStockMovement({
        itemId: item.id,
        itemName: item.name,
        unitId: item.unitId || 'missao',
        type: actualDelta > 0 ? 'entrada' : 'saida',
        quantity: Math.abs(actualDelta),
        previousQty: prevQty,
        newQty: item.quantity,
        date: getLocalDateStr(),
        timestamp: Date.now(),
        notes: notes || (actualDelta > 0 ? 'Entrada no estoque' : 'Consumo diário')
      });
    }

    return saved;
  }

  async setStockQuantity(itemId, newQty, notes = null) {
    const stock = this.getStock();
    const item = stock.find(s => s.id === itemId);
    if (!item) return null;

    const prevQty = Number(item.quantity) || 0;
    const parsed = parseInt(newQty, 10);
    item.quantity = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const saved = await this.saveStockItem(item);

    const actualDelta = item.quantity - prevQty;
    if (actualDelta !== 0) {
      await this.recordStockMovement({
        itemId: item.id,
        itemName: item.name,
        unitId: item.unitId || 'missao',
        type: actualDelta > 0 ? 'entrada' : 'saida',
        quantity: Math.abs(actualDelta),
        previousQty: prevQty,
        newQty: item.quantity,
        date: getLocalDateStr(),
        timestamp: Date.now(),
        notes: notes || (actualDelta > 0 ? 'Ajuste de entrada' : 'Ajuste de consumo')
      });
    }

    return saved;
  }

  getStockMovements(unitId = null, itemId = null) {
    try {
      const raw = localStorage.getItem(DB_KEYS.STOCK_MOVEMENTS);
      let list = raw ? JSON.parse(raw) : [];
      if (unitId && unitId !== 'todas') {
        list = list.filter(m => (m.unitId || 'missao') === unitId);
      }
      if (itemId) {
        list = list.filter(m => m.itemId === itemId);
      }
      return list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } catch {
      return [];
    }
  }

  async recordStockMovement(movData) {
    const movements = this.getStockMovements();
    const id = movData.id || `mov_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const sanitized = this.sanitize({
      ...movData,
      id,
      date: movData.date || getLocalDateStr(),
      timestamp: movData.timestamp || Date.now(),
      unitId: movData.unitId || 'missao',
      quantity: Math.abs(Number(movData.quantity) || 0)
    });

    movements.push(sanitized);
    localStorage.setItem(DB_KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/stock_movements/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente (movimentação salva localmente):', e);
      }
    }
    return sanitized;
  }

  getStockLastUpdate(unitId) {
    try {
      const key = `cristolandia_stock_last_update_${unitId || 'missao'}`;
      const saved = localStorage.getItem(key);
      if (saved) return saved;
      return '15/09/2026';
    } catch {
      return '15/09/2026';
    }
  }

  async setStockLastUpdate(unitId, customDateStr = null) {
    const key = `cristolandia_stock_last_update_${unitId || 'missao'}`;
    let dateStr = customDateStr;
    if (!dateStr) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      dateStr = `${day}/${month}/${year} às ${hours}:${mins}`;
    }
    localStorage.setItem(key, dateStr);

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/stock_last_update/${unitId || 'missao'}`).set(dateStr);
      } catch (e) {
        console.warn('Firebase pendente:', e);
      }
    }
    return dateStr;
  }

  getStockItemOscillationData(itemOrId, unitId, periodType = 'meses') {
    let item = itemOrId;
    if (typeof itemOrId === 'string') {
      const stock = this.getStock(unitId);
      item = stock.find(s => s.id === itemOrId);
    }
    if (!item) {
      return {
        periodType,
        labels: [],
        stockLevels: [],
        entradas: [],
        saidas: [],
        totalEntradas: 0,
        totalSaidas: 0,
        avgConsumption: 0,
        avgUnitLabel: 'und',
        avgTitle: 'Consumo Médio',
        dateRangeText: '',
        currentStock: 0,
        unit: 'und'
      };
    }

    const currentQty = Math.max(0, Number(item.quantity) || 0);
    const itemUnit = item.unit || 'und';
    const effectiveUnitId = unitId || item.unitId || 'missao';
    const allMovements = this.getStockMovements(effectiveUnitId, item.id);

    let labels = [];
    let dateRanges = [];
    let periodTitle = '';
    let avgUnit = '';
    let dateRangeText = '';

    const now = new Date();

    if (periodType === 'dias') {
      // Últimos 7 dias (de D-6 até D-0 / hoje)
      const numDays = 7;
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const iso = getLocalDateStr(d);
        const dayLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        labels.push(dayLabel);
        dateRanges.push({ startIso: iso, endIso: iso, label: dayLabel });
      }
      periodTitle = 'Consumo Médio Diário';
      avgUnit = `${itemUnit} / dia`;
      dateRangeText = `${labels[0]} a ${labels[labels.length - 1]}`;

    } else if (periodType === 'semanas') {
      // Últimas 4 semanas (blocos de 7 dias)
      const numWeeks = 4;
      for (let i = numWeeks - 1; i >= 0; i--) {
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - (i * 7));
        const dStart = new Date(dEnd);
        dStart.setDate(dStart.getDate() - 6);

        const label = `Sem ${numWeeks - i}`;
        labels.push(label);
        dateRanges.push({
          startIso: getLocalDateStr(dStart),
          endIso: getLocalDateStr(dEnd),
          label
        });
      }
      periodTitle = 'Consumo Médio Semanal';
      avgUnit = `${itemUnit} / semana`;
      dateRangeText = 'Últimas 4 Semanas';

    } else {
      // Meses: Janeiro até o mês atual (mínimo 6 a 9 meses do ano corrente)
      periodType = 'meses';
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentYear = now.getFullYear();
      const currentMonthIdx = now.getMonth(); // 0 a 11
      const countMonths = Math.max(6, currentMonthIdx + 1);

      for (let m = 0; m <= currentMonthIdx; m++) {
        const mStr = String(m + 1).padStart(2, '0');
        const startIso = `${currentYear}-${mStr}-01`;
        const lastDay = new Date(currentYear, m + 1, 0).getDate();
        const endIso = `${currentYear}-${mStr}-${String(lastDay).padStart(2, '0')}`;
        const label = monthNames[m];
        labels.push(label);
        dateRanges.push({ startIso, endIso, label });
      }
      periodTitle = 'Consumo Médio Mensal';
      avgUnit = `${itemUnit} / mês`;
      dateRangeText = `${labels[0]} – ${labels[labels.length - 1]} (${currentYear})`;
    }

    // Cruza todas as entradas e todas as saídas no intervalo de cada período
    const entradas = [];
    const saidas = [];
    let hasRealMovementsInAnyRange = false;

    dateRanges.forEach(range => {
      const movsInRange = allMovements.filter(m => m.date >= range.startIso && m.date <= range.endIso);
      let entSum = 0;
      let saiSum = 0;

      movsInRange.forEach(m => {
        const q = Number(m.quantity) || 0;
        if (m.type === 'entrada') entSum += q;
        if (m.type === 'saida') saiSum += q;
      });

      if (movsInRange.length > 0) hasRealMovementsInAnyRange = true;
      entradas.push(entSum);
      saidas.push(saiSum);
    });

    // Considera estritamente os inputs reais registrados pelo usuário a partir de hoje
    // (sem projeções ou valores inventados para datas anteriores)
    // Se não houver movimentação registrada no período, entradas e saídas permanecem 0.

    // Calcula os níveis de estoque em cada ponto da série temporal
    // Retroagindo do estoque atual: Estoque_anterior = Estoque_posterior - (Entradas - Saidas)
    const stockLevels = new Array(labels.length);
    stockLevels[labels.length - 1] = currentQty;

    for (let i = labels.length - 2; i >= 0; i--) {
      const netDelta = (entradas[i + 1] || 0) - (saidas[i + 1] || 0);
      const prevVal = Math.max(0, Math.round((stockLevels[i + 1] - netDelta) * 10) / 10);
      stockLevels[i] = prevVal;
    }

    // Métricas consolidadas
    const totalEntradas = Math.round(entradas.reduce((acc, v) => acc + v, 0) * 10) / 10;
    const totalSaidas = Math.round(saidas.reduce((acc, v) => acc + v, 0) * 10) / 10;
    const count = labels.length || 1;
    const avgConsumption = Math.round((totalSaidas / count) * 10) / 10;

    return {
      periodType,
      labels,
      stockLevels,
      entradas,
      saidas,
      totalEntradas,
      totalSaidas,
      avgConsumption,
      avgUnitLabel: avgUnit,
      avgTitle: periodTitle,
      dateRangeText,
      currentStock: currentQty,
      unit: itemUnit
    };
  }

  getItemMonthlyHistory(item) {
    const res = this.getStockItemOscillationData(item, item?.unitId || 'missao', 'meses');
    return {
      months: res.labels,
      stockLevels: res.stockLevels,
      consumption: res.saidas,
      avgConsumption: res.avgConsumption,
      unit: res.unit
    };
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
        this._lastLocalWrite = Date.now();
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
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/churches/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover no Firebase:', e);
      }
    }
  }

  // --- MÉTODOS DE ATIVIDADES ---
  getActivities() {
    try {
      const raw = localStorage.getItem(DB_KEYS.ACTIVITIES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async saveActivity(activityData) {
    const activities = this.getActivities();
    const sanitized = this.sanitize(activityData);
    const index = activities.findIndex(a => a.id === sanitized.id);
    if (index >= 0) {
      activities[index] = sanitized;
    } else {
      activities.unshift(sanitized);
    }
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/activities/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente:', e);
      }
    }
    return sanitized;
  }

  async deleteActivity(id) {
    let activities = this.getActivities();
    activities = activities.filter(a => a.id !== id);
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/activities/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover no Firebase:', e);
      }
    }
  }

  // --- MÉTODOS DE AVISOS DO DIA (DURAÇÃO DE 24 HORAS) ---
  getNotices(onlyActiveLast24h = true) {
    try {
      const raw = localStorage.getItem(DB_KEYS.NOTICES);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      // Filtra por padrão os avisos com menos de 24h
      const filtered = onlyActiveLast24h 
        ? list.filter(n => n && typeof n.createdAt === 'number' && (now - n.createdAt) <= TWENTY_FOUR_HOURS)
        : list;

      // Ordena por data decrescente (mais recente primeiro)
      return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch {
      return [];
    }
  }

  async saveNotice(noticeData) {
    const notices = this.getNotices(false);
    const finalId = noticeData.id || `not_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const sanitized = this.sanitize({
      ...noticeData,
      id: finalId,
      createdAt: noticeData.createdAt || Date.now(),
      updatedAt: Date.now()
    });

    const index = notices.findIndex(n => n.id === sanitized.id);
    if (index >= 0) {
      notices[index] = sanitized;
    } else {
      notices.unshift(sanitized);
    }

    localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify(notices));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/notices/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente (aviso salvo localmente):', e);
      }
    }

    return sanitized;
  }

  async deleteNotice(id) {
    let notices = this.getNotices(false);
    notices = notices.filter(n => n.id !== id);
    localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify(notices));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/notices/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover aviso no Firebase:', e);
      }
    }
  }

  // --- MÉTODOS DE TRIAGENS (UNIDADE MISSÃO / GERAL) ---
  getTriagens() {
    try {
      const raw = localStorage.getItem(DB_KEYS.TRIAGENS);
      const list = raw ? JSON.parse(raw) : [];
      // Ordenação cronológica: mais recentes primeiro (data decrescente, e timestamp decrescente)
      return list.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateB !== dateA) {
          return dateB.localeCompare(dateA);
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    } catch {
      return [];
    }
  }

  getTriagemById(id) {
    const list = this.getTriagens();
    return list.find(t => t.id === id) || null;
  }

  async saveTriagem(triagemData) {
    const triagens = this.getTriagens();
    const finalId = triagemData.id || `trg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const sanitized = this.sanitize({
      ...triagemData,
      id: finalId,
      createdAt: triagemData.createdAt || Date.now(),
      updatedAt: Date.now()
    });

    const index = triagens.findIndex(t => t.id === sanitized.id);
    if (index >= 0) {
      triagens[index] = sanitized;
    } else {
      triagens.unshift(sanitized);
    }

    localStorage.setItem(DB_KEYS.TRIAGENS, JSON.stringify(triagens));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/triagens/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente (triagem salva localmente):', e);
      }
    }

    return sanitized;
  }

  async deleteTriagem(id) {
    let triagens = this.getTriagens();
    triagens = triagens.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TRIAGENS, JSON.stringify(triagens));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/triagens/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover triagem no Firebase:', e);
      }
    }
  }

  // --- MÉTODOS DE ESTUDOS BÍBLICOS E DISCIPULADO ---
  getEstudos() {
    try {
      const raw = localStorage.getItem(DB_KEYS.ESTUDOS);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      // Ordenação cronológica: mais recentes primeiro (data decrescente, e timestamp decrescente)
      return list.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateB !== dateA) {
          return dateB.localeCompare(dateA);
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    } catch {
      return [];
    }
  }

  getEstudoById(id) {
    const list = this.getEstudos();
    return list.find(e => e.id === id) || null;
  }

  async saveEstudo(estudoData) {
    const estudos = this.getEstudos();
    const finalId = estudoData.id || `est_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const sanitized = this.sanitize({
      ...estudoData,
      id: finalId,
      createdAt: estudoData.createdAt || Date.now(),
      updatedAt: Date.now()
    });

    const index = estudos.findIndex(e => e.id === sanitized.id);
    if (index >= 0) {
      estudos[index] = sanitized;
    } else {
      estudos.unshift(sanitized);
    }

    localStorage.setItem(DB_KEYS.ESTUDOS, JSON.stringify(estudos));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/estudos/${sanitized.id}`).set(sanitized);
      } catch (e) {
        console.warn('Firebase pendente (estudo salvo localmente):', e);
      }
    }

    return sanitized;
  }

  async deleteEstudo(id) {
    let estudos = this.getEstudos();
    estudos = estudos.filter(e => e.id !== id);
    localStorage.setItem(DB_KEYS.ESTUDOS, JSON.stringify(estudos));

    if (this.firebaseDb) {
      try {
        this._lastLocalWrite = Date.now();
        await this.firebaseDb.ref(`cristolandia_check/estudos/${id}`).remove();
      } catch (e) {
        console.warn('Erro ao remover estudo no Firebase:', e);
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
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.apiKey && parsed.databaseURL) {
          return parsed;
        }
      }
    } catch {
      // Falha no parse, recorre à oficial
    }
    return OFFICIAL_FIREBASE_CONFIG;
  }

  resetAllData() {
    localStorage.removeItem(DB_KEYS.REPORTS);
    localStorage.removeItem(DB_KEYS.STOCK);
    localStorage.removeItem(DB_KEYS.CHURCHES);
    localStorage.removeItem(DB_KEYS.ACTIVITIES);
    localStorage.removeItem(DB_KEYS.NOTICES);
    localStorage.removeItem(DB_KEYS.TRIAGENS);
    this.ensureLocalSeed();
  }
}

// Instância singleton global
const dbManager = new CristolandiaDB();
