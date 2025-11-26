import Link from "next/link";

interface HeaderProps {
  tab: string;
  setTab: (tab: string) => void;
  viewMode: "active" | "archived";
  setViewMode: (mode: "active" | "archived") => void;
  proposalsCount?: number;
}

export default function Header({
  // tab,
  // setTab,
  viewMode,
  setViewMode,
  proposalsCount = 0,
}: HeaderProps) {
  const handleArchiveToggle = () => {
    setViewMode(viewMode === "active" ? "archived" : "active");
  };

  const getArchiveButtonText = () => {
    return viewMode === "active"
      ? "Propostas arquivadas"
      : "Voltar às propostas";
  };

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      {/* Left: Folder + Count */}
      <div className="flex items-center gap-2.5">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-900 sm:h-5 sm:w-5"
        >
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
        </svg>
        <span className="text-sm font-medium text-gray-900">Propostas</span>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-gray-100 px-2 text-xs font-medium text-gray-600">
          {proposalsCount}
        </span>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Filter Button */}
        <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
          </svg>
        </button>

        {/* Create Proposal Button */}
        {viewMode === "active" && (
          <Link href="/gerar-proposta">
            <button className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:px-3.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="hidden sm:inline">Criar proposta</span>
              <span className="inline sm:hidden">Criar</span>
            </button>
          </Link>
        )}

        {/* Archive Toggle Button */}
        <button
          onClick={handleArchiveToggle}
          className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-3.5"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-gray-600"
          >
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z" />
          </svg>
          <span className="hidden sm:inline">{getArchiveButtonText()}</span>
          <span className="inline sm:hidden">
            {viewMode === "active" ? "Arquivadas" : "Voltar"}
          </span>
        </button>
      </div>
    </div>
  );
}
