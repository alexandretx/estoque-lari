# Sistema de Gerenciamento de Estoque

Este é um sistema web completo com frontend e backend separados para gerenciamento de estoque de Celulares, Acessórios e Planos Móveis, incluindo autenticação de usuários.

## Tecnologias Utilizadas

*   **Backend:** Node.js, Express, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs
*   **Frontend:** React (Vite), TailwindCSS, Axios, React Router DOM
*   **Hospedagem:** Render (Backend), Vercel (Frontend)

## Estrutura do Projeto

```
/estoque
|-- /backend
|   |-- /controllers
|   |-- /middleware
|   |-- /models
|   |-- /routes
|   |-- /utils
|   |-- .env.example
|   |-- .gitignore
|   |-- package.json
|   `-- server.js
|-- /frontend
|   |-- /public
|   |-- /src
|   |   |-- /assets
|   |   |-- /components
|   |   |-- /context
|   |   |-- /pages
|   |   |-- App.css
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .gitignore
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
`-- README.md
```

## Configuração e Execução Local

### Pré-requisitos

*   Node.js e npm (ou yarn) instalados.
*   Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ou MongoDB rodando localmente).

### Backend

1.  **Navegue até a pasta backend:**
    ```bash
    cd backend
    ```
2.  **Crie o arquivo `.env`:** Copie o conteúdo de `.env.example` para um novo arquivo chamado `.env`.
3.  **Configure as variáveis de ambiente:**
    *   Abra o arquivo `.env`.
    *   Substitua `<username>`, `<password>`, `<cluster-url>`, `<database-name>` pela sua string de conexão do MongoDB Atlas.
    *   Defina um `JWT_SECRET` seguro e único.
    *   A `PORT` pode ser mantida como `5000` ou alterada.
    *   `JWT_EXPIRES_IN` pode ser mantido como `1h`.
4.  **Instale as dependências:**
    ```bash
    npm install
    ```
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O backend estará rodando em `http://localhost:5000` (ou na porta definida no `.env`).

### Frontend

1.  **Abra outro terminal e navegue até a pasta frontend:**
    ```bash
    cd ../frontend
    # ou cd frontend se estiver na raiz
    ```
2.  **(Opcional, mas recomendado) Crie o arquivo `.env`:**
    *   Crie um arquivo chamado `.env` na pasta `frontend`.
    *   Adicione a seguinte linha, ajustando a URL se o backend estiver rodando em porta diferente:
        ```
        VITE_API_URL=http://localhost:5000
        ```
    *   **Importante:** Para usar esta variável, você precisará substituir as URLs hardcoded nos arquivos do frontend (ex: `AuthContext.jsx`, `CelularesPage.jsx`, etc.) por `import.meta.env.VITE_API_URL`.
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O frontend estará rodando em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## Deploy

### Backend (Render)

1.  **Crie uma conta** ou faça login no [Render](https://render.com/).
2.  **Crie um "New Web Service".**
3.  **Conecte seu repositório Git** (GitHub, GitLab, Bitbucket).
4.  **Configurações:**
    *   **Environment:** Node
    *   **Build Command:** `npm install` (ou `yarn install`)
    *   **Start Command:** `npm start` (ou `yarn start`)
5.  **Variáveis de Ambiente:** Adicione as mesmas variáveis de ambiente que você configurou no seu arquivo `.env` local (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT` - o Render define a porta automaticamente, mas pode ser bom definir explicitamente se necessário).
6.  **Clique em "Create Web Service".** O Render fará o build e deploy automaticamente.
7.  Anote a URL fornecida pelo Render para o seu backend (ex: `https://seu-backend.onrender.com`).

### Frontend (Vercel)

1.  **Crie uma conta** ou faça login na [Vercel](https://vercel.com/).
2.  **Crie um "New Project".**
3.  **Importe seu repositório Git.**
4.  **Configurações:**
    *   A Vercel geralmente detecta automaticamente que é um projeto Vite/React.
    *   **Build Command:** `npm run build` (ou `yarn build`)
    *   **Output Directory:** `dist` (padrão do Vite)
    *   **Install Command:** `npm install` (ou `yarn install`)
5.  **Variáveis de Ambiente:**
    *   Adicione a variável `VITE_API_URL` com o valor da URL do seu backend hospedado no Render (ex: `https://seu-backend.onrender.com`).
    *   **Importante:** Certifique-se de que seu código frontend esteja usando `import.meta.env.VITE_API_URL` para se referir à URL da API.
6.  **Clique em "Deploy".** A Vercel fará o build e deploy. 