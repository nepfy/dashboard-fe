import Link from "next/link";

import PlusIcon from "#/components/icons/PlusIcon";
import Archive from "#/components/icons/Archive";
import ColumnIcon from "#/components/icons/ColumnIcon";

export default function Header({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: string) => void;
}) {
  return (
    <header className="w-full p-7 border-b border-white-neutral-light-300">
      <h3 className="mb-4 text-2xl font-medium text-white-neutral-light-900">
        Propostas
      </h3>

      <div className="flex flex-wrap items-start">
        <div className="flex flex-row flex-wrap w-full gap-1 items-start sm:items-center">
          <Link href="/gerador-de-propostas">
            <button className="flex items-center justify-center w-40 h-11 gap-1 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse">
              <PlusIcon fill="#FFFFFF" />
              Criar proposta
            </button>
          </Link>

          <button className="flex items-center justify-center w-11 h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer sm:w-52 border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner">
            <Archive width="20px" height="20px" />
            <span className="hidden sm:block">Propostas arquivadas</span>
          </button>

          <div className="flex justify-end items-center grow">
            <div className="flex items-center justify-center w-[86px] h-[46px] border border-white-neutral-light-300 rounded-2xl">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
