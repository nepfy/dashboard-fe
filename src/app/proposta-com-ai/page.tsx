"use client";

import { useState } from "react";

import {
  StartProposal,
  SelectTemplate,
} from "#/modules/ai-generator/components/generation-steps";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { GenerateProposal } from "#/modules/ai-generator/components/generation-steps/GenerateProposal";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FAQStep } from "#/modules/ai-generator/components/generation-steps/FAQ";

export default function NepfyAIPage() {
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<
    Record<string, unknown> | null | undefined
  >(null);

  const { updateFormData, setTemplateType, templateType, formData } =
    useProjectGenerator();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGenerateProposal = async ({
    includeTerms,
    includeFAQ,
  }: {
    includeTerms: boolean;
    includeFAQ: boolean;
  }) => {
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      return;
    }

    setIsGenerating(true);
    setCurrentStep("generated_proposal");

    console.log({
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      selectedPlan,
      includeTerms,
      includeFAQ,
      templateType,
      mainColor: formData.step1?.mainColor || null,
    });

    try {
      const response = await fetch("/api/gerador-de-propostas-ia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedService,
          clientName,
          projectName,
          projectDescription,
          companyInfo,
          selectedPlan,
          includeTerms,
          includeFAQ,
          templateType,
          mainColor: formData.step1?.mainColor || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedProposal(result.data);
      } else {
        console.error("Error generating proposal:", result.error);
        alert("Erro ao gerar proposta: " + result.error);
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      alert("Erro ao gerar proposta. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {(() => {
        const stepMap: Record<string, React.ReactNode> = {
          start: (
            <StartProposal
              handleNextStep={() => setCurrentStep("template_selection")}
            />
          ),
          template_selection: (
            <SelectTemplate
              handleNextStep={() => setCurrentStep("service_selection")}
            />
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
                companyName: formData.step1?.companyName || "",
                projectName,
                projectDescription,
                clientName,
              }}
              setClientData={({
                clientName,
                projectName,
                projectDescription,
              }) => {
                setClientName(clientName);
                setProjectName(projectName);
                setProjectDescription(projectDescription);
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
              handleNext={() => setCurrentStep("faq_step")}
            />
          ),
          faq_step: (
            <FAQStep
              handleNext={({ includeTerms, includeFAQ }) => {
                handleGenerateProposal({ includeTerms, includeFAQ });
              }}
              handleBack={() => setCurrentStep("pricing_step")}
            />
          ),
          generated_proposal: (
            <GenerateProposal
              isGenerating={isGenerating}
              generatedProposal={generatedProposal}
              setCurrentStep={setCurrentStep}
            />
          ),
        };
        return stepMap[currentStep] || null;
      })()}
    </>
  );
}
