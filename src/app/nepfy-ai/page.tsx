"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Eye,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Palette,
  Monitor,
  Ruler,
  Camera,
  Heart,
  Loader2,
} from "lucide-react";
import {
  StartProposal,
  SelectTemplate,
} from "#/modules/ai-generator/components/generation-steps";
import { StepIndicator } from "#/components/StepIndicator";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { GeneratedProposal } from "#/modules/ai-generator/components/generation-steps/GeneratedProposal";

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const STEPS = [
  "service_selection",
  "client_details",
  "company_info",
  "generated_proposal",
];

export default function NepfyAIPage() {
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [planDetails, setPlanDetails] = useState("");
  const [includeTerms, setIncludeTerms] = useState(false);
  const [includeFAQ, setIncludeFAQ] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const {
    updateFormData,
    setTemplateType,
    templateType,
    loadProjectData,
    formData,
  } = useProjectGenerator();

  const handleTemplateSelect = (template: TemplateType, color: string) => {
    setTemplateType(template);
    updateFormData("step1", {
      templateType: template,
      mainColor: color,
    });
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGenerateProposal = async () => {
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai", {
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
          selectedPlans,
          planDetails,
          includeTerms,
          includeFAQ,
          templateType,
          mainColor: formData.step1?.mainColor || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedProposal(result.data);
        setCurrentStep(6); // Go to results step
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
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen relative">
        {currentStep === "start" && (
          <StartProposal
            handleNextStep={() => setCurrentStep("template_selection")}
          />
        )}
        {currentStep === "template_selection" && (
          <SelectTemplate
            handleNextStep={() => setCurrentStep("service_selection")}
            handlePreviousStep={() => setCurrentStep("start")}
            onSelectTemplate={handleTemplateSelect}
          />
        )}
        {currentStep === "service_selection" && (
          <ServiceType
            steps={STEPS}
            currentStep={currentStep}
            handleNextStep={() => setCurrentStep("client_details")}
            handlePreviousStep={() => setCurrentStep("template_selection")}
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        )}
        {currentStep === "client_details" && (
          <ClientInfo
            steps={STEPS}
            currentStep={currentStep}
            handleNextStep={() => setCurrentStep("company_info")}
            handlePreviousStep={() => setCurrentStep("service_selection")}
            setCurrentStep={setCurrentStep}
            clientName={clientName}
            setClientName={setClientName}
            projectName={projectName}
            setProjectName={setProjectName}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
          />
        )}
        {currentStep === "company_info" && (
          <CompanyInfo
            steps={STEPS}
            currentStep={currentStep}
            handleNextStep={() => setCurrentStep("company_info")}
            handlePreviousStep={() => setCurrentStep("client_details")}
            setCurrentStep={setCurrentStep}
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
            selectedPlans={selectedPlans}
            setSelectedPlans={setSelectedPlans}
            planDetails={planDetails}
            setPlanDetails={setPlanDetails}
          />
        )}
        {currentStep === "generated_proposal" && (
          <GeneratedProposal
            generatedProposal={generatedProposal}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>
    </>
  );
}
