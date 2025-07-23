import { useState } from "react";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";
import PlansSectionPreview from "#/app/gerador-de-propostas/components/PreviewModal/Flash/PlansSectionPreview";
import type { CompleteProjectData } from "#/app/project/types/project";
import type { ProposalFormData } from "#/types/project";
import { Star, Check } from "lucide-react";

// Helper function to convert form data to CompleteProjectData
const convertFormDataToCompleteProjectData = (
  formData: ProposalFormData
): CompleteProjectData => {
  return {
    id: "",
    projectName: formData?.step1?.projectName || "",
    hideClientName: formData?.step1?.hideClientName || false,
    clientName: formData?.step1?.clientName || "",
    hideClientPhoto: formData?.step1?.hideClientPhoto || false,
    clientPhoto: formData?.step1?.clientPhoto || null,
    projectSentDate: null,
    projectValidUntil: null,
    projectStatus: "",
    projectVisualizationDate: null,
    templateType: formData?.step1?.templateType || null,
    mainColor: formData?.step1?.mainColor || null,
    companyName: formData?.step1?.companyName || null,
    companyEmail: formData?.step1?.companyEmail || null,
    ctaButtonTitle: formData?.step1?.ctaButtonTitle || null,
    pageTitle: formData?.step1?.pageTitle || null,
    pageSubtitle: formData?.step1?.pageSubtitle || null,
    hidePageSubtitle: formData?.step1?.hidePageSubtitle || false,
    services: Array.isArray(formData?.step1?.services)
      ? formData.step1.services.join(",")
      : formData?.step1?.services || null,
    hideServices: formData?.step1?.hideServices || false,
    hideAboutUsSection: formData?.step2?.hideAboutUsSection || false,
    aboutUsTitle: formData?.step2?.aboutUsTitle || null,
    hideAboutUsSubtitle1: formData?.step2?.hideAboutUsSubtitle1 || false,
    hideAboutUsSubtitle2: formData?.step2?.hideAboutUsSubtitle2 || false,
    aboutUsSubtitle1: formData?.step2?.aboutUsSubtitle1 || null,
    aboutUsSubtitle2: formData?.step2?.aboutUsSubtitle2 || null,
    hideAboutYourTeamSection:
      formData?.step3?.hideAboutYourTeamSection || false,
    ourTeamSubtitle: formData?.step3?.ourTeamSubtitle || null,
    teamMembers: (formData?.step3?.teamMembers || []).map((member) => ({
      id: member.id || "",
      name: member.name || "",
      role: member.role || null,
      photo: member.photo || null,
      sortOrder: member.sortOrder || null,
    })),
    hideExpertiseSection: formData?.step4?.hideExpertiseSection || false,
    expertiseSubtitle: formData?.step4?.expertiseSubtitle || null,
    expertise: (formData?.step4?.expertise || []).map((exp) => ({
      id: exp.id || "",
      icon: typeof exp.icon === "string" ? exp.icon : null,
      title: exp.title || "",
      description: exp.description || null,
      sortOrder: exp.sortOrder || null,
      hideExpertiseIcon: exp.hideExpertiseIcon,
    })),
    hideResultsSection: formData?.step5?.hideYourResultsSection || false,
    resultsSubtitle: formData?.step5?.resultsSubtitle || null,
    results: (formData?.step5?.results || []).map((result) => ({
      id: result.id || "",
      photo: result.photo || null,
      hidePhoto: result.hidePhoto,
      client: result.client || null,
      subtitle: result.subtitle || null,
      investment: result.investment || null,
      roi: result.roi || null,
      sortOrder: result.sortOrder || null,
    })),
    hideClientsSection: formData?.step6?.hideClientsSection || false,
    clientSubtitle: formData?.step6?.clientSubtitle || null,
    clients: (formData?.step6?.clients || []).map((client) => ({
      id: client.id || "",
      logo: client.logo || null,
      hideLogo: client.hideLogo || null,
      name: client.name || "",
      hideClientName: client.hideClientName || null,
      sortOrder: client.sortOrder || null,
    })),
    hideProcessSection: formData?.step7?.hideProcessSection || false,
    hideProcessSubtitle: formData?.step7?.hideProcessSubtitle || false,
    processSubtitle: formData?.step7?.processSubtitle || null,
    processSteps: (formData?.step7?.processSteps || []).map((step) => ({
      id: step.id || "",
      stepCounter: step.stepCounter || 0,
      stepName: step.stepName || "",
      description: step.description || null,
      sortOrder: step.sortOrder || null,
    })),
    hideCTASection: formData?.step8?.hideCTASection || false,
    ctaBackgroundImage: formData?.step8?.ctaBackgroundImage || null,
    hideTestimonialsSection: formData?.step9?.hideTestimonialsSection || false,
    testimonials: (formData?.step9?.testimonials || []).map((testimonial) => ({
      id: testimonial.id || "",
      testimonial: testimonial.testimonial || "",
      name: testimonial.name || "",
      role: testimonial.role || null,
      photo: testimonial.photo || null,
      hidePhoto: testimonial.hidePhoto || null,
      sortOrder: testimonial.sortOrder || null,
    })),
    hideInvestmentSection: formData?.step10?.hideInvestmentSection || false,
    investmentTitle: formData?.step10?.investmentTitle || null,
    hideIncludedServicesSection:
      formData?.step11?.hideIncludedServicesSection || false,
    includedServices: (formData?.step11?.includedServices || []).map(
      (service) => ({
        id: service.id || "",
        title: service.title || "",
        description: service.description || null,
        sortOrder: service.sortOrder || null,
      })
    ),
    hidePlansSection: formData?.step12?.hidePlansSection || false,
    plans: (formData?.step12?.plans || []).map((plan) => ({
      id: plan.id || "",
      title: plan.title || "",
      description: plan.description || null,
      isBestOffer: plan.isBestOffer || null,
      price: plan.price?.toString() || null,
      pricePeriod: plan.pricePeriod || null,
      ctaButtonTitle: plan.ctaButtonTitle || null,
      sortOrder: plan.sortOrder || null,
      planDetails: (plan.planDetails || []).map((detail) => ({
        id: detail.id || "",
        description: detail.description || "",
        sortOrder: detail.sortOrder || null,
      })),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    // Add other required fields with default values
    hideTermsSection: false,
    termsConditions: [],
    hideFaqSection: false,
    hideFaqSubtitle: false,
    faqSubtitle: null,
    faq: [],
    hideFinalMessageSection: false,
    hideFinalMessageSubtitle: false,
    endMessageTitle: null,
    endMessageTitle2: null,
    endMessageDescription: null,
    projectUrl: null,
    pagePassword: null,
    isPublished: false,
    isProposalGenerated: false,
  };
};

export default function PlansPreview() {
  const { formData, templateType } = useProjectGenerator();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const completeProjectData = convertFormDataToCompleteProjectData(formData);

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

  // If Flash template is selected, render the Flash template section
  if (templateType === "flash") {
    return (
      <>
        <TemplatePreviewWrapper>
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <PlansSectionPreview data={completeProjectData} />
            </div>
          </div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ExpandIcon width="16" height="16" />
          </button>
        </TemplatePreviewWrapper>

        <PreviewModal
          isPreviewOpen={isPreviewOpen}
          setIsPreviewOpen={setIsPreviewOpen}
        />
      </>
    );
  }

  // Default preview for other templates
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
