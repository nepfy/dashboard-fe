"use client";

import { useState } from "react";

import Header from "./components/Header";
import TableView from "./components/TableView";
import KanbanView from "./components/KanbanView";

export default function Proposals() {
  const [tab, setTab] = useState("table");

  return (
    <div className="relative w-full">
      <Header tab={tab} setTab={setTab} />

      <div className="relative">
        {tab === "table" && <TableView />}
        {tab === "kanban" && <KanbanView />}
      </div>
    </div>
  );
}
