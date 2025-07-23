import { useState } from "react";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";
import ExpertiseSectionPreview from "#/app/gerador-de-propostas/components/PreviewModal/Flash/ExpertiseSectionPreview";
import type { CompleteProjectData } from "#/app/project/types/project";
import type { ProposalFormData } from "#/types/project";

import DiamondIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/DiamondIcon";
import CircleIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CircleIcon";
import BubblesIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BubblesIcon";
import ClockIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/ClockIcon";
import GearIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/GearIcon";
import HexagonalIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/HexagonalIcon";
import SwitchIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/SwitchIcon";
import ThunderIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/ThunderIcon";
import GlobeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/GlobeIcon";
import BellIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BellIcon";
import BulbIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BulbIcon";
import StarIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/StarIcon";
import HeartIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/HeartIcon";
import AwardIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/AwardIcon";
import CrownIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CrownIcon";
import KeyIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/KeyIcon";
import EyeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/EyeIcon";
import FolderIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/FolderIcon";
import PlayIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/PlayIcon";
import CubeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CubeIcon";

const iconMap = {
  DiamondIcon: <DiamondIcon />,
  CircleIcon: <CircleIcon />,
  BubblesIcon: <BubblesIcon />,
  ClockIcon: <ClockIcon />,
  GearIcon: <GearIcon />,
  HexagonalIcon: <HexagonalIcon />,
  SwitchIcon: <SwitchIcon />,
  ThunderIcon: <ThunderIcon />,
  GlobeIcon: <GlobeIcon />,
  BellIcon: <BellIcon />,
  BulbIcon: <BulbIcon />,
  StarIcon: <StarIcon />,
  HeartIcon: <HeartIcon />,
  AwardIcon: <AwardIcon />,
  CrownIcon: <CrownIcon />,
  KeyIcon: <KeyIcon />,
  EyeIcon: <EyeIcon />,
  FolderIcon: <FolderIcon />,
  PlayIcon: <PlayIcon />,
  CubeIcon: <CubeIcon />,
};

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
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    // Add other required fields with default values
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

export default function ExpertisePreview() {
  const { formData, templateType } = useProjectGenerator();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const completeProjectData = convertFormDataToCompleteProjectData(formData);

  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  // If Flash template is selected, render the Flash template section
  if (templateType === "flash") {
    return (
      <>
        <TemplatePreviewWrapper>
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <ExpertiseSectionPreview data={completeProjectData} />
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
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step4?.hideExpertiseSection && (
          <>
            <div className="w-full space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  {formData?.step4?.expertiseSubtitle}
                </h2>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-center flex-wrap gap-2">
                  {formData?.step4?.expertise?.map((item) => (
                    <div key={item.id} className="p-6 text-center w-[200px]">
                      {item.icon && !item.hideExpertiseIcon && (
                        <div className="flex justify-center mb-4">
                          <div className="w-8 h-8 rounded-2xs p-0 flex items-center justify-center bg-white-neutral-light-100">
                            {typeof item.icon === "string"
                              ? renderIcon(item.icon)
                              : item.icon}
                          </div>
                        </div>
                      )}

                      <h3 className="text-xl font-semibold text-white-neutral-light-100 mb-3">
                        {item.title}
                      </h3>

                      <p className="text-white-neutral-light-200 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {(!formData?.step4?.expertise ||
                  formData.step4.expertise.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhuma especialização adicionada ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step4?.hideExpertiseSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Suas especialidades&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
