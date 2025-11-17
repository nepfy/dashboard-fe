"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import Modal from "#/components/Modal";

interface Adjustment {
  id: string;
  type: string;
  description: string;
  clientName?: string;
  requestedBy?: string;
  createdAt: Date | string;
}

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  adjustments: Adjustment[];
  projectId?: string;
  projectName?: string;
  onEditProposal?: () => void;
  onAdjustmentDeleted?: () => Promise<void> | void;
}

const adjustmentTypeLabels: Record<string, string> = {
  change_values_or_plans: "Alterar valores ou planos",
  change_scope: "Alterar escopo",
  change_timeline: "Alterar prazo",
  other: "Outro",
};

export default function AdjustmentModal({
  isOpen,
  onClose,
  adjustments,
  onEditProposal,
  projectId,
  onAdjustmentDeleted,
}: AdjustmentModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeletingAdjustment, setIsDeletingAdjustment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || adjustments.length === 0) return null;

  const currentAdjustment = adjustments[currentIndex];
  const hasMultiple = adjustments.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : adjustments.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < adjustments.length - 1 ? prev + 1 : 0));
  };

  const handleEditProposal = () => {
    if (onEditProposal) {
      onEditProposal();
    }
    onClose();
  };

  const handleDeleteAdjustment = async () => {
    if (!projectId || !currentAdjustment) return;
    setIsDeletingAdjustment(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/adjustments/${currentAdjustment.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível excluir o ajuste.");
      }

      if (onAdjustmentDeleted) {
        await onAdjustmentDeleted();
      }

      onClose();
    } catch (error) {
      console.error("Failed to delete adjustment:", error);
    } finally {
      setIsDeletingAdjustment(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuste solicitado pelo cliente"
      showCloseButton={true}
      width="520px"
      footer={false}
    >
      <div className="px-6 pb-6">
        <p className="text-white-neutral-light-900 text-sm mb-6">
          Veja abaixo os ajustes solicitados. Revise cada um e envie uma nova
          versão da proposta atualizada.
        </p>

        {/* Pagination Indicators */}
        {hasMultiple && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {adjustments.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentIndex
                    ? "bg-primary-light-400 text-white"
                    : "bg-white-neutral-light-200 text-white-neutral-light-600 border border-white-neutral-light-300"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultiple && (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg hover:bg-white-neutral-light-200 transition-colors"
              aria-label="Ajuste anterior"
            >
              <ChevronLeft className="w-5 h-5 text-white-neutral-light-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg hover:bg-white-neutral-light-200 transition-colors"
              aria-label="Próximo ajuste"
            >
              <ChevronRight className="w-5 h-5 text-white-neutral-light-600" />
            </button>
          </div>
        )}

        {/* Adjustment Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-white-neutral-light-900 text-sm font-semibold mb-2 block">
              Tipo de ajuste
            </label>
            <div className="bg-primary-light-50 border border-primary-light-200 rounded-lg px-4 py-3 text-sm text-white-neutral-light-900">
              {adjustmentTypeLabels[currentAdjustment.type] ||
                currentAdjustment.type}
            </div>
          </div>

          <div>
            <label className="text-white-neutral-light-900 text-sm font-semibold mb-2 block">
              Descrição
            </label>
            <div className="bg-primary-light-50 border border-primary-light-200 rounded-lg px-4 py-3 text-sm text-white-neutral-light-900 min-h-[80px]">
              {currentAdjustment.description}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t-white-neutral-light-300 flex flex-wrap items-center justify-end gap-3 border-t p-6 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white-neutral-light-300 text-white-neutral-light-800 text-sm font-medium hover:bg-white-neutral-light-200 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleDeleteAdjustment}
            disabled={isDeletingAdjustment}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              isDeletingAdjustment
                ? "border-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
                : "border-primary-light-500 text-primary-light-500 hover:bg-primary-light-50"
            }`}
          >
            {isDeletingAdjustment ? (
              <div className="flex items-center justify-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin text-primary-light-400" />
                Excluindo ajuste...
              </div>
            ) : (
              "Excluir ajuste"
            )}
          </button>
          <button
            onClick={handleEditProposal}
            className="px-4 py-2 rounded-lg bg-primary-light-400 text-white text-sm font-medium hover:bg-primary-light-500 transition-colors"
          >
            Editar proposta
          </button>
        </div>
      </div>
    </Modal>
  );
}

