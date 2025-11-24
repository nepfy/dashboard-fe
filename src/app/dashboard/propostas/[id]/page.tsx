"use client";

import { use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Calendar,
  Edit,
  LoaderCircle,
} from "lucide-react";
import { useProjectDetails } from "#/hooks/useProjectDetails";
import {
  formatValidityDate,
  formatVisualizationDate,
} from "#/helpers/formatDateAndTime";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const adjustmentTypeLabels: Record<string, string> = {
  change_values_or_plans: "Alterar valores ou planos",
  change_scope: "Alterar escopo",
  change_timeline: "Alterar prazo",
  other: "Outro",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviada",
  negotiation: "Negociação",
  approved: "Aprovada",
  rejected: "Recusada",
};

export default function ProposalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { project, adjustments, isLoading, error } = useProjectDetails(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Erro ao carregar proposta
          </h2>
          <p className="mt-2 text-red-700">
            {error || "Proposta não encontrada"}
          </p>
          <Link
            href="/dashboard/propostas"
            className="mt-4 inline-block text-sm font-medium text-red-900 hover:underline"
          >
            ← Voltar para propostas
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel =
    statusLabels[project.projectStatus] || project.projectStatus;
  const validityDate = project.projectValidUntil
    ? formatValidityDate(project.projectValidUntil.toString())
    : "Não definida";

  // Use projectSentDate if available, otherwise fallback to updated_at
  const sendDate = project.projectSentDate
    ? formatValidityDate(project.projectSentDate.toString())
    : project.updated_at
      ? formatValidityDate(project.updated_at.toString())
      : "Não enviada";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link
          href="/dashboard/propostas"
          className="transition-colors hover:text-gray-900"
        >
          Gerenciador de propostas
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{project.projectName}</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-light text-gray-900">
          Proposta <span className="font-semibold">{project.projectName}</span>
        </h1>
        <p className="font-light text-gray-600">{project.clientName}</p>
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Status Atual */}
        <div className="flex flex-col items-center justify-between gap-12 rounded-xl border border-gray-200 bg-white px-6 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <Clock className="h-6 w-6 text-gray-900" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-xs leading-[150%] font-medium tracking-normal text-gray-500 uppercase">
              STATUS ATUAL
            </p>
            <p className="text-center text-xl font-normal text-gray-900">
              {statusLabel}
            </p>
          </div>
        </div>

        {/* Validade */}
        <div className="flex flex-col items-center justify-between gap-12 rounded-xl border border-gray-200 bg-white px-6 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <Calendar className="h-6 w-6 text-gray-900" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-xs leading-[150%] font-medium tracking-normal text-gray-500 uppercase">
              VALIDADE
            </p>
            <p className="text-center text-xl font-normal text-gray-900">
              {validityDate}
            </p>
          </div>
        </div>

        {/* Data de Envio */}
        <div className="flex flex-col items-center justify-between gap-12 rounded-xl border border-gray-200 bg-white px-6 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <Calendar className="h-6 w-6 text-gray-900" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-xs leading-[150%] font-medium tracking-normal text-gray-500 uppercase">
              DATA DE ENVIO
            </p>
            <p className="text-center text-xl font-normal text-gray-900">
              {sendDate}
            </p>
          </div>
        </div>

        {/* Editar Proposta */}
        {project.projectStatus === "sent" ? (
          <div className="flex flex-col items-center justify-between gap-12 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 opacity-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
              <Edit className="h-6 w-6 text-gray-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-xl font-normal text-gray-500">
                Editar proposta
              </p>
            </div>
          </div>
        ) : (
          <Link
            href={`/dashboard/propostas/${id}/edit`}
            className="flex flex-col items-center justify-between gap-12 rounded-xl border border-gray-200 bg-white px-6 py-8 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <Edit className="h-6 w-6 text-gray-900" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-xl font-normal text-gray-900">
                Editar proposta
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Ajustes da proposta */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Ajustes da proposta
          </h2>
        </div>

        {adjustments.length > 0 ? (
          <div className="p-4">
            <table className="w-full table-fixed">
              <thead>
                <tr className="rounded-lg bg-gray-50">
                  <th className="w-[240px] rounded-l-lg px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500">
                    Data
                  </th>
                  <th className="w-[280px] px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500">
                    Tipo de ajuste
                  </th>
                  <th className="rounded-r-lg px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500">
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((adjustment, index) => (
                  <tr
                    key={adjustment.id}
                    className={`${
                      index !== adjustments.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="w-[140px] px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {formatVisualizationDate(
                        adjustment.created_at.toString()
                      )}
                    </td>
                    <td className="w-[280px] px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {adjustmentTypeLabels[adjustment.type] || adjustment.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {adjustment.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              Nenhum ajuste solicitado para esta proposta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
