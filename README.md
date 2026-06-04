# Aerocode

Sistema de gestão da produção de aeronaves com front-end React/TypeScript e back-end Node.js/Prisma/MySQL.

## Estrutura do projeto

- `backend/`: servidor API em Node.js, TypeScript, Express e Prisma.
- `frontend/`: SPA React com Vite para gerenciamento de aeronaves, funcionários, peças, etapas, testes e relatórios.
- `frontend/.env.example`: exemplo de variável de ambiente para o frontend.
- `backend/.env.example`: exemplo de variável de ambiente para o backend.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- MySQL rodando localmente ou remotamente
- Editor de código (VS Code recomendado)

## Configuração inicial

### 1. Backend

No terminal:

```bash
cd backend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # Linux / macOS
```

Edite `backend/.env` e ajuste a variável `DATABASE_URL` para sua conexão MySQL.

Em seguida:

```bash
npm run prisma:generate
npm run prisma:migrate:dev --name init
npm run dev
```

O backend estará disponível em:

- `http://localhost:3333`

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # Linux / macOS
```

Verifique que `frontend/.env` contenha:

```env
VITE_API_URL=http://localhost:3333
```

Então execute:

```bash
npm run dev
```

O frontend será aberto em:

- `http://localhost:5173`

## Login

Use um dos perfis padrão para acessar a aplicação:

- Admin: `admin` / `admin123`
- Engenheiro: `engenheiro` / `eng123`
- Operador: `operador` / `op123`

## Como usar

- `Aeronaves`: gerenciar aeronaves cadastradas
- `Funcionários`: gerenciar usuários do sistema
- `Peças`: controlar peças e seu status
- `Etapas`: acompanhar o fluxo de produção por aeronave
- `Testes`: registrar testes aplicados às aeronaves
- `Relatórios`: gerar visão geral dos dados

## Qualidade e relatórios

O backend tem um script de carga em `backend/src/load_test.ts` que avalia desempenho e pode ser usado para gerar métricas de qualidade.

## Compatibilidade

A aplicação é multiplataforma e funciona em Windows, Linux e macOS. Os comandos do `package.json` são padrão do Node.js e não dependem de shell específico.

## Observações

- Se usar Linux ou macOS, prefira `cp` em vez de `copy` para arquivos de ambiente.
- Se o frontend não conectar, confirme se o backend está rodando e se `VITE_API_URL` aponta para `http://localhost:3333`.
- Se houver erro no Prisma, veja se o MySQL está aceitando conexões e se `DATABASE_URL` está correta.
