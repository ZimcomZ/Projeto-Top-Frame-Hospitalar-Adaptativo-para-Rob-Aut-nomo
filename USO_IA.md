# 🤖 Diretrizes de Codificação e Uso de IA

Este projeto utiliza ferramentas de Inteligência Artificial para acelerar o desenvolvimento, garantir a padronização do código e elevar o rigor da cobertura de testes.

## 🛠️ Padronização de Código via IA

A IA foi utilizada para aplicar e manter os seguintes padrões de engenharia:

1.  **Refatoração de Clean Code:** Identificação automática de "God Components" e separação em componentes funcionais menores.
2.  **Arquitetura Baseada em Props:** Garantia de que todos os componentes de UI sejam puros e recebam dados via props, facilitando o teste e a depuração.
3.  **Hooks Customizados:** Implementação de `useMemo` para lógica computacional pesada (como ordenação de filas) e `useCallback` para funções passadas a componentes filhos, prevenindo renderizações desnecessárias.
4.  **Estilo Consistente:** Padronização do CSS para uso de variáveis visuais e layout flexível (Flexbox/CSS Grid).

## 🧪 Estratégia de Testes Assistida

A IA desempenhou um papel central na validação da robustez do sistema através de:

*   **Geração de Casos de Borda (Edge Cases):** Criação de cenários de teste agressivos que tentam quebrar a lógica de prioridade (ex: concorrência de missões, falhas críticas simultâneas).
*   **Implementação de Testes Unitários:** Escrita de suítes de teste usando Vitest para validar funções puras de lógica de negócio.
*   **Simulação de Falhas:** Desenvolvimento de scripts de simulação que induzem latência, erro de hardware e exaustão de bateria para validar o comportamento do dashboard em situações de crise.

## 📈 Benefícios Obtidos

*   **Redução de Bugs:** A análise estática via IA e linter eliminou avisos de Hooks do React e potenciais loops infinitos.
*   **Documentação Viva:** Manutenção automatizada de arquivos de log e README para refletir as últimas mudanças de engenharia.
*   **Segurança Operacional:** Validação formal da lógica de interrupção (Preemption) para garantir que vidas (no cenário hospitalar) sejam sempre priorizadas.

---
*Este projeto demonstra a sinergia entre engenharia humana e ferramentas avançadas de IA.*
