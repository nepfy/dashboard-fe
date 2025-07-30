/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FlashTemplate from "#/app/project/components/Templates/Flash";
import projectData from "#/app/gerador-de-propostas/constants/flash";
import type { CompleteProjectData } from "#/app/project/types/project";
import {
  useProjectGenerator,
  ProjectGeneratorProvider,
} from "#/contexts/ProjectGeneratorContext";

// Type for the flash data structure
interface FlashData {
  step1: {
    hideClientName: boolean;
    companyName: string;
    companyEmail: string;
    ctaButtonTitle: string;
    pageTitle: string;
    hidePageSubtitle: boolean;
    pageSubtitle: string;
    hideServices: boolean;
    services: string;
  };
  step2: {
    hideAboutUsSection: boolean;
    hideAboutUsTitle: boolean;
    hideAboutUsSubtitle1: boolean;
    hideAboutUsSubtitle2: boolean;
    aboutUsTitle: string;
    aboutUsSubtitle1: string;
    aboutUsSubtitle2: string;
  };
  step3: {
    hideAboutYourTeamSection: boolean;
    ourTeamSubtitle: string;
    teamMembers: Array<{
      id: string;
      name: string;
      role: string;
      photo: string;
    }>;
  };
  step4: {
    hideExpertiseSection: boolean;
    expertiseSubtitle: string;
    expertise: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      hideExpertiseIcon: boolean;
    }>;
  };
  step5: {
    hideYourResultsSection: boolean;
    resultsSubtitle: string;
    results: Array<{
      id: string;
      client: string;
      subtitle: string;
      investment: string;
      roi: string;
      photo: string;
      sortOrder: number;
      hidePhoto: boolean;
    }>;
  };
  step6: {
    hideClientsSection: boolean;
    clients: Array<{
      id: string;
      name: string;
      logo: string;
    }>;
  };
  step7: {
    hideProcessSection: boolean;
    processSubtitle: string;
    processSteps: Array<{
      id: string;
      stepCounter: number;
      stepName: string;
      description: string;
    }>;
  };
  step8: {
    hideCTASection: boolean;
    ctaBackgroundImage: string;
  };
  step9: {
    hideTestimonialsSection: boolean;
    testimonials: Array<{
      id: string;
      name: string;
      testimonial: string;
      photo: string;
      role: string;
    }>;
  };
  step10: {
    hideInvestmentSection: boolean;
    investmentTitle: string;
  };
  step11: {
    hideIncludedServicesSection: boolean;
    includedServices: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  step12: {
    hidePlansSection: boolean;
    plans: Array<{
      id: string;
      title: string;
      description: string;
      isBestOffer: boolean;
      price: number;
      pricePeriod: string;
      ctaButtonTitle: string;
      planDetails: Array<{
        id: string;
        description: string;
      }>;
    }>;
  };
  step13: {
    hideTermsSection: boolean;
    termsConditions: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  step14: {
    hideFaqSection: boolean;
    faqSubtitle: string;
    faq: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  step15: {
    hideFinalMessage: boolean;
    hideFinalMessageSubtitle: boolean;
    endMessageTitle: string;
    endMessageTitle2: string;
    endMessageDescription: string;
  };
}

// Mapping function to convert flash data to CompleteProjectData format
function mapFlashToCompleteProjectData(
  flashData: FlashData,
  mainColor: string
): CompleteProjectData {
  return {
    id: "flash-template",
    projectName: "Flash Template",
    hideClientName: flashData.step1.hideClientName,
    clientName: "",
    hideClientPhoto: false,
    clientPhoto: null,
    projectSentDate: null,
    projectValidUntil: null,
    projectStatus: "published",
    projectVisualizationDate: null,
    templateType: "flash",
    mainColor: mainColor,
    companyName: flashData.step1.companyName,
    companyEmail: flashData.step1.companyEmail,
    ctaButtonTitle: flashData.step1.ctaButtonTitle,
    pageTitle: flashData.step1.pageTitle,
    pageSubtitle: flashData.step1.pageSubtitle,
    hidePageSubtitle: flashData.step1.hidePageSubtitle,
    services: flashData.step1.services,
    hideServices: flashData.step1.hideServices,
    hideAboutUsSection: flashData.step2.hideAboutUsSection,
    hideAboutUsTitle: flashData.step2.hideAboutUsTitle,
    aboutUsTitle: flashData.step2.aboutUsTitle,
    hideAboutUsSubtitle1: flashData.step2.hideAboutUsSubtitle1,
    hideAboutUsSubtitle2: flashData.step2.hideAboutUsSubtitle2,
    aboutUsSubtitle1: flashData.step2.aboutUsSubtitle1,
    aboutUsSubtitle2: flashData.step2.aboutUsSubtitle2,
    hideAboutYourTeamSection: flashData.step3.hideAboutYourTeamSection,
    ourTeamSubtitle: flashData.step3.ourTeamSubtitle,
    hideExpertiseSection: flashData.step4.hideExpertiseSection,
    expertiseSubtitle: flashData.step4.expertiseSubtitle,
    hideResultsSection: flashData.step5.hideYourResultsSection,
    resultsSubtitle: flashData.step5.resultsSubtitle,
    hideClientsSection: flashData.step6.hideClientsSection,
    clientSubtitle: "",
    hideProcessSection: flashData.step7.hideProcessSection,
    hideProcessSubtitle: false,
    processSubtitle: flashData.step7.processSubtitle,
    hideCTASection: flashData.step8.hideCTASection,
    ctaBackgroundImage: flashData.step8.ctaBackgroundImage,
    hideTestimonialsSection: flashData.step9.hideTestimonialsSection,
    hideInvestmentSection: flashData.step10.hideInvestmentSection,
    investmentTitle: flashData.step10.investmentTitle,
    hideIncludedServicesSection: flashData.step11.hideIncludedServicesSection,
    hidePlansSection: flashData.step12.hidePlansSection,
    hideTermsSection: flashData.step13.hideTermsSection,
    hideFaqSection: flashData.step14.hideFaqSection,
    hideFaqSubtitle: false,
    faqSubtitle: flashData.step14.faqSubtitle,
    hideFinalMessageSection: flashData.step15.hideFinalMessage,
    hideFinalMessageSubtitle: flashData.step15.hideFinalMessageSubtitle,
    endMessageTitle: flashData.step15.endMessageTitle,
    endMessageTitle2: flashData.step15.endMessageTitle2,
    endMessageDescription: flashData.step15.endMessageDescription,
    projectUrl: null,
    pagePassword: null, // Set to null to bypass password
    isPublished: true,
    isProposalGenerated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    userPhone: null,
    teamMembers: flashData.step3.teamMembers.map((member) => ({
      ...member,
      sortOrder: null,
    })),
    expertise: flashData.step4.expertise.map((exp) => ({
      ...exp,
      sortOrder: null,
    })),
    results: flashData.step5.results.map((result) => ({
      ...result,
      sortOrder: result.sortOrder,
    })),
    clients: flashData.step6.clients.map((client) => ({
      ...client,
      hideClientName: false,
      hideLogo: false,
      sortOrder: null,
    })),
    processSteps: flashData.step7.processSteps.map((step) => ({
      ...step,
      sortOrder: null,
    })),
    testimonials: flashData.step9.testimonials.map((testimonial) => ({
      ...testimonial,
      hidePhoto: false,
      sortOrder: null,
    })),
    includedServices: flashData.step11.includedServices.map((service) => ({
      ...service,
      sortOrder: null,
    })),
    plans: flashData.step12.plans.map((plan) => ({
      ...plan,
      price: plan.price.toString(),
      sortOrder: null,
      planDetails: plan.planDetails.map((detail) => ({
        ...detail,
        sortOrder: null,
      })),
    })),
    termsConditions: flashData.step13.termsConditions.map((term) => ({
      ...term,
      sortOrder: null,
    })),
    faq: flashData.step14.faq.map((faq) => ({
      ...faq,
      sortOrder: null,
    })),
  };
}

function FlashTemplateWithContext() {
  const { formData, updateFormData } = useProjectGenerator();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get color from URL params or formData
  const getColorFromUrl = () => {
    return searchParams?.get("color");
  };

  // Update URL when color changes
  useEffect(() => {
    const urlColor = getColorFromUrl();
    const currentColor = formData?.step1?.mainColor;

    if (currentColor && urlColor !== currentColor) {
      const url = new URL(window.location.href);
      url.searchParams.set("color", currentColor);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [formData?.step1?.mainColor, router]);

  // Initialize color from URL if not set in formData
  useEffect(() => {
    const urlColor = getColorFromUrl();
    if (
      urlColor &&
      (!formData?.step1?.mainColor || formData.step1.mainColor !== urlColor)
    ) {
      updateFormData("step1", { mainColor: urlColor });
    }
  }, [formData?.step1?.mainColor, updateFormData]);

  const selectedColor =
    formData?.step1?.mainColor || getColorFromUrl() || "#146EF4"; // Default color
  console.log("Selected color:", selectedColor);

  const mappedData = mapFlashToCompleteProjectData(projectData, selectedColor);
  return <FlashTemplate data={mappedData} />;
}

export default function Page() {
  return (
    <ProjectGeneratorProvider>
      <FlashTemplateWithContext />
    </ProjectGeneratorProvider>
  );
}
