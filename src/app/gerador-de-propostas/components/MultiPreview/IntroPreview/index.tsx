import { useState } from "react";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";
import type { CompleteProjectData } from "#/app/project/types/project";
import type { ProposalFormData } from "#/types/project";
import IntroSectionPreview from "./FlashPreview";

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
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    hideAboutUsSection: false,
    aboutUsTitle: null,
    hideAboutUsSubtitle1: false,
    hideAboutUsSubtitle2: false,
    aboutUsSubtitle1: null,
    aboutUsSubtitle2: null,
    hideAboutYourTeamSection: false,
    ourTeamSubtitle: null,
    teamMembers: [],
    hideExpertiseSection: false,
    expertiseSubtitle: null,
    expertise: [],
    hideResultsSection: false,
    resultsSubtitle: null,
    results: [],
    hideClientsSection: false,
    clientSubtitle: null,
    clients: [],
    hideProcessSection: false,
    hideProcessSubtitle: false,
    processSubtitle: null,
    processSteps: [],
    hideCTASection: false,
    ctaBackgroundImage: null,
    hideTestimonialsSection: false,
    testimonials: [],
    hideInvestmentSection: false,
    investmentTitle: null,
    hideIncludedServicesSection: false,
    includedServices: [],
    hidePlansSection: false,
    plans: [],
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

export default function IntroPreview() {
  const { formData, templateType } = useProjectGenerator();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const completeProjectData = convertFormDataToCompleteProjectData(formData);

  if (templateType === "flash") {
    return (
      <>
        <TemplatePreviewWrapper>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-screen flex flex-col justify-center items-center px-2">
              <IntroSectionPreview data={completeProjectData} />
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
}
