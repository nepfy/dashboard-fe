"use client";

export default function Error({
  error,
  resetAction,
}: {
  error: Error & { digest?: string };
  resetAction: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erro</h1>
        <p className="text-gray-600 mb-4">
          Ocorreu um erro ao carregar a proposta.
        </p>
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
            Detalhes do erro
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetAction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
