# ✈️ Aerocode - Sistema de Gestão de Produção de Aeronaves

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

Este é o **Aerocode**, um sistema Single Page Application (SPA) moderno para gerenciamento de linhas de montagem aeroespaciais.
O projeto foi totalmente migrado de uma interface de linha de comando (CLI) para uma arquitetura Web Full-Stack, cumprindo rigorosamente os padrões de qualidade exigidos.

---

## 📋 Pré-requisitos

Para rodar este projeto na sua máquina local, certifique-se de ter os seguintes softwares instalados:

- **Node.js** (versão 18 ou superior)
- **MySQL** (Servidor rodando localmente na porta 3306)
- **Git** (Para clonar o repositório)

---

## 🚀 Passo a Passo: Como Clonar e Rodar o Sistema

### 1. Clonando o repositório

Abra o seu terminal e execute:

```bash
git clone https://github.com/mavygarcia/AV3.git
cd AV3
```

A partir daqui, você precisará abrir **dois terminais diferentes** (um para o backend e outro para o frontend).

---

### 2. Configurando o Backend (API + Banco de Dados)

No seu primeiro terminal, entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

**Configurando o Banco de Dados:**
1. Renomeie o arquivo `.env.example` para `.env` (ou copie seu conteúdo).
2. Abra o arquivo `backend/.env` e ajuste a string de conexão do `DATABASE_URL` com as credenciais do seu MySQL local. Exemplo:
   `DATABASE_URL="mysql://usuario:senha@127.0.0.1:3306/aerocode"`

**Criando as Tabelas e Iniciando o Servidor:**
Ainda no terminal do backend, execute os comandos abaixo para gerar o banco e subir a API:

```bash
npm run prisma:generate
npm run prisma:migrate:dev --name init
npm run dev
```
✅ Se tudo der certo, você verá a mensagem: `Server is running on port 3333`.

---

### 3. Configurando o Frontend (Interface Visual)

Abra um **segundo terminal** na raiz do projeto (pasta `AV3`), entre na pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

*(O frontend já possui um arquivo \`.env.example\` pronto. Caso seu backend rode numa porta diferente de 3333, renomeie para \`.env\` e mude a variável \`VITE_API_URL\`)*.

**Iniciando a Interface Visual:**
```bash
npm run dev
```

✅ O servidor frontend iniciará e você poderá acessar a interface pela URL exibida no terminal, normalmente: **http://localhost:5173**

---

## 🔑 Acessando o Sistema (Login)

O banco de dados já é populado automaticamente com contas padrão para facilitar a sua avaliação. 
Use qualquer uma das credenciais abaixo para entrar no sistema:

| Perfil | Usuário | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` |
| **Engenheiro** | `engenheiro` | `eng123` |
| **Operador** | `operador` | `op123` |

---

## 📊 Relatório de Qualidade e Teste de Carga

O projeto acompanha um teste de carga rigoroso para medir a latência, processamento e tempo de resposta da API sob estresse simulado (1, 5 e 10 usuários simultâneos).

Para rodar este script e atestar o desempenho do sistema, basta abrir um terminal na pasta `backend` com a API ligada e rodar:

```bash
npm run report
```

Os resultados matemáticos oficiais e a metodologia detalhada encontram-se documentados no arquivo de entrega: `relatorio_qualidade.md` (na raiz do projeto).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript, Componentes Responsivos.
- **Backend:** Node.js, Express, TypeScript.
- **Banco de Dados:** MySQL com mapeamento relacional via Prisma ORM.

**Plataformas Homologadas:** O software rodará perfeitamente e nativamente nos sistemas operacionais **Windows 10+** e nas distribuições Linux baseadas no Ubuntu (**Ubuntu 24.04.03+**).
