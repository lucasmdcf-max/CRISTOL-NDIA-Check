# 🌿 Cristolândia Check (PWA)

Aplicativo PWA de alta performance e resiliência projetado para agilizar o preenchimento, consolidação e acompanhamento dos relatórios diários de cada unidade da **Cristolândia**.

---

## 🎨 Identidade Visual & Design
- **Paleta de Cores**: Fundo em **Bege Suave** (`#F7F4EE`), **Verde Bandeira** (`#008744`), **Verde Musgo** (`#3E5B2E`), **Amarelo Dourado** (`#F59E0B`), **Laranja Vibrante** (`#EA580C`) e **Branco**.
- **Tela Inicial Centrada**: Grid 3x2 com **6 botões quadrados de cantos arredondados** com tridimensionalidade táctil, relevo físico, brilho dinâmico e micro-animações ao passar o mouse ou deslizar o dedo:
  - **Linha Superior (Unidades)**:
    1. 🏛️ **Missão** (Atendimento imediato e triagem)
    2. 🌾 **Macedônia** (Acolhimento e internação)
    3. 🌸 **Feminina** (Mulheres e crianças)
  - **Linha Inferior (Gestão)**:
    4. 📦 **Estoque** (Insumos, alimentos, higiene e alertas de reposição)
    5. 📊 **Relatórios** (Resumo consolidado, exportação WhatsApp e impressão em PDF)
    6. ⛪ **Cadastrar Igreja** (Igrejas mantenedoras, visitas e voluntários)

---

## 🚀 Como Executar Localmente

Certifique-se de que o Node.js está instalado e execute no terminal:

```bash
node server.js
```

Abra seu navegador em: **`http://localhost:3000`**

---

## 📱 Instalação como Aplicativo Nativo (PWA)

O aplicativo conta com **Manifesto Oficial**, **Service Worker** e ícones em alta resolução para instalação na tela de início:

### No iPhone (iOS / Safari):
1. Abra o link do aplicativo no **Safari**.
2. Toque no botão **Compartilhar** (ícone quadrado com uma seta para cima na barra inferior).
3. Role as opções e selecione **"Adicionar à Tela de Início"**.
4. O ícone oficial verde com a cruz e o check aparecerá na tela do seu iPhone como um aplicativo nativo.

### No Android (Chrome):
1. Ao abrir o aplicativo, um banner de instalação aparecerá no topo.
2. Toque em **"Instalar"** ou toque no menu de 3 pontos do Chrome e selecione **"Instalar aplicativo"**.

---

## ⚡ Arquitetura Técnica (Baseada no Motor CUIDAR / Firebase)

1. **In-Memory State First**: Renderização imediata sem espera de rede.
2. **Persistência Dual-Layer (Offline-First)**: Gravação síncrona no `LocalStorage` do aparelho garantindo que dados nunca se percam, com sincronização automática em tempo real para o **Firebase Realtime Database**.
3. **Sanitização Rigorosa**: Tratamento automático de valores `undefined` para evitar erros de escrita no Firebase.
4. **Indicador de Conexão**: Status em tempo real no cabeçalho (Verde = Online, Amarelo/Cinza = Conectando, Vermelho = Offline/Local).
5. **Proteção Anti-Multi-Clique**: Bloqueio de botões e overlay durante salvamento em blocos `try-finally`.
6. **Verificação de Versão Anti-Cache**: Monitoramento automático de `version.json` a cada 60 segundos.

---

## ⚙️ Conectando ao seu Firebase (Opcional)

Por padrão, o Cristolândia Check funciona **100% de forma local e offline**.
Para ativar a sincronização em tempo real entre múltiplos dispositivos da equipe:
1. No app, clique no ícone de **engrenagem (⚙️)** no canto superior direito.
2. Insira a **Database URL** e a **API Key** do seu projeto Firebase.
3. Clique em **"Conectar Firebase"**.
