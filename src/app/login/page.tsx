"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { validateEmail } from "#/helpers/validateEmail";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import { TextField, CheckboxInput } from "#/components/Inputs";
import IntroSlider from "#/components/IntroSlider";
import FormHeader from "#/app/onboarding/components/FormHeader";

import GoogleLogo from "#/components/icons/GoogleLogo";
import PasswordInput from "#/components/Inputs/PasswordInput";
import MailEnvelope from "#/components/icons/MailEnvelope";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive, isLoaded: clerkLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  const isEmailValid =
    emailAddress.trim() === "" || validateEmail(emailAddress);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check for empty or invalid fields
    if (
      emailAddress.trim() === "" ||
      !validateEmail(emailAddress) ||
      password.trim() === ""
    ) {
      setError(
        "Por favor, preencha todos os campos corretamente para acessar sua conta."
      );
      return;
    }
    try {
      setIsLoading(true);
      const signInAttempt = await signIn?.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt?.status === "complete") {
        await setActive?.({
          session: signInAttempt?.createdSessionId,
        });
        router.push("/");
      } else {
        setIsLoading(false);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: unknown) {
      setIsLoading(false);
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError(
          "Email ou senha incorretos. Se você não tem uma conta, clique em 'Criar conta'."
        );
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!clerkLoaded || !signIn) {
        setError(
          "Serviço de autenticação não disponível. Tente novamente em alguns instantes."
        );
        return;
      }

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError("Ocorreu um erro ao conectar com Google. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen min-h-[800px] place-items-center pt-0 pb-0">
      <Navbar />
      <div className="relative flex h-full w-full items-center justify-center gap-0">
        <IntroSlider />

        <div className="mb-6 flex w-full items-center justify-center px-8 pt-[78px] sm:mb-0 sm:p-0 sm:pt-0 lg:w-1/2">
          <div className="w-full max-w-[480px] space-y-8">
            <FormHeader title="Entrar" description="Acesse sua conta Nepfy!" />

            <form className="space-y-3" onSubmit={handleSubmit}>
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

              <div className="relative space-y-2">
                <PasswordInput
                  label="Senha"
                  id="password"
                  placeholder="Insira a sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckboxInput
                    label="Lembrar-se da senha"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </div>
                <Link href="/recuperar-conta">
                  <p className="inline-block font-medium text-[var(--color-primary-light-400)] hover:underline">
                    Esqueceu a senha?
                  </p>
                </Link>
              </div>

              <button
                type="submit"
                className={`mt-4 h-[54px] w-full cursor-pointer rounded-[var(--radius-s)] bg-[var(--color-primary-light-400)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-light-500)]`}
                disabled={!isEmailValid || !password.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin self-center" />
                  </div>
                ) : (
                  "Acessar conta"
                )}{" "}
              </button>
            </form>
            {error && (
              <div className="border-red-light-50 rounded-2xl border bg-red-100 px-6 py-3 text-red-700">
                {error}
              </div>
            )}

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

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-s)] border border-[var(--color-white-neutral-light-300)] bg-[var(--color-white-neutral-light-100)] px-4 py-3 font-medium text-[var(--color-white-neutral-light-800)] transition-colors hover:bg-[var(--color-white-neutral-light-200)]"
            >
              <GoogleLogo />
              Fazer login com o Google
            </button>

            <div className="text-center text-[var(--color-white-neutral-light-500)]">
              Você é novo aqui?{" "}
              <Link href="/criar-conta">
                <p className="inline-block font-medium text-[var(--color-primary-light-400)] hover:underline">
                  Criar conta
                </p>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
