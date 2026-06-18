const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de cadastro e login funcionando."
  });
});

app.use("/auth", authRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});