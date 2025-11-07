export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Página não encontrada
          </h2>
          <p className="mb-8 text-gray-600">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    </div>
  );
}
