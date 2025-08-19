# Sistema MindU
![React](https://img.shields.io/badge/Front--end-React-blue)
![Node.js](https://img.shields.io/badge/Back--end-Node.js-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

O **MindU** é um sistema abrangente para gerenciamento de consultas, usuários e planos de saúde, oferecendo acessibilidade e interface responsiva. Criado em **React** (frontend), **Node.js** (backend) e **MySQL** (banco de dados).

**Status do Projeto:** Finalizado no final de 2024.

## Stack utilizada

-   **Front-end:**
    -   [React](https://react.dev/)
    -   [React Router DOM](https://reactrouter.com/en/main)
    -   [Axios](https://axios-http.com/)
    -   [Bootstrap](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.netlify.app/)
    -   [React-Fontawesome](https://fontawesome.com/v5/docs/web/use-with/react)
    -   [@djpfs/react-vlibras](https://www.npmjs.com/package/@djpfs/react-vlibras)
-   **Back-end:**
    -   [Node.js](https://nodejs.org/en/)
    -   [Express](https://expressjs.com/)
    -   [Bcrypt](https://www.npmjs.com/package/bcrypt)
    -   [JSON Web Token (JWT)](https://www.npmjs.com/package/jsonwebtoken)
    -   [Dotenv](https://www.npmjs.com/package/dotenv)
    -   [MySQL2](https://www.npmjs.com/package/mysql2)
-   **Banco de Dados:**
    -   [MySQL](https://www.mysql.com/)

## Funcionalidades

- **Controle de Acesso:** Cadastro de 3 tipos de usuários (Empresa, Psicólogo, Funcionário) com bloqueio de rotas baseado no perfil para garantir segurança e privacidade.
- **Gestão de Consultas:** Funcionalidade para criação e agendamento de consultas, levando em consideração a disponibilidade dos psicólogos.
- **Segurança:** Criptografia de senhas com `bcrypt` para proteção dos dados dos usuários.
- **Dashboard de Gestão:** Painel exclusivo para empresas com informações detalhadas sobre os funcionários.
- **Opções de Pagamento:** Suporte para múltiplos métodos de pagamento, incluindo boleto, QR Code Pix e cartão de crédito.
- **Interface Acessível:** Temas claro e escuro e diversas opções de acessibilidade para garantir uma experiência inclusiva para todos.

## Pré-requisitos

Antes de iniciar, você precisa ter o Node.js e o MySQL instalados na sua máquina.

## Configuração do Banco de Dados

Antes de iniciar, crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha_aqui
DB_NAME=bancomindu
```

## Como executar o projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/JessicaAJesus/mindU.git

   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd mindU
   ```

3. Instale as dependências do frontend e do backend:
   ```bash
   cd frontend
   npm install
   ```
   Após
   ```bash
   cd ../backend
   npm install
   ```

4. Configuração do Banco de Dados:
Execute o script SQL localizado em:
   `backend/database/init.sql`
   

5. Inicie o servidor backend:
   ```bash
   cd backend
   node server.js
   ```

6. Inicie o servidor frontend:
   ```bash
   cd frontend
   npm start
   ```

7. Acesse o sistema em http://localhost:3000.

## Usuários de demonstração
A plataforma já vem com 3 usuários cadastrados para teste:

- **Login:** empresa, psicologo ou funcionario
- **Senha:** senha

## Criado e idealizado por:
> Jessica Arruda, Carollini Simplicio, Emily Andrade, Sabrina Abreu e Manuela Ramalho

## Contribuição:
>  Professores William Reis e Rodrigo Alvarez