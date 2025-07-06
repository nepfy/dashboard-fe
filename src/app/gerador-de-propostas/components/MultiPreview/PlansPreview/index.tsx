import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import { Star, Check } from "lucide-react";

export default function PlansPreview() {
  const { formData } = useProjectGenerator();

  const formatPrice = (price: string | number) => {
    if (!price) return "Consulte";
    const numericPrice = typeof price === "string" ? price : price.toString();
    return `R$ ${numericPrice}`;
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case "monthly":
        return "/mês";
      case "yearly":
        return "/ano";
      case "one-time":
      default:
        return "";
    }
  };

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-start items-start h-full p-8 overflow-y-scroll">
        {!formData?.step12?.hidePlansSection && (
          <div className="w-full space-y-8">
            {/* Plans Grid */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {formData?.step12?.plans?.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl shadow-lg overflow-hidden my-2 ${
                    plan.isBestOffer ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  {/* Best Offer Badge */}
                  {plan.isBestOffer && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-bl-xl font-semibold text-sm flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Melhor oferta
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.title || `Plano ${index + 1}`}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {plan.description || "Descrição do plano"}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(plan.price ?? "")}
                        </span>
                        <span className="text-sm text-gray-600">
                          {getPeriodText(plan.pricePeriod ?? "")}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    {plan?.planDetails && plan.planDetails.length > 0 && (
                      <div className="mb-8">
                        <ul className="space-y-3">
                          {plan.planDetails.map((planDetail) => (
                            <li
                              key={planDetail.id}
                              className="flex items-start gap-3"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <Check size={16} className="text-green-500" />
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed">
                                {planDetail.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                        plan.isBestOffer
                          ? "bg-gradient-to-r from-primary-light-500 to-primary-light-600 hover:from-primary-light-600 hover:to-primary-light-700 shadow-lg"
                          : "bg-primary-light-500 hover:bg-primary-light-600"
                      }`}
                    >
                      {plan.ctaButtonTitle || "Escolher este plano"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {(!formData?.step12?.plans ||
              formData.step12.plans.length === 0) && (
              <div className="text-center py-16">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white-neutral-light-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white-neutral-light-100 mb-2">
                  Nenhum plano adicionado
                </h3>
                <p className="text-white-neutral-light-300">
                  Adicione seus planos para visualizar como eles aparecerão na
                  proposta
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {formData?.step12?.hidePlansSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Planos e valores&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
