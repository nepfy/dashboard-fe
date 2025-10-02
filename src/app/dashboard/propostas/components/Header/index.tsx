import Link from "next/link";

import DashboardPageHeader from "#/components/DashboardPageHeader";
import PlusIcon from "#/components/icons/PlusIcon";
import Archive from "#/components/icons/Archive";
// import ColumnIcon from "#/components/icons/ColumnIcon";

interface HeaderProps {
  tab: string;
  setTab: (tab: string) => void;
  viewMode: "active" | "archived";
  setViewMode: (mode: "active" | "archived") => void;
}

export default function Header({
  // tab,
  // setTab,
  viewMode,
  setViewMode,
}: HeaderProps) {
  const handleArchiveToggle = () => {
    setViewMode(viewMode === "active" ? "archived" : "active");
  };

  const getArchiveButtonText = () => {
    return viewMode === "active"
      ? "Propostas arquivadas"
      : "Voltar às propostas";
  };

  const getArchiveButtonIcon = () => {
    return viewMode === "active" ? (
      <Archive width="20px" height="20px" />
    ) : (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    );
  };

  return (
    <DashboardPageHeader
      title={viewMode === "active" ? "Propostas" : "Propostas Arquivadas"}
    >
      <div className="flex flex-wrap items-start">
        <div className="flex flex-row flex-wrap w-full gap-1 items-start sm:items-center">
          {viewMode === "active" && (
            <Link href="/gerar-proposta" className="w-full sm:w-40">
              <div className="flex items-center justify-center w-full sm:w-40 h-11 gap-1 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse">
                <PlusIcon fill="#FFFFFF" />
                Criar proposta
              </div>
            </Link>
          )}

          {/* <Link
            href="/gerar-proposta"
            className="flex items-center justify-center h-11 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse px-4 gap-2"
          >
            <BrainIcon size={20} />
            <span className="hidden sm:block">Gerar proposta com AI</span>
          </Link> */}
          <button
            onClick={handleArchiveToggle}
            className="hidden sm:flex items-center justify-center w-11 h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer sm:w-52 border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner bg-white-neutral-light-100"
          >
            {getArchiveButtonIcon()}
            <span className="hidden sm:block">{getArchiveButtonText()}</span>
          </button>

          <div className="flex sm:hidden items-center justify-between w-full mt-2">
            <div className="flex items-center justify-center w-full">
              {/* <button
                onClick={handleArchiveToggle}
                className="flex items-center justify-center w-11 h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner bg-white-neutral-light-100"
              >
                {getArchiveButtonIcon()}
              </button> */}

              <button
                onClick={handleArchiveToggle}
                className="flex items-center justify-center w-full h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer border-white-neutral-light-300 hover:bg-white-neutral-light-200 button-inner bg-white-neutral-light-100"
              >
                {getArchiveButtonIcon()}
                <span className="block">{getArchiveButtonText()}</span>
              </button>
            </div>

            {/* <div className="flex items-center justify-center w-[86px] h-[46px] border border-white-neutral-light-300 rounded-2xl">
              <button
                onClick={() => setTab("table")}
                className={`flex items-center justify-center 
                w-10 h-10 rounded-[var(--radius-s)] cursor-pointer
              hover:bg-white-neutral-light-200 
                transition duration-300 ease-in-out
                active:transform
                ${
                  tab === "table"
                    ? "bg-white-neutral-light-100 e0 text-primary-light-500"
                    : "bg-transparent"
                }
                `}
              >
                <ColumnIcon
                  width="24"
                  height="24"
                  fill={tab === "table" ? "#5B32F4" : "#23232C"}
                />
              </button>

              <button
                onClick={() => setTab("kanban")}
                className={`flex items-center justify-center 
                  w-10 h-10 rounded-[var(--radius-s)] cursor-pointer
                hover:bg-white-neutral-light-200 
                  transition duration-300 ease-in-out
                  active:transform rotate-90
                  ${
                    tab === "kanban"
                      ? "bg-white-neutral-light-100 e0 text-primary-light-500"
                      : "bg-transparent"
                  }
                  `}
              >
                <ColumnIcon
                  width="24"
                  height="24"
                  fill={tab === "kanban" ? "#5B32F4" : "#23232C"}
                />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </DashboardPageHeader>
  );
}
