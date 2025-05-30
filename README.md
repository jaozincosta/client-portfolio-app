# 📊 Client Portfolio App

Sistema completo para gerenciamento de clientes e alocação de ativos financeiros, desenvolvido com Fastify, Prisma, MySQL, Next.js e Docker.

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js + Fastify
- Prisma ORM
- MySQL (via Docker)
- Zod (validação de dados)

### Frontend
- Next.js (TypeScript)
- React Query
- React Hook Form + Zod
- Axios
- ShadCN UI

### DevOps
- Docker Compose

## 🧩 Funcionalidades

- ✅ Cadastro e listagem de clientes (nome, email, status: ativo/inativo)
- ✅ Exibição de ativos financeiros com valores estáticos
- ✅ Visualização das alocações por cliente
- ✅ Interface web com componentes reutilizáveis

## 🐳 Como Rodar o Projeto

```bash
git clone https://github.com/seu-usuario/invest-manager.git
cd invest-manager
docker-compose up --build
