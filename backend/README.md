# Backend Aerocode

Este diretório contém o backend da aplicação Aerocode, implementado em Node.js com TypeScript e Prisma ORM.

## Como usar

### Pré-requisitos
- Node.js 18+ ou superior
- MySQL instalado e acessível
- `npm` disponível

### Configuração
1. Instale dependências:
```bash
cd backend
npm install
```
2. Crie o arquivo `.env` a partir do exemplo:
```bash
copy .env.example .env
```
3. Ajuste a variável `DATABASE_URL` no `.env` para seu servidor MySQL.

### Inicializar Prisma
```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

### Rodar o servidor
```bash
npm run dev
```

### Inicialização padrão
O servidor cria usuários padrão automaticamente no primeiro início caso ainda não existam no banco:
- `admin` / `admin123`
- `engenheiro` / `eng123`
- `operador` / `op123`

### Gerar o relatório de qualidade
Antes de gerar o relatório, inicie o servidor e confirme que ele está funcionando em `http://localhost:3333`.

```bash
npm run report
```

O script de relatório escreve o arquivo `frontend/relatorio_qualidade.md` com as métricas de latência, tempo de processamento e tempo de resposta.

## Observações
- A plataforma Node.js é compatível com Windows 10 e Ubuntu 24.04.
- O Prisma ORM está configurado para MySQL via `datasource db` em `prisma/schema.prisma`.
- O arquivo `.env` não deve ser versionado.
