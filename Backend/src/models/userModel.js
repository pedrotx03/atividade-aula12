const db = require("../database/db");

function createUser(name, email, passwordHash) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [name, email, passwordHash], function (erro) {
      if (erro) {
        reject(erro);
      } else {
        resolve({
          id: this.lastID,
          name,
          email
        });
      }
    });
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;

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
  createUser,
  findUserByEmail
};