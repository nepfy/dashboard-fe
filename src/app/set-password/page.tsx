import Link from "next/link";
import GoogleLogo from "#/components/icons/GoogleLogo";
import Ilustration from "#/components/icons/Ilustration";
import Lock from "#/components/icons/Lock";
import MailEnvelope from "#/components/icons/MailEnvelope";

export default function Login() {
  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
        <div className="w-full max-w-[480px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center">
              Crie uma senha
            </h2>
            <p className="text-[var(--color-white-neutral-light-500)] text-center">
              Utilize no mínimo 8 letras, contendo ao menos 1 maiúscula, 1
              número e um caractere especial.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2 relative">
              <Lock
                className="absolute right-4 bottom-2"
                width="20"
                height="20"
              />
              <label
                htmlFor="password"
                className="text-[var(--color-white-neutral-light-700)] text-sm font-medium"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Crie uma senha"
                className="w-full px-4 py-3 mt-1.5 rounded-[var(--radius-s)] border border-[var(--color-white-neutral-light-300)] bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)]"
              />
            </div>

            <div className="space-y-2 relative">
              <Lock
                className="absolute right-4 bottom-2"
                width="20"
                height="20"
              />
              <label
                htmlFor="password"
                className="text-[var(--color-white-neutral-light-700)] text-sm font-medium"
              >
                Confirmar senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Repita a senha"
                className="w-full px-4 py-3 mt-1.5 rounded-[var(--radius-s)] border border-[var(--color-white-neutral-light-300)] bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)]"
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
