import { useState } from "react";
import Image from "next/image";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";
import ClientSectionPreview from "#/app/gerador-de-propostas/components/PreviewModal/Flash/ClientSectionPreview";
import type { CompleteProjectData } from "#/app/project/types/project";
import type { ProposalFormData } from "#/types/project";

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
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: null,
    // Add other required fields with default values
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

export default function ClientsPreview() {
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
              <ClientSectionPreview data={completeProjectData} />
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
        {!formData?.step6?.hideClientsSection && (
          <>
            <div className="w-full space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  {formData?.step6?.clientSubtitle}
                </h2>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-center flex-wrap gap-6">
                  {formData?.step6?.clients?.map((client) => (
                    <div key={client.id} className="p-4 text-center">
                      {client.logo && !client.hideLogo && (
                        <div className="w-32 h-16 mx-auto mb-4 rounded-lg overflow-hidden relative bg-white p-2">
                          <Image
                            src={client.logo}
                            alt={client.name}
                            fill
                            className="object-contain"
                            sizes="128px"
                          />
                        </div>
                      )}

                      {!client.hideClientName && (
                        <h3 className="text-lg font-semibold text-white-neutral-light-100">
                          {client.name}
                        </h3>
                      )}
                    </div>
                  ))}
                </div>

                {(!formData?.step6?.clients ||
                  formData.step6.clients.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum cliente adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step6?.hideClientsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Seus clientes&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
