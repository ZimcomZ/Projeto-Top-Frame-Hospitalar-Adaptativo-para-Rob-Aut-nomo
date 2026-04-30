## Testes Manuais

### 1. Criação de missão com validação

**Passos:**

* Deixar algum campo vazio (ex: origem)
* Inserir texto em prioridade (ex: "abc")
* Clicar em "ADICIONAR"

**Resultado esperado:**

* Um alerta é exibido para cada erro cometido
* A missão NÃO é criada
* Os alertas indicam exatamente o problema (campo vazio, valor inválido, etc.)

---

### 2. Execução automática de missão

**Passos:**

* Criar uma missão válida
* Aguardar alguns segundos

**Resultado esperado:**

* A missão muda de "pendente" para "em_execucao"
* O tempo (distância) começa a diminuir a cada segundo
* Ao chegar em 0, a missão muda para "concluida"

---

### 3. Sistema de alertas e telemetria

**Passos:**

* Observar o sistema em funcionamento
* Aguardar a bateria cair abaixo de 20% ou ocorrer latência alta

**Resultado esperado:**

* Um alerta é exibido quando a bateria fica baixa (sempre que descer abaixo de 20%)
* Alertas de latência aparecem ocasionalmente
* Cada alerta contém data e hora
* A telemetria (bateria, latência, status) é atualizada em tempo real
