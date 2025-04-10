"use client";

import { useState } from "react";
import Link from "next/link";
import GoogleLogo from "#/components/icons/GoogleLogo";
import PasswordInput from "#/components/Inputs/PasswordInput";
import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField, CheckboxInput } from "#/components/Inputs";
import IntroSlider from "#/components/IntroSlider";
import FormHeader from "#/app/onboarding/components/FormHeader";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

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
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="grid xl:grid-cols-2 w-full min-h-screen">
        <IntroSlider
          title="Gere propostas"
          description="Prepare uma proposta visualmente cativante e bem estruturada."
        />

        <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
          <div className="w-full max-w-[480px] space-y-8">
            <FormHeader title="Entrar" description="Acesse sua conta Nepfy!" />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 relative">
                <MailEnvelope
                  className="absolute right-4 bottom-2"
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
                className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors mt-4 h-[54px]"
              >
                Faça login na conta
              </button>
            </form>

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
              className="w-full py-3 px-4 bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] rounded-[var(--radius-s)] font-medium border border-[var(--color-white-neutral-light-300)] hover:bg-[var(--color-white-neutral-light-200)] transition-colors flex items-center justify-center gap-2 mt-4 h-[54px]"
            >
              <GoogleLogo />
              Continuar com o Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
