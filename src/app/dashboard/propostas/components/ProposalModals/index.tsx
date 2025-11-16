"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdjustmentModal from "../AdjustmentModal";
import AcceptanceModal from "../AcceptanceModal";
import { useProposalDetails } from "../../hooks/useProposalDetails";

interface ProposalModalsProps {
  projectId: string | null;
  projectName?: string;
  projectStatus?: string;
  templateType?: string | null;
  onClose?: () => void;
}

export default function ProposalModals({
  projectId,
  projectStatus,
  templateType,
  onClose,
}: ProposalModalsProps) {
  const router = useRouter();
  const { adjustments, acceptance } = useProposalDetails(projectId);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);

  // Show adjustment modal if there are pending adjustments
  // Only show if there are new pending adjustments (created in last 24 hours)
  useEffect(() => {
    if (projectId && adjustments.length > 0) {
      const pendingAdjustments = adjustments.filter(
        (adj) => adj.status === "pending"
      );
      
      if (pendingAdjustments.length > 0) {
        // Check if any adjustment was created in the last 24 hours
        const recentAdjustments = pendingAdjustments.filter((adj) => {
          const createdAt = new Date(adj.createdAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return hoursDiff < 24;
        });

        if (recentAdjustments.length > 0) {
          setShowAdjustmentModal(true);
        }
      }
    }
  }, [projectId, adjustments]);

  // Show acceptance modal if proposal was accepted recently (last 24 hours)
  useEffect(() => {
    if (projectId && projectStatus === "approved" && acceptance) {
      const acceptedAt = new Date(acceptance.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - acceptedAt.getTime()) / (1000 * 60 * 60);
      
      // Only show if accepted in the last 24 hours
      if (hoursDiff < 24) {
        setShowAcceptanceModal(true);
      }
    }
  }, [projectId, projectStatus, acceptance]);

  const handleEditProposal = () => {
    if (projectId && templateType) {
      router.push(
        `/editar?projectId=${projectId}&templateType=${templateType}`
      );
    }
  };

  const handleAdjustmentModalClose = () => {
    setShowAdjustmentModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleAcceptanceModalClose = () => {
    setShowAcceptanceModal(false);
    if (onClose) {
      onClose();
    }
  };

  if (!projectId) return null;

  return (
    <>
      <AdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={handleAdjustmentModalClose}
        adjustments={adjustments.filter((adj) => adj.status === "pending")}
        onEditProposal={handleEditProposal}
      />

      <AcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={handleAcceptanceModalClose}
        clientName={acceptance?.clientName}
        chosenPlan={acceptance?.chosenPlan}
        chosenPlanValue={acceptance?.chosenPlanValue}
        acceptedBy={acceptance?.acceptedBy}
      />
    </>
  );
}

