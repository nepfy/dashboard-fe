"use client";

import { useState, useEffect } from "react";
import AcceptProposalModal from "./AcceptProposalModal";
import RequestAdjustmentModal from "./RequestAdjustmentModal";
import type { TemplateData } from "#/types/template-data";

interface ProposalActionsProps {
  projectData: TemplateData;
  isEditing?: boolean;
}

export default function ProposalActions({
  projectData,
  isEditing,
}: ProposalActionsProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // Don't show actions if proposal is already accepted or rejected
  const shouldShowActions = !["approved", "rejected"].includes(
    projectData.projectStatus || ""
  );

  // Listen for scroll messages and plan selection from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "TEMPLATE_SCROLL_EVENT") {
        const scrollY = event.data.scrollY || 0;

        // Detectar direção do scroll
        const scrollDifference = scrollY - lastScrollY;
        const isScrollingUpNow = scrollDifference < 0;
        const scrollDistance = Math.abs(scrollDifference);

        // Mostrar barra quando scroll > 100px e não está scrollando para cima
        if (scrollY > 100 && !isScrollingUpNow) {
          setHasScrolled(true);
          setIsScrollingUp(false);
        }

        // Esconder barra quando scrollar para cima uma distância considerável (mais de 150px)
        if (isScrollingUpNow && scrollDistance > 150) {
          setIsScrollingUp(true);
          // Esconder completamente se scrollar muito para cima
          if (scrollY < 200) {
            setHasScrolled(false);
          }
        }

        setLastScrollY(scrollY);
      }

      // Listen for plan selection from iframe
      if (event.data && event.data.type === "PLAN_SELECTED") {
        const planId = event.data.planId;
        console.log("Plan selected from iframe:", planId);
        setSelectedPlanId(planId);
        setShowAcceptModal(true);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [lastScrollY]);

  if (!shouldShowActions) {
    return null;
  }

  return !isEditing ? (
    <>
      {/* Fixed Action Bar */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg transition-transform duration-300 ${
          hasScrolled && !isScrollingUp ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          backgroundColor: "white",
          borderTopColor: "#e5e7eb",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4">
          {/* Action Buttons */}

          <button
            onClick={() => !isEditing && setShowAdjustmentModal(true)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            style={{
              borderColor: "#d1d5db",
              color: "#374151",
            }}
          >
            Solicitar ajuste
          </button>

          <button
            onClick={() => !isEditing && setShowAcceptModal(true)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            style={{
              backgroundColor: projectData.mainColor || "#6366f1",
            }}
          >
            Aceitar proposta
          </button>
        </div>
      </div>

      {/* Modals */}
      <AcceptProposalModal
        isOpen={showAcceptModal}
        onClose={() => {
          setShowAcceptModal(false);
          setSelectedPlanId("");
        }}
        projectData={projectData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        preSelectedPlanId={selectedPlanId}
      />

      <RequestAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        projectData={projectData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </>
  ) : null;
}
