import { LoaderCircle } from "lucide-react";
import { Box } from "../box/Box";

interface ErrorProps {
  error: { message: string; details: string };
  handleRetry: () => void;
  handleExit: () => void;
  isLoading: boolean;
}

export function Error({
  error,
  handleRetry,
  handleExit,
  isLoading,
}: ErrorProps) {
  return (
    <Box
      title="Erro ao gerar proposta"
      description="Ocorreu um erro ao gerar sua proposta."
    >
      <p className="font-medium text-red-500">
        {error.message || "Erro desconhecido"}.
        <span className="block">
          {error.details || "Detalhes desconhecidos"}.
        </span>
        <span className="text-white-neutral-light-800 mt-4 mb-8 block font-normal">
          Por favor, tente novamente. Se o problema persistir, entre em contato
          com o suporte e informe o erro acima.
        </span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExit}
          className="button-inner border-white-neutral-light-300 text-white-neutral-light-900 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 group flex w-auto cursor-pointer items-center justify-start gap-2 rounded-[10px] border px-6 py-3 transition-all duration-200 hover:text-gray-800"
        >
          Sair
        </button>
        <button
          className={`flex w-[180px] transform items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          onClick={handleRetry}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            "Tentar novamente"
          )}
        </button>
      </div>
    </Box>
  );
}
