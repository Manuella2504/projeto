# 🏃‍♂️ SAEPSaúde

> Plataforma web para compartilhamento e monitoramento de atividades físicas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

## 📋 Sobre o Projeto

Sistema web desenvolvido para a empresa SAEPSaúde, permitindo que usuários registrem suas atividades físicas (corrida, caminhada, trilha) e interajam através de curtidas e comentários.

### ✨ Funcionalidades

- 🔐 **Autenticação JWT** - Login e registro seguros
- 🏃 **Gestão de Atividades** - Criar, listar e gerenciar atividades
- ❤️ **Sistema de Likes** - Curtir atividades de outros usuários
- 💬 **Comentários** - Interagir com a comunidade
- 📊 **Estatísticas** - Acompanhar calorias e total de atividades
- 🔍 **Filtros** - Buscar por tipo de atividade
- 📄 **Paginação** - Navegação otimizada

## 🚀 Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL
- **Autenticação:** JWT + Bcrypt
- **Outras:** CORS, Dotenv

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Manuella2504/projeto.git

# Entre no diretório
cd projeto

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=saepsaude
JWT_SECRET=seu_secret_aqui
PORT=3000
```

## 🗄️ Banco de Dados

Execute o script SQL para criar as tabelas:

```bash
mysql -u root -p < database/schema.sql
```

## 🎯 Execução

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```
