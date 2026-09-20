# CRISTOLÂNDIA CHECK - INSTRUÇÕES DO AGENTE (ANTIGRAVITY)

Este arquivo define os protocolos, regras arquiteturais e o fluxo de trabalho contínuo do projeto **Cristolândia Check PWA**. Todas as instâncias do Antigravity em qualquer computador ou dispositivo devem seguir estritamente estas diretrizes.

---

## 1. FLUXO DE TRABALHO CONTÍNUO (OBRIGATÓRIO)

A cada solicitação, ajuste de código ou avanço de versão realizado no projeto, o agente DEVE executar automaticamente:

1. **Testes e Validação:**
   - Validar integridade com `node test-server.js` e scripts de teste de lógica.
2. **Atualização de Anti-Cache & Versão:**
   - Incrementar o parâmetro de versão (`?v=...`) nos scripts e estilos em `index.html`.
   - Incrementar o `CACHE_NAME` no `sw.js` e a versão em `version.json`.
3. **Commit Semântico no Git:**
   - Adicionar arquivos alterados: `git add .`
   - Realizar commit descritivo: `git commit -m "tipo: descrição clara do ajuste"`
4. **Envio para o GitHub (`git push`):**
   - Enviar alterações para o branch principal: `git push origin main`
5. **Deploy Oficial no Firebase Hosting:**
   - Executar o deploy no Firebase: `npx firebase-tools deploy --only hosting` (no Windows: `cmd.exe /c "npx firebase-tools deploy --only hosting"`)
   - Confirmar a disponibilização em `https://cristolandia-check-app.web.app`.

---

## 2. PILARES ARQUITETURAIS (MOTOR CUIDAR)

O projeto baseia-se no motor de alta resiliência do PWA CUIDAR, documentado na íntegra em [`docs/ARQUITETURA_MOTOR_CUIDAR.md`](./docs/ARQUITETURA_MOTOR_CUIDAR.md). O agente deve manter e seguir estes 7 pilares fundamentais:

1. **Sincronização WebSocket Nativa (Firebase Realtime Database):** Conexão bidirecional em tempo real via eventos `.on('value')` para sincronizar alterações entre dispositivos em menos de 150ms.
2. **Arquitetura In-Memory State First:** Estado global em memória RAM para desenho imediato da tela sem depender da latência de rede.
3. **Persistência de Dupla Camada (Offline-First):** Salvamento síncrono imediato no `LocalStorage` seguido de envio assíncrono para a nuvem. O usuário nunca perde dados se a conexão cair.
4. **Sanitização Obrigatória de Dados:** Todo dado enviado ao Firebase deve ser sanitizado para eliminar propriedades `undefined` via JSON replacer.
5. **Ouvinte de Conexão (`.info/connected`):** Monitoramento contínuo de conectividade com sinalizador visual discreto no topo.
6. **Proteção Contra Múltiplos Cliques:** Bloqueio imediato do botão ao primeiro toque, overlay de sincronização e liberação garantida dentro de blocos `try-finally`.
7. **Regras de Exclusão de Nós:** Autorizar expressamente exclusão (`!newData.exists()`) no `database.rules.json` para evitar bloqueios indesejados.

---

## 3. REGRA CRÍTICA: AVISO DE CONFLITOS

> ⚠️ **AVISO OBRIGATÓRIO AO USUÁRIO:**  
> Sempre que o usuário solicitar uma alteração ou funcionalidade que entre em conflito com as diretrizes do guia arquitetural (`docs/ARQUITETURA_MOTOR_CUIDAR.md`) ou com as regras de segurança/resiliência do app, **o agente DEVE alertar e esclarecer o usuário antes de fazer a alteração**, solicitando confirmação explícita.

---

## 4. METADADOS E LINKS OFICIAIS DO PROJETO

* **Repositório GitHub:** `https://github.com/lucasmdcf-max/CRISTOL-NDIA-Check.git` (Branch: `main`)
* **Firebase Project ID:** `cristolandia-check-app`
* **Console Firebase:** `https://console.firebase.google.com/project/cristolandia-check-app/overview`
* **URL de Produção (Live):** `https://cristolandia-check-app.web.app`
* **URL Alternativa:** `https://cristolandia-check-app.firebaseapp.com`
* **Identidade Visual:** Paleta Nobre (Verde Cristolândia `#1E4D2B`, Dourado Ouro `#C58908`, Bege `#F5F1E8`, Branco `#FFFFFF`).
* **Unidades de Atendimento (3 Despensas):** Missão, Macedônia e Feminina (com navegação por seta e estoques independentes).
