# Sistema-academico-simples

Sistema acadêmico de cadastro de alunos desenvolvido com Electron e MySQL. Uma aplicação desktop completa com autenticação de usuários e operações CRUD (Create, Read, Update, Delete) em um banco de dados relacional.

![Badge Node](https://img.shields.io/badge/Node.js-22+-green)
![Badge Electron](https://img.shields.io/badge/Electron-45+-blue)
![Badge MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![Badge License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Segurança](#segurança)
- [Solução de Problemas](#solução-de-problemas)
- [Licença](#licença)

## 🎯 Visão Geral

Este projeto é uma aplicação desktop desenvolvida para gerenciar cadastro de alunos em um sistema acadêmico. O sistema utiliza Electron para criar uma interface de usuário baseada em web que roda como uma aplicação nativa, com MySQL como banco de dados relacional para persistência de informações.

### Características Principais

- **Aplicação Desktop**: Interface nativa usando Electron
- **Autenticação**: Sistema de login com credenciais seguras
- **CRUD Completo**: Operações de criação, leitura, atualização e exclusão
- **Segurança**: Validação de dados, proteção contra SQL injection, isolamento de processos
- **Persistência**: Banco de dados MySQL relacional

## ✨ Funcionalidades

### Funcionalidades do Sistema

- **🔐 Autenticação de Usuários**
  - Login seguro com verificação de credenciais
  - Sessão gerenciada pelo processo principal
  - Logout seguro

- **📝 Cadastro de Alunos**
  - Formulário com validação de campos
  - Validação de e-mail (formato e unicidade)
  - Cadastro de nome, e-mail e telefone

- **📋 Listagem de Alunos**
  - Visualização de todos os alunos cadastrados
  - Ordenação por ID (mais recentes primeiro)
  - Tabela responsiva e organizada

- **✏️ Edição de Alunos**
  - Modificação de dados existentes
  - Preenchimento automático do formulário
  - Cancelamento de edição

- **🗑️ Exclusão de Alunos**
  - Confirmação antes de excluir
  - Exclusão segura do banco de dados
  - Feedback visual ao usuário

## 🛠 Tecnologias

### Frontend / Interface
- **Electron 45+**: Framework para aplicações desktop
- **HTML5**: Estrutura da interface
- **CSS3**: Estilização e layout
- **JavaScript (ES6+)**: Lógica da interface

### Backend / Serviços
- **Node.js 22+**: Runtime JavaScript
- **MySQL 8.0+**: Banco de dados relacional
- **mysql2**: Driver MySQL para Node.js
- **dotenv**: Gerenciamento de variáveis de ambiente

### Conceitos Arquiteturais
- **IPC (Inter-Process Communication)**: Comunicação entre processos
- **Context Isolation**: Isolamento de contexto para segurança
- **Preload Scripts**: Ponte segura entre processos
- **Connection Pooling**: Reutilização de conexões com banco

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 22 ou superior)
  - [Download aqui](https://nodejs.org/)
  - Verifique com: `node --version`

- **MySQL Server** (versão 8.0 ou superior)
  - [Download aqui](https://dev.mysql.com/downloads/installer/)
  - Inclui MySQL Workbench (interface gráfica)

- **npm** (gerenciador de pacotes do Node.js)
  - Instalado automaticamente com Node.js
  - Verifique com: `npm --version`

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/T4vinh0h/Sistema-academico-simples.git
cd Sistema-academico-simples
```

### 2. Instale as Dependências

```bash
npm install
```

Isso instalará:
- `electron` (devDependency)
- `mysql2` (dependência de produção)
- `dotenv` (dependência de produção)

## 🗄️ Configuração do Banco de Dados

### Passo 1: Execute o Script SQL

Abra o MySQL Workbench ou outro cliente SQL e execute o arquivo `Data/banco.sql`:

**Via linha de comando:**
```bash
mysql -u root -p < Data/banco.sql
```

**Via MySQL Workbench:**
1. Conecte ao servidor MySQL com usuário `root`
2. Abra o arquivo `Data/banco.sql`
3. Execute o script (CTRL+Enter ou botão de execução)

### O que o script faz:

1. Cria o banco de dados `escola_electron_simples` com codificação UTF-8
2. Cria a tabela `usuarios` para autenticação
3. Insere usuário padrão: `admin` / `Aula#123`
4. Cria a tabela `alunos` com campos:
   - `id` (auto-incremento)
   - `nome` (VARCHAR 100)
   - `email` (VARCHAR 150, único)
   - `telefone` (VARCHAR 15)
5. Insere dados de exemplo
6. Cria usuário MySQL `crud_app` com permissões limitadas

### Passo 2: Verifique a Criação

```sql
USE sistema_electron;
SELECT * FROM usuarios;
SELECT * FROM alunos;
```

## ⚙️ Configuração de Ambiente

### Arquivo .env

O projeto utiliza o arquivo `.env` para configurações sensíveis. Este arquivo já está configurado com valores padrão:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=escola_app
DB_PASSWORD="EscolaDB#2026!"
DB_NAME=escola_electron_simples
```

### Valores Padrão

- **Usuário MySQL**: `escola_app`
- **Senha MySQL**: `EscolaDB#2026!`
- **Banco de dados**: `escola_electron_simples`
- **Host**: `localhost`
- **Porta**: `3306`

### Alterando as Credenciais

Se você precisa alterar as credenciais:

1. Edite o arquivo `.env` na raiz do projeto
2. Modifique os valores conforme necessário
3. Certifique-se de que o usuário MySQL existe e tem as permissões corretas

### Credenciais de Login Padrão

- **Usuário**: `admin`
- **Senha**: `Aula#123`

> ⚠️ **Nota de Segurança**: Em produção, altere estas credenciais e use senhas fortes.

## ▶️ Executando a Aplicação

### Iniciar a Aplicação

```bash
npm start
```

### Primeiro Acesso

1. A aplicação abrirá uma janela de login
2. Use as credenciais padrão:
   - Usuário: `admin`
   - Senha: `Aula@123`
3. Após login, você será redirecionado para a tela de cadastro

### Usando a Aplicação

- **Cadastrar**: Preencha nome, e-mail e telefone, clique em "Cadastrar"
- **Listar**: A lista carrega automaticamente, clique em "Atualizar Lista" para recarregar
- **Editar**: Clique no botão "Editar" de um aluno, modifique os dados e clique em "Salvar"
- **Excluir**: Clique no botão "Excluir" e confirme a operação
- **Sair**: Clique no botão de logout para retornar à tela de login

## 📁 Estrutura do Projeto

```
Sistema-academico-simples/
├── Data/                      # Scripts SQL
│   └── banco.sql             # Script de criação do banco e tabelas
├── HTML/                      # Interface do usuário
│   ├── CSS/                   # Estilos
│   │   └── style.css         # Estilos gerais
│   ├── JAVASCRIPT/            # Scripts JavaScript
│   │   ├── db.js             # Camada de acesso ao banco de dados
│   │   ├── login.js          # Lógica da tela de login
│   │   ├── preload.js        # Ponte segura IPC (renderer ↔ main)
│   │   └── renderer.js       # Lógica da interface principal
│   ├── index.html            # Tela principal de cadastro
│   └── login.html            # Tela de login
├── .env                       # Variáveis de ambiente (não commitado)
├── .gitattributes            # Configurações Git
├── .gitignore                # Arquivos ignorados pelo Git
├── LICENSE                    # Licença MIT
├── main.js                    # Processo principal do Electron
├── package.json               # Configuração do projeto Node.js
├── package-lock.json          # Lock de versões de dependências
└── README.md                  # Este arquivo
```

## 🏗️ Arquitetura

### Arquitetura Electron

O projeto segue a arquitetura multi-processo do Electron:

```
┌─────────────────────────────────────────┐
│        Processo Principal (Main)        │
│  - Gerencia janelas                     │
│  - IPC handlers                         │
│  - Acesso ao banco de dados             │
│  - Controle de sessão                   │
└──────────────┬──────────────────────────┘
               │ IPC (Inter-Process Comm)
               │
┌──────────────┴──────────────────────────┐
│         Processo Renderer (UI)          │
│  - Exibe HTML/CSS                       │
│  - Executa JavaScript da interface      │
│  - Sem acesso direto ao Node.js         │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Renderer** → Interface do usuário interage
2. **Preload** → Expõe APIs seguras via `contextBridge`
3. **IPC** → Comunicação entre processos
4. **Main** → Recebe chamadas, processa lógica
5. **DB** → Executa operações no MySQL
6. **Retorno** → Dados voltam pelo mesmo caminho

### Rotas IPC

| Canal | Função | Handler |
|-------|--------|---------|
| `auth:login` | Autenticação de usuário | `db.autenticar()` |
| `auth:abrirCadastro` | Navegação após login | Carrega `index.html` |
| `auth:sair` | Logout da sessão | Carrega `login.html` |
| `alunos:listar` | Listar todos os alunos | `db.listar()` |
| `alunos:criar` | Criar novo aluno | `db.criar()` |
| `alunos:atualizar` | Atualizar aluno existente | `db.atualizar()` |
| `alunos:excluir` | Excluir aluno | `db.excluir()` |

## 🔒 Segurança

### Medidas de Segurança Implementadas

1. **Isolamento de Processo**
   - `nodeIntegration: false` - Impede acesso direto ao Node.js no renderer
   - `contextIsolation: true` - Separa contextos para evitar ataques
   - `sandbox: true` - Sandbox do processo renderer

2. **Validação de Dados**
   - Validação de campos no frontend e backend
   - Verificação de formato de e-mail
   - Limitação de tamanho de campos

3. **Proteção SQL Injection**
   - Uso de prepared statements com placeholders `?`
   - Nunca concatena strings em queries SQL

4. **Credenciais**
   - Senhas não expostas no código
   - Uso de arquivo `.env` (não versionado)
   - Usuário MySQL com permissões limitadas

5. **Verificação de Origem**
   - Validação de frames em chamadas IPC
   - Prevenção de navegação não autorizada

6. **Content Security Policy**
   - CSP configurado no HTML
   - Previne ataques XSS

## 🔧 Solução de Problemas

### Erro: "Confira o serviço MySQL e a configuração no .env"

**Causa**: MySQL não está rodando ou credenciais incorretas

**Solução**:
1. Verifique se o MySQL está rodando:
   - Windows: Serviços → MySQL
   - Linux: `sudo systemctl status mysql`
2. Verifique as credenciais no arquivo `.env`
3. Teste a conexão com MySQL Workbench

### Erro: "Execute o banco.sql no servidor correto"

**Causa**: Banco de dados ou tabela não existe

**Solução**:
1. Execute o script `Data/banco.sql` no MySQL
2. Verifique se o banco `sistema_electron` foi criado
3. Verifique se as tabelas `usuarios` e `alunos` existem

### Erro: "E-mail já cadastrado"

**Causa**: Tentativa de cadastrar e-mail duplicado

**Solução**:
- Use um e-mail diferente
- O campo `email` tem restrição `UNIQUE` no banco

### Erro: "Faça login para continuar"

**Causa**: Sessão expirada ou não iniciada

**Solução**:
- Faça login novamente com credenciais válidas
- Verifique se `admin` / `Aula@123` existe na tabela `usuarios`

### Janela abre mas fica branca

**Causa**: Erro no carregamento do HTML ou JavaScript

**Solução**:
1. Abra DevTools (CTRL+SHIFT+I)
2. Verifique o console para erros
3. Verifique se os arquivos HTML/JS existem nos caminhos corretos

### Erro de módulo não encontrado

**Causa**: Dependências não instaladas

**Solução**:
```bash
npm install
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
