import Link from "next/link";

import DashboardPageHeader from "#/components/DashboardPageHeader";
import PlusIcon from "#/components/icons/PlusIcon";
import Archive from "#/components/icons/Archive";
import FiltersIcon from "#/components/icons/FiltersIcon";
import ColumnIcon from "#/components/icons/ColumnIcon";

export default function Header({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: string) => void;
}) {
  return (
    <DashboardPageHeader title="Propostas">
      <div className="flex flex-wrap items-start">
        <div className="flex flex-row flex-wrap w-full gap-1 items-start sm:items-center">
          <Link href="/gerador-de-propostas">
            <div className="flex items-center justify-center w-40 h-11 gap-1 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse">
              <PlusIcon fill="#FFFFFF" />
              Criar proposta
            </div>
          </Link>

          <button className="hidden sm:flex items-center justify-center w-11 h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer sm:w-52 border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner">
            <Archive width="20px" height="20px" />
            <span className="hidden sm:block">Propostas arquivadas</span>
          </button>

          <div className="hidden sm:flex flex-wrap justify-end items-center grow gap-2">
            <button className="flex items-center justify-center w-11 h-[46px] text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner">
              <FiltersIcon width="20px" height="20px" />
            </button>
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
          <div className="flex sm:hidden items-center justify-between w-full mt-2">
            <div className="flex items-center justify-center gap-1">
              <button className="flex items-center justify-center w-11 h-[46px] gap-1 text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner">
                <Archive width="20px" height="20px" />
              </button>
              <button className="flex items-center justify-center w-11 h-[46px] text-sm font-medium border rounded-[var(--radius-s)] cursor-pointer border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 button-inner">
                <FiltersIcon width="20px" height="20px" />
              </button>
            </div>

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
    </DashboardPageHeader>
  );
}
