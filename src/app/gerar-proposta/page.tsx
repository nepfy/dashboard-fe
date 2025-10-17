"use client";

import { toast, Slide } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Logo from "#/components/icons/Logo";

import { SelectTemplate } from "#/modules/ai-generator/components/generation-steps";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useProposalGenerator } from "./ProposalGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FinalStep } from "#/modules/ai-generator/components/generation-steps/FinalStep";
import { Loading } from "#/modules/ai-generator/components/loading/Loading";
import CloseIcon from "#/components/icons/CloseIcon";
import { SaveDraftButton } from "#/modules/ai-generator/components/save-draft";

export default function NepfyAIPage() {
  const { templateType, formData } = useProjectGenerator();
  const {
    currentStep,
    setCurrentStep,
    selectedService,
    setSelectedService,
    clientName,
    setClientName,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    detailedClientInfo,
    setDetailedClientInfo,
    companyInfo,
    setCompanyInfo,
    selectedPlan,
    setSelectedPlan,
    originalPageUrl,
    setOriginalPageUrl,
    pagePassword,
    setPagePassword,
    validUntil,
    setValidUntil,
    userName,
    isLoading,
    setIsLoading,
  } = useProposalGenerator();

  const router = useRouter();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGenerateProposal = async () => {
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription ||
      !originalPageUrl ||
      !pagePassword ||
      !validUntil
    ) {
      return;
    }

    setCurrentStep("final_step");

    try {
      setIsLoading(true);
      const response = await fetch("/api/projects/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedService,
          clientName,
          projectName,
          projectDescription,
          detailedClientInfo,
          companyInfo,
          selectedPlan,
          templateType,
          mainColor: formData.step1?.mainColor || null,
          originalPageUrl,
          pagePassword,
          validUntil,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Proposal generated successfully:", result.data);
        router.push(
          `/dashboard?success&project=${projectName}&projectId=${result.data.project.id}`
        );
      } else {
        console.error("Error generating proposal:", result.error);
        toast.error("Erro ao gerar proposta: " + result.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
          className: "font-satoshi",
        });
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error("Erro ao gerar proposta. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: "font-satoshi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-7">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <nav className="p-7 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo fill="#1C1A22" />

          <p
            className="hidden sm:block border border-white-neutral-light-300 rounded-2xs px-2 py-1 bg-white-neutral-light-200 text-xs sm:text-[16px]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                    45deg,
                    rgba(0,0,0,0.1) 0px,
                    rgba(0,0,0,0.1) 1px,
                    transparent 1px,
                    transparent 3px
                  )`,
            }}
          >
            Gerador de Proposta
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SaveDraftButton
            clientName={clientName}
            projectName={projectName}
            projectDescription={projectDescription}
            companyInfo={companyInfo}
          />
          <Link
            href="/dashboard"
            className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            <CloseIcon width="10" height="10" fill="#1C1A22" />
          </Link>
        </div>
      </nav>
      <div className="h-full">
        <div className="mx-auto h-full p-6">
          {(() => {
            const stepMap: Record<string, React.ReactNode> = {
              template_selection: (
                <div>
                  <SelectTemplate
                    handleNextStep={() => setCurrentStep("service_selection")}
                  />
                </div>
              ),
              service_selection: (
                <ServiceType
                  onServiceSelect={handleServiceSelect}
                  selectedService={selectedService}
                  handleBack={() => setCurrentStep("template_selection")}
                  handleNext={() => setCurrentStep("company_info")}
                />
              ),
              company_info: (
                <CompanyInfo
                  companyInfo={companyInfo}
                  setCompanyInfo={setCompanyInfo}
                  handleBack={() => setCurrentStep("service_selection")}
                  handleNext={() => setCurrentStep("client_details")}
                />
              ),
              client_details: (
                <ClientInfo
                  clientData={{
                    clientName,
                    projectName,
                    detailedClientInfo,
                    projectDescription,
                  }}
                  setClientData={({
                    clientName,
                    projectName,
                    projectDescription,
                    detailedClientInfo,
                  }) => {
                    setClientName(clientName);
                    setProjectName(projectName);
                    setProjectDescription(projectDescription);
                    setDetailedClientInfo(detailedClientInfo || "");
                  }}
                  handleBack={() => setCurrentStep("company_info")}
                  handleNext={() => setCurrentStep("pricing_step")}
                />
              ),
              pricing_step: (
                <PricingStep
                  selectedPlan={selectedPlan || 1}
                  handlePlanSelect={setSelectedPlan}
                  handleBack={() => setCurrentStep("client_details")}
                  handleNext={() => setCurrentStep("final_step")}
                />
              ),
              final_step: (
                <FinalStep
                  handleGenerateProposal={handleGenerateProposal}
                  handleBack={() => setCurrentStep("pricing_step")}
                  userName={userName}
                  step={currentStep}
                  originalPageUrl={originalPageUrl}
                  setOriginalPageUrl={setOriginalPageUrl}
                  pagePassword={pagePassword}
                  setPagePassword={setPagePassword}
                  validUntil={validUntil}
                  setValidUntil={setValidUntil}
                />
              ),
            };
            return stepMap[currentStep] || null;
          })()}
        </div>
      </div>
    </>
  );
}
