"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProposalAcceptance {
  chosenPlan?: string;
  chosenPlanValue?: string;
  acceptedBy?: string;
  clientName?: string;
}

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
  const [acceptance, setAcceptance] = useState<ProposalAcceptance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptanceData = async () => {
      const metadata = notification.metadata as {
        projectId?: string;
        clientName?: string;
      } | null;

      const projectId = metadata?.projectId;

      if (!projectId || !isOpen) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${projectId}/acceptance`);
        if (response.ok) {
          const data = await response.json();
          setAcceptance(data.acceptance);
        }
      } catch (error) {
        console.error("Error fetching acceptance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchAcceptanceData();
    }
  }, [isOpen, notification.metadata]);

  if (!isOpen) return null;

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
        <div className="mb-6 pr-8">
          <h2 className="text-xl font-semibold text-indigo-600">
            Proposta aceita pelo cliente! 🎉
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            O cliente aceitou a proposta! Agora é hora de seguir com o próximo
            passo do projeto.
          </p>
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="rounded-lg bg-indigo-50 px-5 py-3.5">
                <p className="text-sm font-medium text-gray-900">
                  Plano escolhido
                </p>
              </div>
              <div className="mt-2 rounded-lg border border-gray-200 bg-white px-5 py-3.5">
                <p className="text-sm text-gray-900">
                  {acceptance?.chosenPlan || "Não especificado"}
                  {acceptance?.chosenPlanValue &&
                    ` • ${acceptance.chosenPlanValue}`}
                </p>
              </div>
            </div>

            {acceptance?.acceptedBy && (
              <div>
                <div className="rounded-lg bg-indigo-50 px-5 py-3.5">
                  <p className="text-sm font-medium text-gray-900">
                    Responsável pela aceitação
                  </p>
                </div>
                <div className="mt-2 rounded-lg border border-gray-200 bg-white px-5 py-3.5">
                  <p className="text-sm text-gray-900">
                    {acceptance.acceptedBy}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

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
        </div>
      </div>
    </div>
  );
}
