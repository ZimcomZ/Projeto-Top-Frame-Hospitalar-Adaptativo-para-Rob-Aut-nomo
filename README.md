# Sistema de Controle de Robô Hospitalar (Simulado)

## Descrição do Projeto

Este projeto consiste em uma aplicação web que simula o controle de um robô hospitalar responsável pelo transporte de cargas dentro de um ambiente hospitalar.

O sistema foi desenvolvido com foco em simulação em tempo real, exibindo:

* Execução de missões
* Telemetria do robô
* Sistema de alertas
* Integração simulada com API hospitalar

A interface segue o estilo de terminal, com visual minimalista e foco em leitura de dados.

---

## Tecnologias Utilizadas

* React (interface)
* Vite (build e ambiente de desenvolvimento)
* JavaScript (lógica do sistema)
* CSS (estilização estilo terminal)
* Vercel (deploy)

---

## Como Executar o Projeto Localmente

### 1. Pré-requisitos

É necessário ter instalado:

* Node.js (versão 16 ou superior)
* npm (gerenciador de pacotes)

---

### 2. Clonar o repositório

```bash
git clone https://github.com/ZimcomZ
```

---

### 3. Acessar a pasta do projeto

```bash
cd Projeto-Top-Frame-Hospitalar-Adaptativo-para-Rob-Aut-nomo
```

---

### 4. Instalar as dependências

```bash
npm install
```

---

### 5. Rodar o projeto

```bash
npm run dev
```

---

### 6. Acessar no navegador

Abra:

```
http://localhost:5173
```

---

## Deploy

O projeto foi publicado utilizando a plataforma:

* **Vercel**

A Vercel foi escolhida por sua integração direta com projetos React + Vite, permitindo deploy automático a partir do repositório.

---

## Funcionalidades do Sistema

### 1. Criação de Missões

O usuário pode criar missões informando:

* Origem
* Destino
* Tipo de carga
* Prioridade (1 a 3)
* Distância estimada

#### Validações:

* Campos obrigatórios não podem estar vazios
* Prioridade deve ser numérica (1 a 3)
* Distância deve ser maior que zero

Caso haja erro, o sistema gera alertas detalhados.

---

### 2. Execução Automática de Missões

* O robô executa automaticamente a próxima missão disponível
* A ordem segue:

  * Prioridade (1 > 2 > 3)
  * Menor distância
* Missões levam tempo real baseado na distância (em segundos)

---

### 3. Sistema de Alertas

O sistema registra eventos importantes, como:

* Erros de validação
* Latência alta
* Bateria baixa
* Falha de missão
* Cancelamento de missão

Cada alerta contém:

* Mensagem
* Data e hora (baseado no sistema do usuário)

---

### 4. Telemetria em Tempo Real

Dados atualizados constantemente:

* Bateria (%)
* Latência (ms)
* Status do robô
* Missão atual
* Última atualização

#### Comportamentos simulados:

* Bateria:

  * Diminui durante execução
  * Recarrega quando o robô está ocioso
* Latência:

  * Oscila continuamente
  * Pequena chance de picos altos

---

### 5. Falhas e Recuperação

* Missões podem falhar automaticamente
* Se a bateria chegar a 0%, a missão falha
* Missões com falha retornam para "pendente" após 10 segundos

---

### 6. Cancelamento de Missão

* O usuário pode cancelar a missão atual manualmente
* O sistema registra o evento e gera alerta

---

### 7. Integração REST Simulada (Opção A)

O sistema simula envio de dados para uma API hospitalar.

Sempre que ocorre um evento relevante, é gerado um objeto JSON contendo:

* ID da missão
* Origem e destino
* Tipo de carga
* Prioridade
* Status da missão
* Timestamp

Esse JSON é exibido no console do navegador.

---

## Observações

Este projeto é uma simulação, não havendo integração com hardware real ou backend persistente.

O foco está na lógica de controle, organização de tarefas e simulação de comportamento de um sistema autônomo.

Projeto desenvolvido para fins acadêmicos e avaliação técnica.
