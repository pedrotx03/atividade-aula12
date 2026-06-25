# Sistema de Cadastro e Login

Atividade pratica de formularios de cadastro e autenticacao com React no frontend e Node.js/Express no backend.

Este README serve como consulta rapida para prova: comandos para iniciar cada parte, estrutura do projeto e templates simples para adaptar os arquivos principais.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- React Hook Form
- Axios

### Backend

- Node.js
- Express
- SQLite
- bcryptjs
- cors

## Como iniciar o projeto

Abra dois terminais: um para o backend e outro para o frontend.

### 1. Backend

```bash
cd Backend
npm install
npm run dev
```

O backend roda em:

```txt
http://localhost:3001
```

Rotas principais:

```txt
GET  /                 testa se a API esta funcionando
POST /auth/register    cadastra usuario
POST /auth/login       faz login
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

O Vite mostra a URL no terminal. Normalmente:

```txt
http://localhost:5173
```

## Comandos uteis

### Frontend

```bash
npm run dev       # inicia em modo desenvolvimento
npm run build     # gera a versao final
npm run preview   # visualiza a versao final localmente
npm run lint      # verifica problemas no codigo
```

### Backend

```bash
npm run dev       # inicia com nodemon
npm start         # inicia com node
```

## Estrutura do projeto

```txt
/
  Frontend/
    src/
      main.jsx              ponto de entrada do React
      App.jsx               junta as telas na pagina
      index.css             estilos globais
      services/api.js       configuracao do Axios
      pages/Register.jsx    formulario de cadastro
      pages/Login.jsx       formulario de login

  Backend/
    src/
      server.js                     cria o servidor Express
      database/db.js                conecta e cria tabela SQLite
      routes/authRoutes.js          define as rotas /auth
      controllers/authController.js regras de cadastro e login
      middlewares/validateAuth.js   validacoes antes do controller
      models/userModel.js           funcoes SQL do usuario
```

## Fluxo da aplicacao

```txt
Usuario preenche formulario no React
        |
        v
Register.jsx ou Login.jsx chama api.post(...)
        |
        v
services/api.js envia para http://localhost:3001
        |
        v
Backend recebe em /auth/register ou /auth/login
        |
        v
Middleware valida os campos
        |
        v
Controller executa a regra
        |
        v
Model acessa o SQLite
        |
        v
Resposta volta para o frontend
```

## Templates do frontend

### `Frontend/src/services/api.js`

Arquivo usado para configurar o endereco do backend.

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001"
});

export default api;
```

Para mudar a porta ou URL da API:

```js
baseURL: "http://localhost:NOVA_PORTA"
```

Para chamar uma rota:

```js
const response = await api.post("/rota", dados);
const response = await api.get("/rota");
```

### `Frontend/src/App.jsx`

Arquivo usado para escolher quais componentes aparecem na tela.

```jsx
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";

function App() {
  return (
    <main>
      <h1>Titulo da aplicacao</h1>

      <Register />
      <hr />
      <Login />
    </main>
  );
}

export default App;
```

Para adicionar uma nova pagina:

```jsx
import MinhaPagina from "./pages/MinhaPagina";

// dentro do return:
<MinhaPagina />
```

### `Frontend/src/pages/Register.jsx`

Modelo de formulario com validacao e envio para a API.

Base do React Hook Form:

```jsx
const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors, isSubmitting }
} = useForm();
```

Template de campo:

```jsx
<div>
  <label htmlFor="campo">Nome do campo</label>
  <input
    id="campo"
    type="text"
    placeholder="Digite algo"
    {...register("campo", {
      required: "Este campo e obrigatorio.",
      minLength: {
        value: 3,
        message: "Digite pelo menos 3 caracteres."
      }
    })}
  />
  {errors.campo && <p>{errors.campo.message}</p>}
</div>
```

Template de envio:

```jsx
async function onSubmit(data) {
  setServerMessage("");
  setServerError("");

  try {
    const response = await api.post("/auth/register", data);
    setServerMessage(response.data.message);
    reset();
  } catch (erro) {
    setServerError(erro.response?.data?.message || "Erro ao conectar.");
  }
}
```

Para adaptar:

```txt
1. Troque os campos do formulario.
2. Troque as regras dentro de register("nomeDoCampo", {...}).
3. Troque a rota do api.post se o backend tiver outro endpoint.
4. Ajuste a mensagem de sucesso ou erro.
```

### `Frontend/src/pages/Login.jsx`

Modelo de formulario simples que consulta a API.

```jsx
async function onSubmit(data) {
  setServerMessage("");
  setServerError("");

  try {
    const response = await api.post("/auth/login", data);
    setServerMessage(response.data.message);
  } catch (erro) {
    setServerError(erro.response?.data?.message || "Erro ao conectar.");
  }
}
```

Para adaptar para outra acao:

```jsx
const response = await api.post("/minha-rota", data);
```

Se a rota for `GET`:

```jsx
const response = await api.get("/minha-rota");
```

### `Frontend/src/main.jsx`

Normalmente nao precisa mexer. Ele renderiza o `App` dentro da `div` com id `root` do `index.html`.

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### `Frontend/src/index.css`

Arquivo para mudar o visual geral.

```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 24px;
}

main {
  max-width: 600px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input,
button {
  padding: 10px;
  font-size: 16px;
}
```

## Templates do backend

### `Backend/src/server.js`

Cria o servidor Express e registra as rotas.

```js
const express = require("express");
const cors = require("cors");
const minhasRotas = require("./routes/minhasRotas");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/prefixo", minhasRotas);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

### `Backend/src/routes/authRoutes.js`

Liga uma rota a um middleware e a um controller.

```js
const express = require("express");
const { minhaFuncao } = require("../controllers/meuController");
const { minhaValidacao } = require("../middlewares/meuMiddleware");

const router = express.Router();

router.post("/rota", minhaValidacao, minhaFuncao);

module.exports = router;
```

### `Backend/src/controllers/authController.js`

Guarda a regra principal da aplicacao.

```js
async function minhaFuncao(req, res) {
  try {
    const { campo } = req.body;

    // regra da aplicacao aqui

    return res.status(200).json({
      message: "Operacao realizada com sucesso."
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      message: "Erro interno."
    });
  }
}

module.exports = {
  minhaFuncao
};
```

### `Backend/src/middlewares/validateAuth.js`

Valida os dados antes de chegar no controller.

```js
function minhaValidacao(req, res, next) {
  const { campo } = req.body;

  if (!campo) {
    return res.status(400).json({
      message: "Campo obrigatorio."
    });
  }

  next();
}

module.exports = {
  minhaValidacao
};
```

### `Backend/src/models/userModel.js`

Guarda as funcoes que acessam o banco.

```js
const db = require("../database/db");

function buscarPorEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.get(sql, [email], (erro, row) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = {
  buscarPorEmail
};
```

### `Backend/src/database/db.js`

Cria/conecta o banco SQLite e define a tabela.

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

Para adicionar uma coluna:

```sql
phone TEXT
```

Depois de mudar a estrutura da tabela em projeto de teste, pode ser necessario apagar `Backend/database.sqlite` e iniciar o backend de novo para recriar o banco.

## Receitas rapidas

### Adicionar campo no cadastro

```txt
1. Frontend/src/pages/Register.jsx
   - Adicione o input.
   - Adicione a validacao no register.

2. Backend/src/middlewares/validateAuth.js
   - Valide o novo campo.

3. Backend/src/database/db.js
   - Adicione a coluna na tabela.

4. Backend/src/models/userModel.js
   - Inclua o campo no INSERT.

5. Backend/src/controllers/authController.js
   - Pegue o campo do req.body e envie para o model.
```

### Criar nova rota

```txt
1. Crie ou edite um controller.
2. Crie uma funcao async com req e res.
3. Exporte a funcao.
4. Importe a funcao no arquivo de rotas.
5. Registre router.get, router.post, router.put ou router.delete.
6. No frontend, chame com api.get, api.post, api.put ou api.delete.
```

Exemplo no frontend:

```js
const response = await api.get("/auth/minha-rota");
```

### Tratar erro no frontend

```js
try {
  const response = await api.post("/rota", data);
  setServerMessage(response.data.message);
} catch (erro) {
  setServerError(erro.response?.data?.message || "Erro ao conectar.");
}
```

### Validar campo obrigatorio com React Hook Form

```jsx
{...register("campo", {
  required: "Campo obrigatorio."
})}
```

### Validar tamanho minimo

```jsx
{...register("senha", {
  minLength: {
    value: 8,
    message: "Minimo de 8 caracteres."
  }
})}
```

### Validar e-mail

```jsx
{...register("email", {
  pattern: {
    value: /^\S+@\S+\.\S+$/,
    message: "Informe um e-mail valido."
  }
})}
```

## Checklist para prova

```txt
[ ] Backend esta rodando em http://localhost:3001
[ ] Frontend esta rodando em http://localhost:5173
[ ] A URL em Frontend/src/services/api.js aponta para o backend correto
[ ] A rota usada no api.post/api.get existe no backend
[ ] Os nomes dos campos do frontend batem com req.body no backend
[ ] As validacoes do frontend e backend usam as mesmas regras
[ ] O banco tem as colunas necessarias
[ ] O erro aparece na tela quando a API retorna problema
```
