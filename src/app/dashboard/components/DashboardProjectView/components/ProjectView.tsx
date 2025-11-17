"use client";

import Link from "next/link";

import { LoaderCircle } from "lucide-react";
import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";
import ErrorMessage from "#/components/ErrorMessage";

import FileIcon from "#/components/icons/FileIcon";
import PlusIcon from "#/components/icons/PlusIcon";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";

import { ProjectsDataProps } from "#/app/dashboard/propostas/components/ProjectsTable/types";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProjectViewProps {
  projectsData: ProjectsDataProps[];
  pagination: PaginationInfo;
  onPageChangeAction: (page: number) => void;
  error: string | null;
  isPaginationLoading: boolean;
  isDuplicating?: boolean;
  onBulkStatusUpdate?: (projectIds: string[], status: string) => Promise<void>;
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
  onBulkDuplicate?: (projectIds: string[]) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export default function ProjectsView({
  projectsData,
  pagination,
  onPageChangeAction,
  error,
  isPaginationLoading,
  isDuplicating,
  onBulkStatusUpdate,
  onStatusUpdate,
  onBulkDuplicate,
  onDelete,
  onRefresh,
}: ProjectViewProps) {
  if (error) {
    return (
      <div className="my-4">
        <ErrorMessage error={error} />{" "}
      </div>
    );
  }

  return (
    <div className="bg-white-neutral-light-100 rounded-2xs border-white-neutral-light-300 my-4 border">
      <div className="border-white-neutral-light-300 flex flex-wrap items-center justify-between gap-4 border-b p-6">
        <p className="text-white-neutral-light-900 flex items-center gap-1 font-medium">
          <FileIcon width="24" height="24" />
          Propostas
          <span
            className="border-white-neutral-light-300 bg-white-neutral-light-200 ml-1 rounded-4xl border px-2 py-1 text-[12px]"
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
          <Link href="/gerar-proposta">
            <div className="bg-primary-light-400 hover:bg-primary-light-500 border-primary-light-25 button-inner-inverse flex h-[36px] w-38 cursor-pointer items-center justify-center gap-1 rounded-[var(--radius-s)] border text-sm font-medium text-white">
              <PlusIcon fill="#FFFFFF" />
              Criar proposta
            </div>
          </Link>
          {/* <Link href="/gerar-proposta">
            <div className="flex items-center justify-center h-[36px] gap-1 text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-300 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse px-2">
              <PlusIcon fill="#FFFFFF" />
              Criar proposta com IA
            </div>
          </Link> */}

          <Link href="/dashboard/propostas">
            <div className="text-white-neutral-light-900 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 border-white-neutral-light-300 button-inner flex h-[36px] w-[100px] cursor-pointer items-center justify-center rounded-[var(--radius-s)] border text-sm font-medium">
              Ver todas
            </div>
          </Link>
        </div>
      </div>

      <div className="relative h-full">
        {isPaginationLoading && (
          <div className="bg-opacity-75 rounded-2xs absolute inset-0 z-10 flex items-center justify-center bg-white">
            <LoaderCircle className="text-primary-light-400 animate-spin" />
          </div>
        )}
        <ProjectsTable
          data={projectsData}
          onBulkStatusUpdate={onBulkStatusUpdate}
          onStatusUpdate={onStatusUpdate}
          isDuplicating={isDuplicating}
          onBulkDuplicate={onBulkDuplicate}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="border-t-white-neutral-light-300 flex items-center justify-between gap-2 border-t p-5 sm:p-6">
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={onPageChangeAction}
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
