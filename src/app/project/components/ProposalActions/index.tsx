"use client";

import { useState, useEffect, useRef } from "react";
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
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Don't show actions if proposal is already accepted or rejected
  const shouldShowActions = !["approved", "rejected"].includes(
    projectData.projectStatus || ""
  );

  // Detect scroll using IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When sentinel is NOT intersecting (out of view), show the bar
          setHasScrolled(!entry.isIntersecting);
          console.log("Scroll detected:", {
            isIntersecting: entry.isIntersecting,
            showBar: !entry.isIntersecting,
          });
        });
      },
      {
        threshold: 0,
        rootMargin: "-100px 0px 0px 0px", // Trigger when scrolled 100px past the sentinel
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!shouldShowActions) {
    return null;
  }

  return !isEditing ? (
    <>
      {/* Invisible sentinel element to detect scroll */}
      <div
        ref={sentinelRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      />

      {/* Fixed Action Bar */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg transition-transform duration-300 ${
          hasScrolled ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          backgroundColor: "white",
          borderTopColor: "#e5e7eb",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 py-4 sm:justify-end">
          {/* Action Buttons */}
          <div className="flex w-full items-center gap-3 sm:w-auto">
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
  ) : null;
}
