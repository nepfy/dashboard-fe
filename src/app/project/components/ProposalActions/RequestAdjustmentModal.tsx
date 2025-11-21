"use client";

import { useState } from "react";
import type { TemplateData } from "#/types/template-data";
import type { AdjustmentType } from "#/lib/db/schema/proposal-adjustments";

interface RequestAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: TemplateData;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const adjustmentTypes: { value: AdjustmentType; label: string }[] = [
  { value: "change_values_or_plans", label: "Alterar valores ou planos" },
  { value: "change_scope", label: "Alterar escopo do projeto" },
  { value: "change_timeline", label: "Ajustar prazos de entrega" },
  { value: "other", label: "Outro tipo de ajuste" },
];

export default function RequestAdjustmentModal({
  isOpen,
  onClose,
  projectData,
  isSubmitting,
  setIsSubmitting,
}: RequestAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType | "">("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Por favor, informe seu nome");
      return;
    }

    if (!adjustmentType) {
      setError("Por favor, selecione o tipo de ajuste");
      return;
    }

    if (!description.trim()) {
      setError("Por favor, descreva o ajuste desejado");
      return;
    }

    if (description.trim().length < 10) {
      setError("Por favor, forneça uma descrição mais detalhada (mínimo 10 caracteres)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send proposal feedback event with adjustment request
      const response = await fetch("/api/webhooks/proposal-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "proposal_feedback",
          projectId: projectData.id,
          projectName: projectData.projectName,
          client: projectData.clientName,
          feedbackText: description,
          feedbackType: "adjustment_request",
          adjustmentType: adjustmentType,
          requestedBy: name,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação de ajuste");
      }

      setSuccess(true);
      
      // Show success message then close
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName("");
        setAdjustmentType("");
        setDescription("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after animation
      setTimeout(() => {
        setName("");
        setAdjustmentType("");
        setDescription("");
        setError("");
      }, 300);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: projectData.mainColor || "#6366f1" }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Solicitação enviada! ✉️
            </h3>
            <p className="text-gray-600">
              O responsável pela proposta foi notificado e entrará em contato em breve para discutir os ajustes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Solicitar ajuste
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Descreva o ajuste desejado. Encaminharemos uma nova versão da proposta.
            </p>

            {/* Name input */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Seu nome completo *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900"
                placeholder="Digite seu nome completo"
                disabled={isSubmitting}
              />
            </div>

            {/* Adjustment type selection */}
            <div className="mb-4">
              <label
                htmlFor="adjustmentType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de ajuste *
              </label>
              <select
                id="adjustmentType"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900"
                disabled={isSubmitting}
              >
                <option value="">Selecione o tipo de ajuste</option>
                {adjustmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description textarea */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descrição do ajuste *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 resize-none"
                placeholder="Descreva detalhadamente o que você gostaria de ajustar na proposta..."
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length} caracteres (mínimo 10)
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: projectData.mainColor || "#6366f1"
                }}
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitação"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

