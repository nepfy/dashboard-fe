import { ProjectsDataProps } from "./types";

export const getStatusBadge = (status: ProjectsDataProps["projectStatus"]) => {
  switch (status) {
    case "draft":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
          <span className="text-sm font-medium text-gray-700">Rascunho</span>
        </span>
      );
    case "active":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5">
          <span className="text-sm font-medium text-indigo-700">Enviada</span>
        </span>
      );
    case "negotiation":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-sm font-medium text-orange-700">Negociação</span>
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">Aprovada</span>
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5">
          <span className="text-sm font-medium text-red-700">Recusada</span>
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
          <span className="text-sm font-medium text-gray-600">Expirada</span>
        </span>
      );
    case "archived":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1.5">
          <span className="text-sm font-medium text-gray-700">Arquivada</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
          <span className="text-sm font-medium text-gray-700">{status}</span>
        </span>
      );
  }
};
