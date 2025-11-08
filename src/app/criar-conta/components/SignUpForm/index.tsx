import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";

import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField } from "#/components/Inputs";
import PasswordInput from "#/components/Inputs/PasswordInput";

import RenderPasswordStrengthMeter from "#/components/RenderPassword";
import GoogleLogo from "#/components/icons/GoogleLogo";
import { PasswordStrength } from "#/helpers/evaluatePassword";

type SignUpFormProps = {
  emailAddress: string;
  setEmailAddress: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordStrength: PasswordStrength;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  termsAccepted: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEmailValid?: boolean;
  isLoaded?: boolean;
  error?: string;
  setError?: (message: string) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  emailAddress,
  setEmailAddress,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordStrength,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  termsAccepted,
  onSubmit,
  isEmailValid,
  isLoaded,
  error,
  setError,
}) => {
  const { signUp, isLoaded: clerkLoaded } = useSignUp();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const passwordsMatch = password === confirmPassword;
  const showPasswordMismatchError =
    confirmPassword.trim() !== "" && password.trim() !== "" && !passwordsMatch;

  // Handle click outside tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const handleGoogleSignUp = async () => {
    if (!termsAccepted) {
      return;
    }

    try {
      if (!clerkLoaded || !signUp) {
        if (setError)
          setError(
            "Serviço de autenticação não disponível. Tente novamente em alguns instantes."
          );
        return;
      }

      setIsLoading(true);
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
        legalAccepted: termsAccepted,
      });
    } catch (err) {
      setIsLoading(false);
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError?.("Ocorreu um erro ao conectar com Google. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-3 overflow-x-scroll" onSubmit={onSubmit}>
        <div className="relative space-y-2">
          <MailEnvelope
            className="absolute right-4 bottom-[34px] z-40"
            width="20"
            height="20"
            fill="#1C1A22"
          />
          <TextField
            label="Email"
            inputName="emailAddress"
            id="email"
            type="email"
            placeholder="Adicione seu email"
            onChange={(e) => setEmailAddress(e.target.value)}
            value={emailAddress}
          />
        </div>
        {emailAddress.trim() !== "" && !isEmailValid && (
          <div className="text-sm text-red-500">
            Por favor, insira um email válido
          </div>
        )}

        <PasswordInput
          label="Senha"
          id="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

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
        {showPasswordMismatchError && (
          <div className="border-red-light-50 rounded-2xl border bg-red-100 px-6 py-3 text-red-700">
            As senhas não coincidem
          </div>
        )}
        {error && (
          <div className="border-red-light-50 rounded-2xl border bg-red-100 px-6 py-3 text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isLoaded}
          className={`mt-4 h-[54px] w-full cursor-pointer rounded-[var(--radius-s)] bg-[var(--color-primary-light-400)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-light-500)]`}
        >
          {isLoading || !isLoaded ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Criar conta"
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-white-neutral-light-300)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[var(--color-white-neutral-light-200)] px-2 text-[var(--color-white-neutral-light-500)]">
            ou
          </span>
        </div>
      </div>

      <div className="relative flex flex-col justify-end">
        <button
          disabled={!termsAccepted}
          type="button"
          onClick={handleGoogleSignUp}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-s)] border border-[var(--color-white-neutral-light-300)] bg-[var(--color-white-neutral-light-100)] px-4 py-3 font-medium text-[var(--color-white-neutral-light-800)] transition-colors hover:bg-[var(--color-white-neutral-light-200)]"
        >
          <GoogleLogo />
          Continuar com o Google
        </button>
      </div>

      <div className="flex items-center justify-center">
        <p className="text-white-neutral-light-600 text-[10px]">
          Ao criar uma conta, você concorda com os{" "}
          <Link href="/termos-de-uso">
            <span className="text-white-neutral-light-600 text-[10px] underline">
              Termos de uso
            </span>
          </Link>
        </p>
      </div>

      <div className="text-center text-[var(--color-white-neutral-light-500)]">
        Já possui uma conta?{" "}
        <Link href="/">
          <p className="inline-block font-medium text-[var(--color-primary-light-400)] hover:underline">
            {isLoading || !isLoaded ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Faça login"
            )}
          </p>
        </Link>
      </div>
      <div id="clerk-captcha" />
    </>
  );
};

export default SignUpForm;
