"use client";

import { LoaderCircle } from "lucide-react";

export interface DisplayPlanCard {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  intervalLabel: string;
  features: string[];
  buttonTitle: string;
  savingsLabel?: string;
  isRecommended?: boolean;
  highlight?: boolean;
}

interface PlanAndFeatureCardProps {
  plans: DisplayPlanCard[];
  onSelectPlan: (planId: string) => void;
  selectedPlanId: string | null;
  processingPlanId: string | null;
}

const PlanAndFeatureCard: React.FC<PlanAndFeatureCardProps> = ({
  plans,
  onSelectPlan,
  selectedPlanId,
  processingPlanId,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => {
        const isSelected = plan.id === selectedPlanId;
        const isProcessing = plan.id === processingPlanId;

        return (
          <article
            key={plan.id}
            className={`group relative flex flex-col justify-between gap-6 rounded-[28px] border px-6 py-8 shadow-sm transition duration-300 focus-within:shadow-md ${
              isSelected
                ? "border-indigo-500 bg-white shadow-[0_20px_45px_rgba(26,32,126,0.12)]"
                : "border-gray-200 bg-white hover:-translate-y-1 hover:border-indigo-200"
            } ${plan.highlight ? "border-[3px] border-indigo-500" : ""}`}
          >
            <div>
              {plan.isRecommended && (
                <span className="inline-flex items-center rounded-full border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Melhor oferta
                </span>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {plan.priceLabel}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    {plan.intervalLabel}
                  </p>
                </div>
              </div>

              {plan.savingsLabel && (
                <p className="mt-3 text-sm font-semibold text-emerald-600">
                  {plan.savingsLabel}
                </p>
              )}

              <div className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                    <p>{feature}</p>
                  </div>
                ))}
                {plan.features.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Recursos adicionais em breve.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-500 hover:text-white"
              }`}
              disabled={isProcessing}
              onClick={() => onSelectPlan(plan.id)}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Selecionando...
                </span>
              ) : (
                plan.buttonTitle || "Selecionar plano"
              )}
            </button>
          </article>
        );
      })}
    </div>
  );
};

export default PlanAndFeatureCard;
