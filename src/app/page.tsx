"use client";

import { useState } from "react";
import Link from "next/link";
import GoogleLogo from "#/components/icons/GoogleLogo";
import Ilustration from "#/components/icons/Ilustration";
import Lock from "#/components/icons/Lock";
import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField, CheckboxInput } from "#/components/Inputs";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="grid xl:grid-cols-2 w-full min-h-screen">
        <div className="hidden xl:block bg-[var(--color-primary-light-400)] sm:flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-[80%]">
              <div className="w-full aspect-[622/714] relative">
                <Ilustration className="w-full h-full" />
                <div className="absolute sm:bottom-0 lg:bottom-2xl xl:bottom-9xl left-0 right-0 space-y-2">
                  <h2 className="text-[32px] font-medium text-[var(--color-white-neutral-light-200)] text-center">
                    Gere propostas
                  </h2>
                  <p className="text-[var(--color-primary-light-200)] text-center max-w-72 mx-auto">
                    Prepare uma proposta visualmente cativante e bem
                    estruturada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
          <div className="w-full max-w-[480px] space-y-8">
            <div className="space-y-2">
              <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center">
                Entrar
              </h2>
              <p className="text-[var(--color-white-neutral-light-500)] text-center">
                Acesse sua conta nepfy!
              </p>
            </div>

            <form className="space-y-6">
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
                <Lock
                  className="absolute right-4 bottom-2"
                  width="20"
                  height="20"
                />
                <TextField
                  label="Senha"
                  inputName="password"
                  id="password"
                  type="password"
                  placeholder="Adicione sua senha"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
