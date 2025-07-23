import { useState } from "react";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";
import FinalMessageSectionPreview from "#/app/gerador-de-propostas/components/PreviewModal/Flash/FinalMessageSectionPreview";
import type { CompleteProjectData } from "#/app/project/types/project";
import type { ProposalFormData } from "#/types/project";
import { Calendar } from "lucide-react";
import { formatValidityDate } from "#/helpers/formatDateAndTime";

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
    hideTermsSection: formData?.step13?.hideTermsSection || false,
    termsConditions: (formData?.step13?.termsConditions || []).map((term) => ({
      id: term.id || "",
      title: term.title || "",
      description: term.description || "",
      sortOrder: term.sortOrder || null,
    })),
    hideFaqSection: formData?.step14?.hideFaqSection || false,
    hideFaqSubtitle: formData?.step14?.hideFaqSubtitle || false,
    faqSubtitle: formData?.step14?.faqSubtitle || null,
    faq: (formData?.step14?.faq || []).map((faq) => ({
      id: faq.id || "",
      question: faq.question || "",
      answer: faq.answer || "",
      sortOrder: faq.sortOrder || null,
    })),
    hideFinalMessageSection: formData?.step15?.hideFinalMessage || false,
    hideFinalMessageSubtitle:
      formData?.step15?.hideFinalMessageSubtitle || false,
    endMessageTitle: formData?.step15?.endMessageTitle || null,
    endMessageTitle2: formData?.step15?.endMessageTitle2 || null,
    endMessageDescription: formData?.step15?.endMessageDescription || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    // Add other required fields with default values
    projectUrl: null,
    pagePassword: null,
    isPublished: false,
    isProposalGenerated: false,
  };
};

export default function FinalMessagePreview() {
  const { formData, templateType } = useProjectGenerator();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const completeProjectData = convertFormDataToCompleteProjectData(formData);

  // If Flash template is selected, render the Flash template section
  if (templateType === "flash") {
    return (
      <>
        <TemplatePreviewWrapper>
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <FinalMessageSectionPreview data={completeProjectData} />
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
        {!formData?.step15?.hideFinalMessage && (
          <div className="w-full space-y-8">
            <div className="text-center space-y-6">
              {formData?.step15?.endMessageTitle && (
                <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  {formData.step15.endMessageTitle}
                </h2>
              )}

              {formData?.step15?.endMessageTitle2 && (
                <h3 className="text-white text-2xl font-semibold mb-6 drop-shadow-lg">
                  {formData.step15.endMessageTitle2}
                </h3>
              )}

              {!formData?.step15?.hideFinalMessageSubtitle &&
                formData?.step15?.endMessageDescription && (
                  <div className="bg-white/80 backdrop-blur-md rounded-xl border border-white/20 p-6 mx-auto">
                    <p className="text-white-neutral-light-800 leading-relaxed text-lg">
                      {formData.step15.endMessageDescription}
                    </p>
                  </div>
                )}

              {/* Validity Date */}
              {formData?.step15?.projectValidUntil && (
                <div className="bg-white/80 rounded-lg p-4 border border-white/20 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-3">
                    <Calendar size={20} className="text-white/70" />
                    <div className="text-white-neutral-light-800">
                      <span className="text-sm">Proposta válida até:</span>
                      <div className="font-semibold text-lg">
                        {formatValidityDate(
                          formData.step15.projectValidUntil instanceof Date
                            ? formData.step15.projectValidUntil.toISOString()
                            : formData.step15.projectValidUntil
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {formData?.step15?.hideFinalMessage && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Mensagem Final&quot; está atualmente oculta da proposta.
        </div>
      )}

      {/* Expand Button */}
      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
