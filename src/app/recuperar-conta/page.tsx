"use client";

import { useState } from "react";
import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField } from "#/components/Inputs";

export default function AccountRecovery() {
  const [emailAddress, setEmailAddress] = useState("");
  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
        <div className="w-full max-w-[480px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center">
              Recuperar senha
            </h2>
            <p className="text-[var(--color-white-neutral-light-500)] text-center">
              Iremos enviar um link de validação para seu email para cadastro da
              nova senha.
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
                label="Insira seu email"
                inputName="email"
                id="email"
                type="email"
                placeholder="exemplo@seudominio.com"
                onChange={(e) => setEmailAddress(e.target.value)}
                value={emailAddress}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors mt-4 h-[54px]"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
