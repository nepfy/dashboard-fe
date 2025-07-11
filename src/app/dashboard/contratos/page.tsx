import Stars from "#/components/icons/Stars";

export default function Contracts() {
  return (
    <>
      <h2 className="px-7 py-5 border-b border-b-white-neutral-light-300 w-full font-semibold text-2xl">
        Contratos
      </h2>

      <div className="p-7">
        <div className="my-4 rounded-2xl bg-primary-light-300 w-full max-w-[700px] min-h-[220px] max-h-[400px] p-6 flex flex-col justify-between gap-4 relative">
          <p className="text-white-neutral-light-100 text-2xl font-bold max-w-[390px] z-40">
            Novas funcionalidades chegando em breve!
          </p>

          <p className="text-white-neutral-light-100 font-medium max-w-[380px]">
            Estamos preparando opções incríveis para facilitar ainda mais o seu
            dia a dia. Fique de olho!
          </p>

          <Stars className="absolute top-0 right-0" />
        </div>
      </div>
    </>
  );
}
