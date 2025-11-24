"use client";

import { useState, useCallback } from "react";

import TableView from "./components/TableView";
import KanbanView from "./components/KanbanView";
import Header from "./components/Header";
import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";

import { ProposalModuleHeader } from "./components/ProposalModuleHeader";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function Projects() {
  const [tab, setTab] = useState("table");
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const [proposalsCount, setProposalsCount] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );
  const [onPageChangeCallback, setOnPageChangeCallback] = useState<
    ((page: number) => void) | null
  >(null);

  const handleCountUpdate = useCallback((count: number) => {
    setProposalsCount(count);
  }, []);

  const handlePaginationUpdate = useCallback(
    (info: PaginationInfo | null, callback?: (page: number) => void) => {
      setPaginationInfo(info);
      if (callback) {
        setOnPageChangeCallback(() => callback);
      }
    },
    []
  );

  return (
    <div className="relative w-full bg-gray-50">
      <div className="relative px-6 py-6">
        <ProposalModuleHeader />

        {/* Card container único para Header + Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Header
            tab={tab}
            setTab={setTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            proposalsCount={proposalsCount}
          />

          {tab === "table" && (
            <TableView
              viewMode={viewMode}
              onCountUpdate={handleCountUpdate}
              onPaginationUpdate={handlePaginationUpdate}
              setViewMode={setViewMode}
            />
          )}
          {tab === "kanban" && <KanbanView />}
        </div>

        {/* Paginação fora do card */}
        {paginationInfo && (
          <div className="mt-4 flex items-center justify-between px-2">
            <Pagination
              totalPages={paginationInfo.totalPages}
              currentPage={paginationInfo.currentPage}
              onPageChange={
                onPageChangeCallback || ((page) => console.log("Page:", page))
              }
            />
            <PageCounter
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
