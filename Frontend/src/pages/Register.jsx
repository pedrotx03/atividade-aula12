import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";

function Register() {
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch("password");

  async function onSubmit(data) {
    setServerMessage("");
    setServerError("");

    try {
      const response = await api.post("/auth/register", data);

      setServerMessage(response.data.message);
      reset();
    } catch (erro) {
      if (erro.response && erro.response.data && erro.response.data.message) {
        setServerError(erro.response.data.message);
      } else {
        setServerError("Não foi possível conectar ao servidor.");
      }

      console.error("Erro ao cadastrar:", erro);
    }
  }

  return (
    <section>
      <h2>Cadastro</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            {...register("name", {
              required: "O nome é obrigatório.",
              minLength: {
                value: 3,
                message: "O nome deve ter pelo menos 3 caracteres."
              }
            })}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
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
          <label htmlFor="password">Senha</label>
          <input
            id="password"
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

        <div>
          <label htmlFor="confirmPassword">Confirmação de senha</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            {...register("confirmPassword", {
              required: "A confirmação de senha é obrigatória.",
              validate: (value) =>
                value === password || "As senhas não coincidem."
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {serverMessage && <p>{serverMessage}</p>}
      {serverError && <p>{serverError}</p>}
    </section>
  );
}

export default Register;