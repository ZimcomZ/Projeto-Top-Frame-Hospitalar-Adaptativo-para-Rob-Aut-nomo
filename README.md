# Dashboard de Controle de Robô Hospitalar Autônomo

Sistema de monitoramento e gerenciamento de missões para robótica hospitalar, focado em alta disponibilidade, segurança operacional (Safety) e gerenciamento dinâmico de prioridades.

## Visão Geral do Projeto

Este dashboard foi desenvolvido para simular o centro de controle de um robô autônomo operando em ambiente hospitalar. O sistema gerencia o ciclo de vida completo de uma missão, desde a triagem e ordenação por prioridade clínica até o tratamento de falhas críticas de hardware e bateria.

## Arquitetura Técnica

A solução foi estruturada utilizando padrões modernos de desenvolvimento web para garantir escalabilidade e manutenibilidade:

*   **Frontend:** React 19 + Vite (para renderização de alta performance e HMR).
*   **Estado e Reatividade:** Hooks customizados (useMemo, useCallback) para garantir que a lógica de ordenação e os efeitos colaterais de telemetria não causem re-renderizações desnecessárias.
*   **Persistência (LocalStorage):** Sincronização automática do estado da fila, bateria e logs com o armazenamento local do navegador, garantindo resiliência contra recarregamentos acidentais.
*   **Feedback Espacial (RobotMap):** Renderização de uma grade 2D que interpola a posição do robô. Agora conta com **interatividade**, permitindo que o operador clique diretamente nos pontos de interesse (Farmácia, Laboratórios, Quartos) no mapa para preencher automaticamente a origem e o destino de novas missões.
*   **Integração Contínua (CI):** Pipeline configurado via GitHub Actions para validação automática de lint e execução de testes unitários a cada commit.
*   **Modularização (Clean Architecture):**
    *   src/components/: Componentes de UI desacoplados e reutilizáveis.
    *   src/utils/: Lógica de negócio pura, isolada da camada de apresentação para facilitar testes.
    *   src/App.jsx: Orquestrador central (Container Component).

## Algoritmo de Missão e Preempção

O núcleo do sistema utiliza um motor de decisão baseado em Preempção de Prioridade:

1.  **Prioridade 1 (Urgência Máxima):** Interrompe imediatamente qualquer missão em curso (P2 ou P3).
2.  **Prioridade 2 (Urgência Moderada):** Interrompe missões P3 se o progresso atual for inferior a 50% (evitando desperdício de energia em missões quase concluídas).
3.  **Auditabilidade:** Missões interceptadas mantêm um log de "Interception Metadata" (Motivo, Data e Hora) e têm seu progresso resetado para garantir a integridade da carga.

## Estratégia de Qualidade (QA)

A confiabilidade do sistema é garantida por uma suíte de testes unitários que cobre cenários extremos:
*   Ordenação estável em empates múltiplos.
*   Proteção contra "Missões Zumbis" (missões inativas com alta prioridade).
*   Recuperação estratégica de falhas (Bloqueio seletivo de tarefas).

**Executar Testes:**
```bash
npm run test
```

## Instalação e Uso

1. Instale as dependências: npm install
2. Inicie o servidor: npm run dev
3. Acesse: http://localhost:5173

---
*Documentação técnica rigorosa para processos de avaliação de engenharia.*
