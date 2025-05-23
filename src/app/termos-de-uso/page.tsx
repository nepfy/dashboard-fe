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
              Iremos enviar um link de validação para seu email para cadastro da
              nova senha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
