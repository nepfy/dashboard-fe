"use client";

import { useState } from "react";
import type { TemplateData } from "#/types/template-data";
import { trackNotificationSent } from "#/lib/analytics/track";

interface AcceptProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: TemplateData;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function AcceptProposalModal({
  isOpen,
  onClose,
  projectData,
  isSubmitting,
  setIsSubmitting,
}: AcceptProposalModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const plans = projectData.proposalData?.plans?.plansItems || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Por favor, informe seu nome");
      return;
    }

    if (plans.length > 0 && !selectedPlan) {
      setError("Por favor, selecione um plano");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send proposal acceptance event
      const response = await fetch("/api/webhooks/proposal-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "proposal_accepted",
          projectId: projectData.id,
          projectName: projectData.projectName,
          client: projectData.clientName,
          chosenPlan: selectedPlan ? plans.find(p => p.id === selectedPlan)?.title : undefined,
          chosenPlanValue: selectedPlan ? plans.find(p => p.id === selectedPlan)?.value : undefined,
          acceptedBy: name,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao aceitar proposta");
      }

      const data = await response.json();

      // Track notification sent if tracking data is provided by the server
      if (data.trackingData) {
        trackNotificationSent(data.trackingData);
      }

      setSuccess(true);
      
      // Show success message then close
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName("");
        setSelectedPlan("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aceitar proposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
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
              Proposta aceita! 🎉
            </h3>
            <p className="text-gray-600">
              O responsável pela proposta foi notificado e entrará em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aceitar proposta
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Confirme que você aceita esta proposta
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

            {/* Plan selection (if there are multiple plans) */}
            {plans.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o plano escolhido *
                </label>
                <div className="space-y-2">
                  {plans
                    .filter(plan => !plan.hideTitleField)
                    .map((plan) => (
                      <label
                        key={plan.id || plan.title}
                        className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{
                          borderColor:
                            selectedPlan === (plan.id || plan.title)
                              ? projectData.mainColor || "#6366f1"
                              : "#e5e7eb",
                        }}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id || plan.title}
                          checked={selectedPlan === (plan.id || plan.title)}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="mr-3"
                          disabled={isSubmitting}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {plan.title}
                          </p>
                          {!plan.hidePrice && plan.value && (
                            <p className="text-sm text-gray-600">
                              {plan.value}
                              {!plan.hidePlanPeriod && plan.planPeriod && ` ${plan.planPeriod}`}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? "Enviando..." : "Confirmar aceite"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

