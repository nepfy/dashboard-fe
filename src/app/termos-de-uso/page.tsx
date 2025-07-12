import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
        <div className="w-full max-w-[480px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center">
              Termos de uso
            </h2>
            <p className="text-[var(--color-white-neutral-light-500)] text-center">
              Em desenvolvimento
            </p>
          </div>

          {/* Back to Login Link */}
          <div className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-[var(--color-primary-light-400)] hover:text-[var(--color-primary-light-500)] hover:underline transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
