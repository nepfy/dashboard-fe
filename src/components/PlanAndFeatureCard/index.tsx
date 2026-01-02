"use client";

import { useState } from "react";
import { StarIcon, LoaderCircle, CheckIcon } from "lucide-react";
import Pagination from "#/components/Pagination";

export interface DisplayPlanCard {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  originalPriceLabel?: string;
  intervalLabel: string;
  intervalSuffix?: string;
  features: string[];
  comingSoonFeatures?: string[];
  buttonTitle: string;
  savingsLabel?: string;
  discountPercent?: number;
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
  processingPlanId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // SM mostra 1 card por vez
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  // Para SM, usar paginação
  const smPlans = plans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top quando mudar de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* SM: mostrar apenas o card da página atual com paginação */}
      <div className="block md:hidden">
        {smPlans.map((plan) => {
          const isProcessing = plan.id === processingPlanId;
          const isHighlighted = plan.highlight || plan.isRecommended;

          return (
            <article
              key={plan.id}
              className={`group relative flex h-full flex-col rounded-xl border px-4 py-6 transition duration-300 ${
                isHighlighted
                  ? "-mt-6 border-[3px] border-[#6366f1] bg-white shadow-lg"
                  : "border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-2 left-0 flex min-h-8 min-w-full items-center justify-center rounded-t-xl bg-[#6366f1]">
                  <div className="flex items-center gap-2">
                    <StarIcon
                      fill="white"
                      stroke="white"
                      width={10}
                      height={10}
                    />
                    <span className="inline-flex items-center text-xs font-semibold whitespace-nowrap text-white">
                      MELHOR OFERTA
                    </span>
                  </div>
                </div>
              )}

              <div className="flex h-full flex-col">
                <div
                  className={`mb-6 min-h-[80px] ${isHighlighted ? "mt-4 text-[#6366f1]" : ""}`}
                >
                  <h3 className="mb-2 text-2xl font-bold">
                    <span className="font-light">Plano</span>{" "}
                    {plan.title.substring(5)}
                  </h3>
                  <p className="text-sm text-neutral-900">{plan.description}</p>
                </div>

                <div className="mb-6 flex min-h-[180px] flex-col overflow-visible">
                  {plan.originalPriceLabel && (
                    <div className="mb-1">
                      <p className="text-sm text-gray-400 line-through">
                        {plan.originalPriceLabel}
                      </p>
                    </div>
                  )}
                  <div className="mb-6 flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-shrink-0 items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {plan.priceLabel}
                      </span>
                      {plan.intervalSuffix && (
                        <span className="text-sm font-normal text-gray-400">
                          {plan.intervalSuffix}
                        </span>
                      )}
                    </div>
                    {plan.discountPercent && (
                      <span className="flex shrink-0 items-center justify-center gap-1 rounded-md bg-[#84cc16] px-4 py-3 text-xs leading-tight font-bold whitespace-nowrap text-neutral-900">
                        <span>{plan.discountPercent}%</span>
                        <span>OFF</span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`w-full cursor-pointer rounded-lg px-4 py-3 text-sm transition ${
                      plan.title === "Plano Free"
                        ? "border-2 border-[#6366f1] bg-white text-neutral-900 hover:bg-gray-50"
                        : "bg-[#6366f1] text-white hover:bg-[#5558e3]"
                    }`}
                    disabled={isProcessing}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {isProcessing ? (
                      <span
                        className={`flex items-center justify-center gap-2 ${plan.title === "Plano Free" ? "text-neutral-900" : "font-semibold text-white"}`}
                      >
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Selecionando...
                      </span>
                    ) : (
                      plan.buttonTitle || "Selecionar plano"
                    )}
                  </button>
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="flex-1">
                  <p className="mb-4 text-[9px] font-semibold text-gray-500 uppercase">
                    O QUE ESTÁ INCLUSO
                  </p>
                  {plan.features.length === 0 &&
                  !plan.comingSoonFeatures?.length ? (
                    <p className="text-sm text-gray-400">
                      Recursos adicionais em breve.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckIcon className="h-4 w-4 text-[#6366f1]" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.comingSoonFeatures?.map((feature, index) => (
                        <li
                          key={`coming-soon-${index}`}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-0.5 shrink-0 text-gray-400/40">
                            ✓
                          </span>
                          <span className="text-sm text-gray-400">
                            {feature}{" "}
                            <span className="rounded bg-[#e1e2ee] px-2 py-0.5 text-xs font-semibold text-neutral-900/72">
                              EM BREVE
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* MD e LG: mostrar todos os cards em grid */}
      <div className="hidden gap-3 md:grid md:grid-cols-1 lg:grid-cols-4">
        {plans.map((plan) => {
          const isProcessing = plan.id === processingPlanId;
          const isHighlighted = plan.highlight || plan.isRecommended;

          return (
            <article
              key={plan.id}
              className={`group relative flex h-full flex-col rounded-xl border px-4 py-6 transition duration-300 sm:px-4 sm:py-8 md:px-4 md:py-8 ${
                isHighlighted
                  ? "-mt-6 border-[3px] border-[#6366f1] bg-white shadow-lg"
                  : "border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-2 left-0 flex min-h-8 min-w-full items-center justify-center rounded-t-xl bg-[#6366f1]">
                  <div className="flex items-center gap-2">
                    <StarIcon
                      fill="white"
                      stroke="white"
                      width={10}
                      height={10}
                    />
                    <span className="inline-flex items-center text-xs font-semibold whitespace-nowrap text-white">
                      MELHOR OFERTA
                    </span>
                  </div>
                </div>
              )}

              <div className="flex h-full flex-col">
                <div
                  className={`mb-6 min-h-[80px] ${isHighlighted ? "mt-4 text-[#6366f1]" : ""}`}
                >
                  <h3 className="mb-2 text-2xl font-bold">
                    <span className="font-light">Plano</span>{" "}
                    {plan.title.substring(5)}
                  </h3>
                  <p className="text-sm text-neutral-900">{plan.description}</p>
                </div>

                <div className="mb-6 flex min-h-[180px] flex-col overflow-visible">
                  {plan.originalPriceLabel && (
                    <div className="mb-1">
                      <p className="text-sm text-gray-400 line-through">
                        {plan.originalPriceLabel}
                      </p>
                    </div>
                  )}
                  <div className="mb-6 flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-shrink-0 items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {plan.priceLabel}
                      </span>
                      {plan.intervalSuffix && (
                        <span className="text-sm font-normal text-gray-400">
                          {plan.intervalSuffix}
                        </span>
                      )}
                    </div>
                    {plan.discountPercent && (
                      <span className="flex shrink-0 items-center justify-center gap-1 rounded-md bg-[#84cc16] px-4 py-3 text-xs leading-tight font-bold whitespace-nowrap text-neutral-900">
                        <span>{plan.discountPercent}%</span>
                        <span>OFF</span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`w-full cursor-pointer rounded-lg px-4 py-3 text-sm transition ${
                      plan.title === "Plano Free"
                        ? "border-2 border-[#6366f1] bg-white text-neutral-900 hover:bg-gray-50"
                        : "bg-[#6366f1] text-white hover:bg-[#5558e3]"
                    }`}
                    disabled={isProcessing}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {isProcessing ? (
                      <span
                        className={`flex items-center justify-center gap-2 ${plan.title === "Plano Free" ? "text-neutral-900" : "font-semibold text-white"}`}
                      >
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Selecionando...
                      </span>
                    ) : (
                      plan.buttonTitle || "Selecionar plano"
                    )}
                  </button>
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="flex-1">
                  <p className="mb-4 text-[9px] font-semibold text-gray-500 uppercase">
                    O QUE ESTÁ INCLUSO
                  </p>
                  {plan.features.length === 0 &&
                  !plan.comingSoonFeatures?.length ? (
                    <p className="text-sm text-gray-400">
                      Recursos adicionais em breve.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckIcon className="h-4 w-4 text-[#6366f1]" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.comingSoonFeatures?.map((feature, index) => (
                        <li
                          key={`coming-soon-${index}`}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-0.5 shrink-0 text-gray-400/40">
                            ✓
                          </span>
                          <span className="text-sm text-gray-400">
                            {feature}{" "}
                            <span className="rounded bg-[#e1e2ee] px-2 py-0.5 text-xs font-semibold text-neutral-900/72">
                              EM BREVE
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Paginação para SM */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center md:hidden">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            showArrows={true}
            maxVisiblePages={3}
          />
        </div>
      )}
    </div>
  );
};

export default PlanAndFeatureCard;
