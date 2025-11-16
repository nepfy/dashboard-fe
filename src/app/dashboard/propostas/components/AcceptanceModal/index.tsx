"use client";

import React from "react";
import Modal from "#/components/Modal";

interface AcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  chosenPlan?: string;
  chosenPlanValue?: string;
  acceptedBy?: string;
}

export default function AcceptanceModal({
  isOpen,
  onClose,
  chosenPlan,
  chosenPlanValue,
  acceptedBy,
}: AcceptanceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proposta aceita pelo cliente! 🎉"
      showCloseButton={true}
      width="520px"
      footer={false}
    >
      <div className="px-6 pb-6">
        <p className="text-white-neutral-light-900 text-sm mb-6">
          O cliente aceitou a proposta! Agora é hora de seguir com o próximo passo
          do projeto.
        </p>

        {/* Acceptance Details */}
        <div className="space-y-4 mb-6">
          {chosenPlan && (
            <div>
              <label className="text-white-neutral-light-900 text-sm font-semibold mb-2 block">
                Plano escolhido
              </label>
              <div className="bg-primary-light-50 border border-primary-light-200 rounded-lg px-4 py-3 text-sm text-white-neutral-light-900">
                {chosenPlan}
                {chosenPlanValue && ` • ${chosenPlanValue}`}
              </div>
            </div>
          )}

          {acceptedBy && (
            <div>
              <label className="text-white-neutral-light-900 text-sm font-semibold mb-2 block">
                Responsável pela aceitação
              </label>
              <div className="bg-primary-light-50 border border-primary-light-200 rounded-lg px-4 py-3 text-sm text-white-neutral-light-900">
                {acceptedBy}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-4 border-t border-white-neutral-light-300">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-light-400 text-white text-sm font-medium hover:bg-primary-light-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

