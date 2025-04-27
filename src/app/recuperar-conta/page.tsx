"use client";

import { useState, useEffect } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Navbar from "#/components/Navbar";

import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField } from "#/components/Inputs";
import PasswordInput from "#/components/Inputs/PasswordInput";
import RenderPasswordStrengthMeter from "#/components/RenderPassword";

import { validateEmail } from "#/helpers/validateEmail";
import {
  evaluatePasswordStrength,
  PasswordStrength,
} from "#/helpers/evaluatePassword";

export default function AccountRecovery() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "none",
    score: 0,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [code, setCode] = useState("");

  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid =
    emailAddress.trim() === "" || validateEmail(emailAddress);

  const isNewPasswordFormValid = () => {
    return (
      code.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      passwordStrength.strength !== "fraca"
    );
  };

  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p> Carrregando, por favor aguarde! </p>
      </div>
    );
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        if (
          err instanceof Error &&
          "errors" in err &&
          Array.isArray(err.errors)
        ) {
          setError(
            "Não encontramos essa conta. Por favor, verifique se o email está correto."
          );
        }
      });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
        }
      })
      .catch((err) => {
        if (
          err instanceof Error &&
          "errors" in err &&
          Array.isArray(err.errors)
        ) {
          setError(
            "Tivemos um problema ao cadastrar sua nova senha. Por favor, verifique se o código está correto."
          );
        }
      });
  }

  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 min-h-screen">
      <Navbar desktopLogoColor="#1C1A22" />
      <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
        <div className="w-full max-w-[480px] space-y-8 mb-6 sm:mb-0">
          <div className="space-y-2">
            <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center">
              {successfulCreation ? "Cadastrar nova senha" : "Recuperar conta"}
            </h2>
            <p className="text-[var(--color-white-neutral-light-500)] text-center">
              {successfulCreation
                ? "Insira o código recebido por email email e cadastre uma nova senha."
                : "Insira o email cadastrado para receber um código de validação que será necessário para cadastro da nova senha."}
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={!successfulCreation ? create : reset}
          >
            {!successfulCreation && (
              <>
                <div className="space-y-2 relative">
                  <MailEnvelope
                    className="absolute right-4 bottom-2"
                    width="20"
                    height="20"
                  />
                  <TextField
                    label="Insira seu email"
                    inputName="email"
                    id="email"
                    type="email"
                    placeholder="exemplo@seudominio.com"
                    onChange={(e) => setEmailAddress(e.target.value)}
                    value={emailAddress}
                  />
                </div>
                {emailAddress.trim() === "" ||
                  (!isEmailValid && (
                    <div className="text-red-500 text-sm">
                      Por favor, insira um email válido
                    </div>
                  ))}
                {error && (
                  <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl border border-red-light-50">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!validateEmail(emailAddress)}
                  className={`w-full py-3 px-4 text-white rounded-[var(--radius-s)] font-medium transition-colors mt-4 h-[54px] ${
                    !validateEmail(emailAddress)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] cursor-pointer"
                  }`}
                >
                  Enviar código de recuperação
                </button>
              </>
            )}

            {successfulCreation && (
              <>
                <div className="space-y-2">
                  <TextField
                    label="Insira o código enviado para o email cadastrado"
                    inputName="code"
                    id="code"
                    type="text"
                    placeholder="Código de recuperação"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                  />
                </div>

                <div className="space-y-2 relative">
                  <PasswordInput
                    label="Nova senha"
                    id="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPassword={showPassword}
                    toggleShowPassword={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="w-[112px]">
                  <RenderPasswordStrengthMeter
                    password={password}
                    passwordStrength={passwordStrength}
                  />
                </div>

                <PasswordInput
                  label="Confirme a senha"
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showPassword={showConfirmPassword}
                  toggleShowPassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
                {error && (
                  <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl border border-red-light-50">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isNewPasswordFormValid()}
                  className={`w-full py-3 px-4 text-white rounded-[var(--radius-s)] font-medium transition-colors mt-4 h-[54px] ${
                    isNewPasswordFormValid()
                      ? "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Cadastrar nova senha
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
