# Regras e Diretrizes do Motor CUIDAR para Antigravity

1. **Persistência em Dupla Camada:** Sempre salvar sincronamente no LocalStorage antes de enviar ao Firebase.
2. **In-Memory State First:** Interface deve carregar imediatamente da memória / local e re-renderizar pontualmente ao receber eventos `.on('value')`.
3. **Sanitização:** Eliminar campos `undefined` em toda transação de banco.
4. **Commits & Deploys Contínuos:** A cada versão ou ajuste, realizar commit semântico, `git push origin main` e deploy no Firebase (`npx firebase-tools deploy --only hosting`).
5. **Anti-Cache:** Incrementar `?v=` nos assets em `index.html`, `sw.js` e `version.json`.
6. **Aviso de Conflito Obrigatório:** Se o usuário solicitar qualquer funcionalidade ou ajuste que conflite com o guia arquitetural (`docs/ARQUITETURA_MOTOR_CUIDAR.md`), avisar o usuário antes de aplicar.
