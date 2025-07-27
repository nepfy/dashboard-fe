import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import FlashTemplatePreview from "./Flash";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ProposalFormData } from "#/types/project";
import type { CompleteProjectData } from "#/app/project/types/project";

// Interface for Lenis instance
interface LenisInstance {
  stop: () => void;
  start: () => void;
}

// Extend Window interface to include lenis
declare global {
  interface Window {
    lenis?: LenisInstance;
  }
}

// Helper function to convert ProposalFormData to CompleteProjectData
const convertFormDataToCompleteProjectData = (
  formData: ProposalFormData
): CompleteProjectData => {
  return {
    id: "",
    projectName: formData.step1?.projectName || "",
    hideClientName: formData.step1?.hideClientName || false,
    clientName: formData.step1?.clientName || "",
    hideClientPhoto: formData.step1?.hideClientPhoto || false,
    clientPhoto: formData.step1?.clientPhoto || null,
    projectSentDate: null,
    projectValidUntil: null,
    projectStatus: "",
    projectVisualizationDate: null,
    templateType: formData.step1?.templateType || null,
    mainColor: formData.step1?.mainColor || null,
    companyName: formData.step1?.companyName || null,
    companyEmail: formData.step1?.companyEmail || null,
    ctaButtonTitle: formData.step1?.ctaButtonTitle || null,
    pageTitle: formData.step1?.pageTitle || null,
    pageSubtitle: formData.step1?.pageSubtitle || null,
    hidePageSubtitle: formData.step1?.hidePageSubtitle || false,
    services: Array.isArray(formData.step1?.services)
      ? formData.step1.services.join(",")
      : formData.step1?.services || null,
    hideServices: formData.step1?.hideServices || false,
    hideAboutUsSection: formData.step2?.hideAboutUsSection || false,
    aboutUsTitle: formData.step2?.aboutUsTitle || null,
    hideAboutUsTitle: formData.step2?.hideAboutUsTitle || false,
    hideAboutUsSubtitle1: formData.step2?.hideAboutUsSubtitle1 || false,
    hideAboutUsSubtitle2: formData.step2?.hideAboutUsSubtitle2 || false,
    aboutUsSubtitle1: formData.step2?.aboutUsSubtitle1 || null,
    aboutUsSubtitle2: formData.step2?.aboutUsSubtitle2 || null,
    hideAboutYourTeamSection: formData.step3?.hideAboutYourTeamSection || false,
    ourTeamSubtitle: formData.step3?.ourTeamSubtitle || null,
    teamMembers: (formData.step3?.teamMembers || []).map((member) => ({
      id: member.id || "",
      name: member.name || "",
      role: member.role || null,
      photo: member.photo || null,
      sortOrder: member.sortOrder || null,
    })),
    hideExpertiseSection: formData.step4?.hideExpertiseSection || false,
    expertiseSubtitle: formData.step4?.expertiseSubtitle || null,
    expertise: (formData.step4?.expertise || []).map((exp) => ({
      id: exp.id || "",
      icon: typeof exp.icon === "string" ? exp.icon : null,
      title: exp.title || "",
      description: exp.description || null,
      sortOrder: exp.sortOrder || null,
      hideExpertiseIcon: exp.hideExpertiseIcon,
    })),
    hideResultsSection: formData.step5?.hideYourResultsSection || false,
    resultsSubtitle: formData.step5?.resultsSubtitle || null,
    results: (formData.step5?.results || []).map((result) => ({
      id: result.id || "",
      photo: result.photo || null,
      hidePhoto: result.hidePhoto,
      client: result.client || null,
      subtitle: result.subtitle || null,
      investment: result.investment || null,
      roi: result.roi || null,
      sortOrder: result.sortOrder || null,
    })),
    hideClientsSection: formData.step6?.hideClientsSection || false,
    clientSubtitle: formData.step6?.clientSubtitle || null,
    clients: (formData.step6?.clients || []).map((client) => ({
      id: client.id || "",
      logo: client.logo || null,
      hideLogo: client.hideLogo || null,
      name: client.name || "",
      hideClientName: client.hideClientName || null,
      sortOrder: client.sortOrder || null,
    })),
    hideProcessSection: formData.step7?.hideProcessSection || false,
    hideProcessSubtitle: formData.step7?.hideProcessSubtitle || false,
    processSubtitle: formData.step7?.processSubtitle || null,
    processSteps: (formData.step7?.processSteps || []).map((step) => ({
      id: step.id || "",
      stepCounter: step.stepCounter || 0,
      stepName: step.stepName || "",
      description: step.description || null,
      sortOrder: step.sortOrder || null,
    })),
    hideCTASection: formData.step8?.hideCTASection || false,
    ctaBackgroundImage: formData.step8?.ctaBackgroundImage || null,
    hideTestimonialsSection: formData.step9?.hideTestimonialsSection || false,
    testimonials: (formData.step9?.testimonials || []).map((testimonial) => ({
      id: testimonial.id || "",
      testimonial: testimonial.testimonial || "",
      name: testimonial.name || "",
      role: testimonial.role || null,
      photo: testimonial.photo || null,
      hidePhoto: testimonial.hidePhoto || null,
      sortOrder: testimonial.sortOrder || null,
    })),
    hideInvestmentSection: formData.step10?.hideInvestmentSection || false,
    investmentTitle: formData.step10?.investmentTitle || null,
    hideIncludedServicesSection:
      formData.step11?.hideIncludedServicesSection || false,
    includedServices: (formData.step11?.includedServices || []).map(
      (service) => ({
        id: service.id || "",
        title: service.title || "",
        description: service.description || null,
        sortOrder: service.sortOrder || null,
      })
    ),
    hidePlansSection: formData.step12?.hidePlansSection || false,
    plans: (formData.step12?.plans || []).map((plan) => ({
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
    hideTermsSection: formData.step13?.hideTermsSection || false,
    termsConditions: (formData.step13?.termsConditions || []).map((term) => ({
      id: term.id || "",
      title: term.title || "",
      description: term.description || "",
      sortOrder: term.sortOrder || null,
    })),
    hideFaqSection: formData.step14?.hideFaqSection || false,
    hideFaqSubtitle: formData.step14?.hideFaqSubtitle || false,
    faqSubtitle: formData.step14?.faqSubtitle || null,
    faq: (formData.step14?.faq || []).map((faq) => ({
      id: faq.id || "",
      question: faq.question || "",
      answer: faq.answer || "",
      sortOrder: faq.sortOrder || null,
    })),
    hideFinalMessageSection: formData.step15?.hideFinalMessage || false,
    hideFinalMessageSubtitle:
      formData.step15?.hideFinalMessageSubtitle || false,
    endMessageTitle: formData.step15?.endMessageTitle || null,
    endMessageTitle2: formData.step15?.endMessageTitle2 || null,
    endMessageDescription: formData.step15?.endMessageDescription || null,
    projectUrl: formData.step16?.pageUrl || null,
    pagePassword: formData.step16?.pagePassword || null,
    isPublished: false,
    isProposalGenerated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
  };
};

export default function PreviewModal({
  isPreviewOpen,
  setIsPreviewOpen,
}: {
  isPreviewOpen: boolean;
  setIsPreviewOpen: (isOpen: boolean) => void;
}) {
  const { formData, templateType } = useProjectGenerator();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const completeProjectData = convertFormDataToCompleteProjectData(formData);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";

      // Disable Lenis scroll when modal is open
      const lenisInstance = window.lenis;
      if (lenisInstance) {
        lenisInstance.stop();
      }
    } else {
      document.body.style.overflow = "auto";

      // Re-enable Lenis scroll when modal is closed
      const lenisInstance = window.lenis;
      if (lenisInstance) {
        lenisInstance.start();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";

      const lenisInstance = window.lenis;
      if (lenisInstance) {
        lenisInstance.start();
      }
    };
  }, [isPreviewOpen, setIsPreviewOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsPreviewOpen(false);
    }
  };

  if (!isPreviewOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-filter backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white-neutral-light-100 rounded-[var(--radius-m)] shadow-lg w-[90%] h-[90%] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-white-neutral-light-800 text-lg">Preview</h1>
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="p-1 bg-white-neutral-light-100 rounded-full cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={24} className="text-white-neutral-light-800" />
          </button>
        </div>
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            height: "100%",
            minHeight: 0,
          }}
        >
          {templateType === "flash" && (
            <FlashTemplatePreview data={completeProjectData} />
          )}
        </div>
      </div>
    </div>
  );
}
