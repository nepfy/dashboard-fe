import { CopyLinkCacheProvider } from "#/contexts/CopyLinkCacheContext";
import Link from "next/link";
import { X } from "lucide-react";
import Logo from "#/components/icons/Logo";
import { ProjectGeneratorProvider } from "#/contexts/ProjectGeneratorContext";

function AIHeader() {
  return (
    <header className="flex items-center justify-between px-8 h-20 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center">
          <Logo fill="#1C1A22" />
        </Link>
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
          <span className="text-black text-sm font-medium">
            Gerador de Propostas
          </span>
        </div>
      </div>
      <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
        <X className="w-4 h-4 text-black" />
      </button>
    </header>
  );
}

export default function NepfyAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectGeneratorProvider>
      <CopyLinkCacheProvider>
        <div className="min-h-screen bg-gray-50">
          <AIHeader />
          <main className="flex-1 pt-20">{children}</main>
        </div>
      </CopyLinkCacheProvider>
    </ProjectGeneratorProvider>
  );
}
