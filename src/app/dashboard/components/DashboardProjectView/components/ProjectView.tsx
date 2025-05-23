"use client";

import Link from "next/link";

import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";
import ErrorMessage from "#/components/ErrorMessage";

import FileIcon from "#/components/icons/FileIcon";
import PlusIcon from "#/components/icons/PlusIcon";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";
import { useProjects } from "#/hooks/useProjects";

export default function ProjectsView() {
  const { projectsData, pagination, isLoading, error, setCurrentPage } =
    useProjects(1, 10);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="bg-white-neutral-light-100 rounded-2xs border border-white-neutral-light-300 my-4">
      <div className="border-b border-white-neutral-light-300 p-6 flex items-center justify-between flex-wrap gap-4">
        <p className="font-medium text-white-neutral-light-900 flex items-center gap-1">
          <FileIcon width="24" height="24" />
          Propostas
          <span
            className="px-2 py-1 border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-4xl text-[12px] ml-1"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          >
            {pagination?.totalCount || 0}
          </span>
        </p>

        <div className="flex flex-wrap items-start gap-2">
          <Link href="/gerador-de-propostas">
            <div className="flex items-center justify-center w-38 h-[36px] gap-1 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse">
              <PlusIcon fill="#FFFFFF" />
              Criar proposta
            </div>
          </Link>

          <Link href="/dashboard/propostas">
            <div className="w-[100px] h-[36px] flex items-center justify-center text-white-neutral-light-900 text-sm font-medium rounded-[var(--radius-s)] cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-400 border border-white-neutral-light-300 button-inner">
              Ver todas
            </div>
          </Link>
        </div>
      </div>

      <ProjectsTable isLoading={isLoading} data={projectsData} />

      {pagination && pagination.totalPages > 1 && (
        <div className="p-6 border-t border-t-white-neutral-light-300 flex items-center justify-between">
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={setCurrentPage}
          />
          <PageCounter
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        </div>
      )}
    </div>
  );
}
