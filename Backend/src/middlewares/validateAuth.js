function isValidEmail(email) {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
}

function validateRegister(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      message: "Todos os campos são obrigatórios."
    });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({
      message: "O nome deve ter pelo menos 3 caracteres."
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "Informe um e-mail válido."
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 8 caracteres."
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "As senhas não coincidem."
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "E-mail e senha são obrigatórios."
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "Informe um e-mail válido."
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin
};