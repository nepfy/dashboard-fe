import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - Nepfy",
  description: "Painel administrativo para gerenciar agentes de IA",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Nepfy
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/admin/agents"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Agentes
              </Link>
              <Link
                href="/admin/templates/config"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Templates
              </Link>
              <Link
                href="/admin/analytics"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
