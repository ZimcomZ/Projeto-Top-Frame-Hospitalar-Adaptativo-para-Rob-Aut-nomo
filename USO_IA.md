# Uso de Inteligência Artificial no Projeto

## Ferramenta de IA utilizada

Foi utilizada a ferramenta **ChatGPT (modelo GPT-5.3)** como suporte ao desenvolvimento do projeto.

---

## Partes do projeto em que a IA foi utilizada

A IA foi utilizada como apoio técnico nas seguintes áreas:

* Estruturação inicial do projeto com React + Vite
* Construção e organização dos componentes da interface
* Simulação de integração com API hospitalar (envio de JSON para console)
* Auxílio na correção de erros (debug) e ajustes de lógica
* Orientação no processo de deploy utilizando a plataforma Vercel
* Auxílio na documentação

A ferramenta foi utilizada como suporte, sendo o entendimento, adaptação e validação da lógica realizados manualmente.

---

## Partes mais importantes do código para avaliação

As partes consideradas mais relevantes para avaliação técnica são:

### 1. Lógica de gerenciamento de missões

* Ordenação por prioridade (1 > 2 > 3) e distância
* Controle de estados (pendente, em execução, concluída, falha, cancelada)
* Execução sequencial respeitando regras de prioridade

---

### 2. Simulação de telemetria

* Atualização contínua da bateria (descarga e recarga)
* Simulação de latência com comportamento variável
* Integração entre estado do robô e execução das missões

---

### 3. Sistema de alertas

* Geração de alertas com timestamp
* Controle para evitar spam (ex: alerta único de bateria baixa)
* Registro de eventos importantes (falhas, cancelamentos, erros de entrada)

---

### 4. Validação de entrada de dados

* Verificação de campos obrigatórios
* Validação de tipos numéricos
* Geração de múltiplos alertas em caso de erro

---

### 5. Integração simulada com API

* Construção de payload JSON representando o estado do sistema
* Registro no console simulando comunicação com sistema hospitalar

---

## Considerações finais

A IA foi utilizada como ferramenta de apoio para acelerar o desenvolvimento e auxiliar na resolução de problemas técnicos.
Toda a lógica aplicada no sistema foi compreendida, adaptada e validada manualmente durante o desenvolvimento.

## Oque foi aprendido

Como candidato pude entender melhor como funciona a aplicação de API
