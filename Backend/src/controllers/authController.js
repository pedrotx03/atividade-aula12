const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/userModel");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Este e-mail já está cadastrado."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, passwordHash);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user
    });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    return res.status(500).json({
      message: "Erro interno ao cadastrar usuário."
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos."
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos."
      });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (erro) {
    console.error("Erro no login:", erro);

    return res.status(500).json({
      message: "Erro interno ao realizar login."
    });
  }
}

module.exports = {
  register,
  login
};