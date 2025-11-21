"use client";

import { useState } from "react";
import AcceptProposalModal from "./AcceptProposalModal";
import RequestAdjustmentModal from "./RequestAdjustmentModal";
import type { TemplateData } from "#/types/template-data";

interface ProposalActionsProps {
  projectData: TemplateData;
}

export default function ProposalActions({ projectData }: ProposalActionsProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show actions if proposal is already accepted or rejected
  const shouldShowActions = !["approved", "rejected"].includes(
    projectData.projectStatus || ""
  );

  if (!shouldShowActions) {
    return null;
  }

  return (
    <>
      {/* Fixed Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        style={{ 
          backgroundColor: "white",
          borderTopColor: "#e5e7eb"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Info text */}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                Gostou da proposta?
              </p>
              <p className="text-xs text-gray-500">
                Aceite para iniciar o projeto ou solicite ajustes
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowAdjustmentModal(true)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: "#d1d5db",
                  color: "#374151"
                }}
              >
                Solicitar ajuste
              </button>
              
              <button
                onClick={() => setShowAcceptModal(true)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: projectData.mainColor || "#6366f1"
                }}
              >
                Aceitar proposta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AcceptProposalModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        projectData={projectData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />

      <RequestAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        projectData={projectData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </>
  );
}

