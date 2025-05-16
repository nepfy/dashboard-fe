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

export default function Login() {
  const { signIn, setActive, isLoaded: clerkLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const isFormValid = () => {
    return (
      emailAddress.trim() !== "" &&
      validateEmail(emailAddress) &&
      password.trim() !== ""
    );
  };

  const isEmailValid =
    emailAddress.trim() === "" || validateEmail(emailAddress);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const signInAttempt = await signIn?.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt?.status === "complete") {
        await setActive?.({ session: signInAttempt?.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: unknown) {
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
    }
  };

  return (
    <div className="grid place-items-center pb-0 pt-0 h-screen min-h-[800px]">
      <Navbar />
      <div className="grid xl:grid-cols-2 w-full h-full relative">
        <IntroSlider
          title="Gere propostas"
          description="Prepare uma proposta visualmente cativante e bem estruturada."
        />

        <div className="flex items-center justify-center pt-[78px] sm:pt-0 px-8 sm:p-0 mb-6 sm:mb-0">
          <div className="w-full max-w-[480px] space-y-8">
            <FormHeader title="Entrar" description="Acesse sua conta Nepfy!" />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 relative">
                <MailEnvelope
                  className="absolute right-4 bottom-[14px]"
                  width="20"
                  height="20"
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
                <div className="text-red-500 text-sm">
                  Por favor, insira um email válido
                </div>
              )}

              <div className="space-y-2 relative">
                <PasswordInput
                  label="Senha"
                  id="password"
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckboxInput label="Lembrar-se da senha" id="terms" />
                </div>
                <Link href="/recuperar-conta">
                  <p className="text-[var(--color-primary-light-400)] hover:underline inline-block font-medium">
                    Esqueceu a senha?
                  </p>
                </Link>
              </div>

              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-3 px-4 text-white rounded-[var(--radius-s)] font-medium transition-colors mt-4 h-[54px] cursor-pointer ${
                  isFormValid()
                    ? "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Acessar conta
              </button>
            </form>
            {error && (
              <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl border border-red-light-50">
                {error}
              </div>
            )}

            <div className="text-center text-[var(--color-white-neutral-light-500)]">
              Você é novo aqui?{" "}
              <Link href="/criar-conta">
                <p className="text-[var(--color-primary-light-400)] hover:underline inline-block font-medium">
                  Criar conta
                </p>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-white-neutral-light-300)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--color-white-neutral-light-200)] text-[var(--color-white-neutral-light-500)]">
                  ou
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] rounded-[var(--radius-s)] font-medium border border-[var(--color-white-neutral-light-300)] hover:bg-[var(--color-white-neutral-light-200)] transition-colors flex items-center justify-center gap-2 mt-2 sm:mt-4 h-[54px]"
            >
              <GoogleLogo />
              Fazer login com o Google
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
