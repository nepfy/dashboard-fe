"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Adjustment {
  id: string;
  type: string;
  description: string;
  created_at: Date;
}

interface ProposalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    title: string;
    message: string;
    actionUrl?: string | null;
    metadata: Record<string, unknown> | null;
  };
  adjustments?: Adjustment[];
}

const adjustmentTypeLabels: Record<string, string> = {
  change_values_or_plans: "Alterar valores ou planos",
  change_scope: "Alterar escopo",
  change_timeline: "Alterar prazo",
  other: "Outro",
};

export default function ProposalFeedbackModal({
  isOpen,
  onClose,
  notification,
  adjustments,
}: ProposalFeedbackModalProps) {
  // Use adjustments array if provided, otherwise use metadata
  const [currentAdjustmentIndex, setCurrentAdjustmentIndex] = useState(0);

  if (!isOpen) return null;

  const metadata = notification.metadata as {
    projectName?: string;
    projectId?: string;
    adjustmentType?: string;
    adjustmentDescription?: string;
  } | null;

  const adjustmentType = metadata?.adjustmentType;
  const adjustmentDescription = metadata?.adjustmentDescription;
  const projectId = metadata?.projectId;

  const hasMultipleAdjustments = adjustments && adjustments.length > 1;
  const currentAdjustment = adjustments?.[currentAdjustmentIndex];

  const displayType = currentAdjustment
    ? adjustmentTypeLabels[currentAdjustment.type] || currentAdjustment.type
    : adjustmentTypeLabels[
        adjustmentType as keyof typeof adjustmentTypeLabels
      ] || adjustmentType;

  const displayDescription = currentAdjustment
    ? currentAdjustment.description
    : adjustmentDescription;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-gray-100"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Ajuste solicitado pelo cliente
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Veja abaixo os ajustes solicitados. Revise cada um e envie uma nova
            versão da proposta atualizada.
          </p>

          {/* Pagination for multiple adjustments */}
          {hasMultipleAdjustments && (
            <div className="mt-4 flex items-center gap-2">
              {adjustments?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdjustmentIndex(index)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                    index === currentAdjustmentIndex
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Tipo de ajuste
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {displayType && typeof displayType === "string"
                    ? displayType
                    : "Não especificado"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Descrição
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {displayDescription && typeof displayDescription === "string"
                    ? displayDescription
                    : "Seria possível alterar o valor do plano essencial de R$2.000 para R$1.740 por mês?"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Essa é a etapa que costuma definir o fechamento, então vale revisar
            com cuidado e reenviar a versão atualizada o quanto antes.
          </p>

          <p className="text-sm text-gray-600">
            No painel, você encontra todos os detalhes do pedido e pode ajustar
            tudo em poucos minutos e reenviar a nova versão.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Fechar
          </button>
          {projectId && typeof projectId === "string" ? (
            <Link
              href={`/editar?projectId=${projectId}&templateType=flash`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              onClick={onClose}
            >
              Editar proposta
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
