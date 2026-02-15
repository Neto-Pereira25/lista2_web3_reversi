# 🎮 Reversi Online --- DSW3 Lista 2

Projeto desenvolvido para a disciplina **Desenvolvimento de Sistemas Web
3**\
Curso: Tecnologia em Análise e Desenvolvimento de Sistemas\
Professor: Paulo Maurício Gonçalves Júnior

---

## 📌 Sobre o Projeto

Este projeto implementa o jogo **Reversi (Othello)** com arquitetura
cliente-servidor, utilizando:

- Node.js
- TypeScript
- WebSocket
- Comunicação em JSON
- Regra de negócio implementada integralmente no servidor

A aplicação permite múltiplas salas de jogo, com dois jogadores ativos e
espectadores.

---

## ✅ Requisitos da Atividade (Atendidos)

### ✔ Estado Inicial do Jogo

O jogo inicia com quatro peças posicionadas no centro do tabuleiro:

- ⚫ Pretas: (3,3) e (4,4)
- ⚪ Brancas: (3,4) e (4,3)
- O primeiro turno é do jogador BLACK

---

### ✔ Validação de Jogadas

Uma jogada é válida apenas se:

- Houver ao menos uma linha reta (horizontal, vertical ou diagonal)
- Não existirem espaços vazios entre a nova peça e outra peça da mesma
  cor
- Houver uma ou mais peças do oponente entre elas

A regra está implementada no servidor.

---

### ✔ Captura de Peças

Após jogada válida:

- Todas as peças do adversário entre a nova peça e outra peça do
  jogador são convertidas.

---

### ✔ Alternância de Turnos

- Os jogadores jogam alternadamente.
- O servidor controla e informa de quem é a vez.

---

### ✔ Condição de Fim de Jogo

O jogo termina quando:

- Nenhum jogador puder realizar jogadas válidas
- Ou o tabuleiro estiver completamente preenchido

Resultado possível:

- Vitória BLACK
- Vitória WHITE
- Empate (DRAW)

---

### ✔ Regra de Negócio no Servidor

Toda a lógica de: - Validação de jogadas - Captura de peças -
Alternância de turno - Verificação de vitória - Controle de jogadores

Está implementada exclusivamente no servidor.

---

### ✔ Servidor em Node.js com TypeScript

O backend foi desenvolvido utilizando Node.js e TypeScript.

---

### ✔ Comunicação via WebSocket em JSON

- Comunicação bidirecional em tempo real
- Uso da biblioteca ws
- Mensagens trafegadas no formato JSON

---

## 🏗 Arquitetura do Projeto

    reversi/
    │
    ├── server/
    │   ├── src/
    │   │   ├── core/
    │   │   ├── application/
    │   │   ├── types/
    │   │   └── server.ts
    │   └── tests/
    │
    └── client/
        ├── index.html
        ├── script.js
        └── style.css

---

## 🧪 Testes Automatizados

Implementados com: - Jest - ts-jest

Para rodar os testes:

```bash
cd server
npm install
npm test
```

Para relatório de cobertura:

```bash
npm run coverage
```

---

## 🚀 Como Executar o Projeto

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Compilar TypeScript

```bash
npm run build
```

### 3. Iniciar servidor

```bash
npm start
```

### 4. Abrir o cliente

Abra o arquivo `client/index.html` no navegador.

---

## 🎓 Considerações Finais

Este projeto atende integralmente aos requisitos da Segunda Lista de
Exercícios da disciplina de Desenvolvimento de Sistemas Web 3.

Demonstra: - Arquitetura cliente-servidor - Uso de WebSocket - Regra de
negócio no backend - Testes automatizados - Interface funcional e
organizada
