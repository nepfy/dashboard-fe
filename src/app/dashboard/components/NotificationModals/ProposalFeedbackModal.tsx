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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="pr-8 text-xl font-semibold text-gray-900">
            Ajuste solicitado pelo cliente
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Veja abaixo os ajustes solicitados. Revise cada um e envie uma nova
            versão da proposta atualizada.
          </p>

          {/* Pagination for multiple adjustments */}
          {hasMultipleAdjustments && (
            <div className="mt-5 flex items-center gap-2">
              {adjustments?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdjustmentIndex(index)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                    index === currentAdjustmentIndex
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-300 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <div className="rounded-lg bg-indigo-50 px-5 py-3.5">
              <p className="text-sm font-medium text-gray-900">
                Tipo de ajuste
              </p>
            </div>
            <div className="mt-2 rounded-lg border border-gray-200 bg-white px-5 py-3.5">
              <p className="text-sm text-gray-900">
                {displayType && typeof displayType === "string"
                  ? displayType
                  : "Não especificado"}
              </p>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-indigo-50 px-5 py-3.5">
              <p className="text-sm font-medium text-gray-900">Descrição</p>
            </div>
            <div className="mt-2 rounded-lg border border-gray-200 bg-white px-5 py-3.5">
              <p className="text-sm leading-relaxed text-gray-900">
                {displayDescription && typeof displayDescription === "string"
                  ? displayDescription
                  : "Seria possível alterar o valor do plano essencial de R$2.000 para R$1.740 por mês?"}
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Footer */}
        <div className="flex flex-row gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Fechar
          </button>
          {projectId && typeof projectId === "string" ? (
            <Link
              href={`/editar?projectId=${projectId}&templateType=flash`}
              className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
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
