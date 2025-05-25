"use client";

import { useState } from "react";

import Header from "./components/Header";
import TableView from "./components/TableView";
import KanbanView from "./components/KanbanView";

export default function Projects() {
  const [tab, setTab] = useState("table");
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");

  return (
    <div className="relative w-full">
      <Header
        tab={tab}
        setTab={setTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="relative">
        {tab === "table" && <TableView viewMode={viewMode} />}
        {tab === "kanban" && <KanbanView />}
      </div>
    </div>
  );
}
