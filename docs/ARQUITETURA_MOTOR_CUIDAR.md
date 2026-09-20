# GUIA ARQUITETURAL E DE IMPLEMENTAÇÃO: NOVO PWA REALTIME MULTIUSUÁRIO COM FIREBASE
## BASEADO NO MOTOR DE ALTA PERFORMANCE E RESILIÊNCIA DO PWA CUIDAR

**Data de Geração:** 18/09/2026  
**Destino:** Novo PWA (Uso Externo - Não integrar ao código-fonte do CUIDAR)

---

## 1. POR QUE O PWA CUIDAR FUNCIONA TÃO BEM E RÁPIDO? (DIAGNÓSTICO DO SISTEMA)
A velocidade e a estabilidade são garantidas por 7 pilares arquiteturais que DEVEM ser replicados neste app:

### 1.1. Sincronização WebSocket Nativa (Firebase Realtime Database)
- O app mantém uma conexão WebSocket persistente e bidirecional com a nuvem.
- Não há overhead de requisições HTTP REST repetitivas para checagem de dados.
- Qualquer gravação em um dispositivo dispara eventos de mudança para todos os outros aparelhos conectados em menos de 150 milissegundos.

### 1.2. Arquitetura In-Memory State First (Sem espera de rede para desenhar a tela)
- O app possui uma variável global de estado (`state = { ... }`) na memória RAM.
- A interface renderiza instantaneamente com os dados em memória.
- Quando o Firebase recebe novidades, o callback do ouvinte (`.on('value')`) atualiza o estado global e re-renderiza cirurgicamente apenas as visões ativas.

### 1.3. Persistência de Dupla Camada (Offline-First Resiliente)
- Na rotina de salvamento, primeiro os dados são persistidos sincronicamente no LocalStorage do aparelho (garantia contra fechamento de aba ou crash).
- Em seguida, os dados são despachados via Promise para o Firebase.
- Se o aparelho estiver sem internet ou com conexão instável, o usuário nunca perde o que digitou.

### 1.4. Sanitização Obrigatória de Dados (Eliminação de 'undefined')
- O SDK do Firebase rejeita operações e trava caso algum objeto possua campos com valor `undefined`.
- O CUIDAR resolve isso no `saveState()` através do replacer JSON:
  `JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v)))`
- Essa limpeza é fundamental para evitar erros silenciosos de salvamento.

### 1.5. Ouvinte de Conexão (.info/connected) com Feedback Visual
- O app escuta `db.ref('.info/connected')`.
- Altera visualmente o status (cinza piscante = conectando; verde = online; vermelho = offline).
- O usuário sempre sabe se o aparelho está sincronizando com a nuvem ou não.

### 1.6. Proteção Contra Múltiplos Cliques e Timeout de Interface
- Bloqueio imediato do botão ao primeiro clique do usuário + overlay com indicador giratório.
- Fechamento de modais e liberação de tela encapsulados em blocos `try-finally`, garantindo que a tela nunca fique travada caso ocorra instabilidade na rede.

### 1.7. Regras de Exclusão de Nós (!newData.exists())
- No Firebase, apagar um nó consiste em enviar um `null`. Se as regras de segurança exigirem validação de campos sem checar `!newData.exists()`, a exclusão é bloqueada no servidor. Autorizar deleção expressamente nas regras.

---

## 2. MODELO DE DADOS NO FIREBASE REALTIME DATABASE
A árvore JSON deve ser estruturada com nós segregados:

```json
{
  "appConfig": {
    "appVersion": "20260918_01",
    "maintenanceMode": false
  },

  "users": {
    "USER_UID_1": {
      "name": "Carlos Gestor",
      "email": "gestor@app.com",
      "role": "gestor",
      "active": true,
      "permissions": {
        "area_financeiro": true,
        "area_operacoes": true,
        "area_diretoria": true,
        "area_rh": true
      }
    }
  },

  "cristolandia_check": {
    "reports": {},
    "stock": {},
    "churches": {}
  },

  "dados_gerais": {},
  "areas_restritas": {},
  "logs_auditoria": {}
}
```

---

## 3. REGRAS DE SEGURANÇA NO FIREBASE (`database.rules.json`)
Regras de segurança que protegem o banco na raiz e concedem permissões granulares por perfil e área:

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "appConfig": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'gestor'"
    },

    "users": {
      ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'gestor' || root.child('users').child(auth.uid).child('role').val() === 'admin')",
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'gestor' || (root.child('users').child(auth.uid).child('role').val() === 'admin' && newData.child('role').val() === 'user'))",
        ".validate": "!newData.exists() || (newData.hasChildren(['name', 'role', 'active']) && newData.child('name').isString())"
      }
    },

    "cristolandia_check": {
      ".read": true,
      ".write": true
    },

    "dados_gerais": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('active').val() === true",
      ".write": "auth != null && root.child('users').child(auth.uid).child('active').val() === true",
      "$itemId": {
        ".validate": "!newData.exists() || newData.hasChildren(['titulo', 'data'])"
      }
    },

    "areas_restritas": {
      "$areaId": {
        ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'gestor' || root.child('users').child(auth.uid).child('permissions').child($areaId).val() === true)",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'gestor' || (root.child('users').child(auth.uid).child('active').val() === true && root.child('users').child(auth.uid).child('permissions').child($areaId).val() === true))",
        "$subItem": {
          ".validate": "!newData.exists() || newData.exists()"
        }
      }
    },

    "logs_auditoria": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'gestor'",
      "$logId": {
        ".write": "auth != null && !data.exists() && newData.exists()",
        ".validate": "newData.hasChildren(['usuario', 'acao', 'timestamp'])"
      }
    }
  }
}
```

---

## 4. CAMADAS DE ACESSO DIFERENCIADAS NA INTERFACE (UI)
1. **Camada 1 (DOM):** Elementos protegidos com `data-modulo="..."` ou `.exclusive-gestor`, ocultos para usuários sem permissão.
2. **Camada 2 (JavaScript):** Validação programática antes de abrir qualquer modal confidencial.
3. **Camada 3 (Servidor / Rules):** Bloqueio matemático no Firebase com `PERMISSION_DENIED`.

---

## 5. BOAS PRÁTICAS ESSENCIAIS
1. **Anti-Cache Rigoroso & version.json:** Headers `Cache-Control: no-cache, no-store, must-revalidate` para HTML/JS/JSON no Firebase Hosting.
2. **Bloqueio de Tela por Inatividade (30 minutos):** Eventos `['mousemove', 'keydown', 'click', 'touchstart']` para deslogar/bloquear tela após inatividade.
3. **Ícone Apple iOS Nativo:** `apple-touch-icon.png` (180x180 px) e metatags para visual perfeito no iPhone.
