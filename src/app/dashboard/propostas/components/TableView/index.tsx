import { useState } from "react";

import ProjectsTable from "#/app/dashboard/propostas/components/ProjectsTable";
import { TableRow } from "#/app/dashboard/propostas/components/ProjectsTable/types";

import Pagination from "#/components/Pagination";
import PageCounter from "#/components/PageCounter";

const data: TableRow[] = [
  {
    id: "1",
    cliente: "Empresa ABC",
    projeto: "Website Redesign",
    visualizado: "10/05/2025",
    validade: "20/06/2025",
    status: "active",
  },
  {
    id: "2",
    cliente: "Indústrias XYZ",
    projeto: "Mobile App",
    visualizado: "05/05/2025",
    validade: "15/05/2025",
    status: "approved",
  },
  {
    id: "3",
    cliente: "Serviços 123",
    projeto: "E-commerce",
    visualizado: "01/05/2025",
    validade: "01/05/2025",
    status: "negotiation",
  },
  {
    id: "4",
    cliente: "Tech Solutions",
    projeto: "CRM Integration",
    visualizado: "15/04/2025",
    validade: "30/04/2025",
    status: "draft",
  },
  {
    id: "5",
    cliente: "Tech Solutions",
    projeto: "CRM Integration",
    visualizado: "15/04/2025",
    validade: "30/04/2025",
    status: "expired",
  },
  {
    id: "6",
    cliente: "Tech Solutions",
    projeto: "CRM Integration",
    visualizado: "15/04/2025",
    validade: "30/04/2025",
    status: "rejected",
  },
];

export default function TableView() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="w-full animate-fadeIn p-3">
      <div className="rounded-2xs border border-white-neutral-light-300">
        <ProjectsTable data={data} />

        <div className="p-3 border-t border-t-white-neutral-light-300 flex items-center justify-between bg-white-neutral-light-100 rounded-2xs">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <PageCounter currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
