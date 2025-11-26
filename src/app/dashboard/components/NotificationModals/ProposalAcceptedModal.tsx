"use client";

import { X } from "lucide-react";

interface ProposalAcceptedModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    title: string;
    message: string;
    metadata: Record<string, unknown> | null;
  };
}

export default function ProposalAcceptedModal({
  isOpen,
  onClose,
  notification,
}: ProposalAcceptedModalProps) {
  if (!isOpen) return null;

  const chosenPlan = notification.metadata?.chosenPlan;
  const chosenPlanValue = notification.metadata?.chosenPlanValue;
  const acceptedBy = notification.metadata?.acceptedBy || notification.metadata?.clientName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl">
            🎉
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Proposta aceita pelo cliente!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              O cliente aceitou a proposta! Agora é hora de seguir com o próximo passo do projeto.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Plano escolhido
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {chosenPlan || "Não especificado"}
                </p>
              </div>

              {chosenPlanValue && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Valor
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {chosenPlanValue}
                  </p>
                </div>
              )}

              {acceptedBy && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Responsável pela aceitação
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {acceptedBy}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            No painel, você encontra o histórico completo da negociação e todas as informações
            importantes para continuar o processo com segurança.
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
        </div>
      </div>
    </div>
  );
}

