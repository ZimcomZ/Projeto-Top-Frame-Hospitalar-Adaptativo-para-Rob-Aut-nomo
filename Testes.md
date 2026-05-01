# 🤖 Relatório de Testes de Engenharia

Este documento descreve os procedimentos e resultados dos testes realizados na lógica de missão e prioridade do robô.

## 📊 Suíte de Testes Unitários (Vitest)

A lógica central foi testada contra diversos cenários de estresse para garantir que o robô tome a decisão correta em 100% dos casos.

### 1. Teste de Fila de Prioridade (Baseline)
*   **Cenário:** Múltiplas missões pendentes com prioridades e distâncias variadas.
*   **Resultado esperado:** P1 > P2 > P3. Em empate de prioridade, menor distância ganha.
*   **Status:** ✅ PASSOU.

### 2. Teste de Recuperação Estratégica (Blocking Logic)
*   **Cenário:** Uma missão P1 falha. Uma missão P3 surge enquanto a P1 está em fase de recuperação (5s).
*   **Resultado esperado:** O robô deve aguardar a recuperação da P1 e não iniciar a P3, a menos que uma nova P1 ou superior apareça.
*   **Status:** ✅ PASSOU.

### 3. Teste de Preempção (Interrupção)
*   **Cenário:** P3 em curso (20% concluído) vs Nova P2.
*   **Resultado esperado:** Cancelamento imediato da P3 (reset de progresso) e início da P2.
*   **Cenário:** P3 em curso (80% concluído) vs Nova P2.
*   **Resultado esperado:** Conclusão da P3 e início da P2 em sequência.
*   **Status:** ✅ PASSOU.

### 4. Teste Anti-Confusão (Zombie State)
*   **Cenário:** Injetar missões P1 com status de "Concluída" ou "Falha" misturadas com missões P3 "Pendentes".
*   **Resultado esperado:** O sistema deve priorizar missões ATIVAS, nunca tratando uma missão morta como prioridade de execução.
*   **Status:** ✅ PASSOU.

## ⚙️ Testes de Integração e UX
*   **Auto-Cleanup:** Verificado que missões canceladas/concluídas desaparecem após 60s.
*   **Battery Safety:** Verificado consumo de 1% a cada 5s e recarga rápida (2s) em repouso.
*   **Emergency Stop:** Verificado que o acionamento global congela o motor e devolve a missão atual para a fila.

---
*Relatório gerado automaticamente via suíte Vitest.*
