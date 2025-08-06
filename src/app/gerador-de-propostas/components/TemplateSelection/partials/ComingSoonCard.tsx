import { Stars } from "lucide-react";

export const ComingSoonCard = () => (
  <div className="rounded-2xs bg-primary-light-300 w-[700px] h-[170px] p-6 flex flex-col justify-between gap-4 relative mb-1">
    <p className="text-white-neutral-light-100 text-2xl font-bold max-w-[420px]">
      Novos templates chegando em breve!
    </p>
    <p className="text-white-neutral-light-100 text-sm font-medium max-w-[450px]">
      Estamos preparando opções incríveis pra você personalizar ainda mais suas
      propostas e encantar seus clientes.
    </p>
    <Stars className="absolute top-0 right-0" />
  </div>
);
