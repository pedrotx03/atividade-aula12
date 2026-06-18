import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";

function Login() {
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  async function onSubmit(data) {
    setServerMessage("");
    setServerError("");

    try {
      const response = await api.post("/auth/login", data);

      setServerMessage(
        `${response.data.message} Bem-vindo, ${response.data.user.name}.`
      );
    } catch (erro) {
      if (erro.response && erro.response.data && erro.response.data.message) {
        setServerError(erro.response.data.message);
      } else {
        setServerError("Não foi possível conectar ao servidor.");
      }

      console.error("Erro ao fazer login:", erro);
    }
  }

  return (
    <section>
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="loginEmail">E-mail</label>
          <input
            id="loginEmail"
            type="email"
            placeholder="Digite seu e-mail"
            {...register("email", {
              required: "O e-mail é obrigatório.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Informe um e-mail válido."
              }
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="loginPassword">Senha</label>
          <input
            id="loginPassword"
            type="password"
            placeholder="Digite sua senha"
            {...register("password", {
              required: "A senha é obrigatória.",
              minLength: {
                value: 8,
                message: "A senha deve ter pelo menos 8 caracteres."
              }
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {serverMessage && <p>{serverMessage}</p>}
      {serverError && <p>{serverError}</p>}
    </section>
  );
}

export default Login;