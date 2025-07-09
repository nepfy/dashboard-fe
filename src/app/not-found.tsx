import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="https://app.nepfy.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ir para o Dashboard
          </Link>

          <div>
            <Link
              href="https://app.nepfy.com/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
