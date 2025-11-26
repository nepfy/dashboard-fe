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

  const metadata = notification.metadata as {
    chosenPlan?: string;
    chosenPlanValue?: string;
    acceptedBy?: string;
    clientName?: string;
  } | null;

  const chosenPlan = metadata?.chosenPlan;
  const chosenPlanValue = metadata?.chosenPlanValue;
  const acceptedBy = metadata?.acceptedBy || metadata?.clientName;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-4 shadow-xl sm:p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-gray-100"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-start gap-3 pr-8 sm:mb-6 sm:gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xl sm:h-12 sm:w-12 sm:text-2xl">
            🎉
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Proposta aceita pelo cliente!
            </h2>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              O cliente aceitou a proposta! Agora é hora de seguir com o próximo
              passo do projeto.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Plano escolhido
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {String(chosenPlan || "Não especificado")}
                </p>
              </div>

              {chosenPlanValue && (
                <div>
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Valor
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {String(chosenPlanValue)}
                  </p>
                </div>
              )}

              {acceptedBy && (
                <div>
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Responsável pela aceitação
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {String(acceptedBy)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            No painel, você encontra o histórico completo da negociação e todas
            as informações importantes para continuar o processo com segurança.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-3 sm:mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
