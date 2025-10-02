"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { SelectTemplate } from "#/modules/ai-generator/components/generation-steps";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FinalStep } from "#/modules/ai-generator/components/generation-steps/FinalStep";

export default function NepfyAIPage() {
  const searchParams = useSearchParams();
  const {
    templateType,
    formData,
    updateFormData,
    setTemplateType,
    loadProjectData,
  } = useProjectGenerator();

  const [currentStep, setCurrentStep] = useState<string>("template_selection");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [hasLoadedEdit, setHasLoadedEdit] = useState(false);

  // Load project data for editing
  useEffect(() => {
    const editId = searchParams?.get("editId");

    if (!editId || hasLoadedEdit) {
      return;
    }

    console.log("Debug - Loading project for editing:", editId);

    const loadEditData = async () => {
      try {
        setIsLoadingEdit(true);

        const response = await fetch(`/api/projects/${editId}`);
        const result = await response.json();

        if (result.success) {
          const projectData = result.data;

          // Set project ID
          setCurrentProjectId(editId);

          // Load data into form
          if (projectData.clientName) setClientName(projectData.clientName);
          if (projectData.projectName) setProjectName(projectData.projectName);
          if (projectData.projectDescription)
            setProjectDescription(projectData.projectDescription);
          if (projectData.companyName) setCompanyInfo(projectData.companyName);
          if (projectData.templateType)
            setTemplateType(projectData.templateType);
          if (projectData.mainColor) {
            updateFormData("step1", { mainColor: projectData.mainColor });
          }

          // Load into ProjectGenerator context
          loadProjectData(projectData);

          setHasLoadedEdit(true);
          setIsEditMode(true);

          // Go to FAQ step for regeneration if we have data
          if (projectData.templateType) {
            setCurrentStep("faq_step");
          }
        } else {
          console.error("Erro ao carregar dados da proposta:", result.error);
          setIsLoadingEdit(false);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da proposta:", error);
        setIsLoadingEdit(false);
      }
    };

    loadEditData();
  }, [
    searchParams,
    hasLoadedEdit,
    loadProjectData,
    setTemplateType,
    updateFormData,
  ]);

  // No need to track changes for edit mode - just allow regeneration

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGenerateProposal = async () => {
    console.log("Debug - handleGenerateProposal validation:", {
      selectedService: !!selectedService,
      clientName: !!clientName,
      projectName: !!projectName,
      projectDescription: !!projectDescription,
      clientDescription: !!clientDescription,
      clientNameValue: clientName,
      projectNameValue: projectName,
    });

    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      console.log("Debug - Validation failed in handleGenerateProposal");
      return;
    }

    setCurrentStep("final_step");

    console.log({
      selectedService,
      clientName,
      projectName,
      projectDescription,
      clientDescription,
      companyInfo,
      selectedPlan,
      templateType,
      mainColor: formData.step1?.mainColor || null,
    });

    try {
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
          clientDescription,
          companyInfo,
          selectedPlan,
          templateType,
          mainColor: formData.step1?.mainColor || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Proposal generated successfully:", result.data);
      } else {
        console.error("Error generating proposal:", result.error);
        alert("Erro ao gerar proposta: " + result.error);
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      alert("Erro ao gerar proposta. Tente novamente.");
    } finally {
    }
  };

  // Show loading state for edit mode
  if (isLoadingEdit) {
    return (
      <div className="bg-gray-50 flex flex-1 items-center justify-center min-h-[calc(100vh-250px)]">
        <div className="mx-auto p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto para edição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mx-auto h-full p-6">
        {/* Header for edit mode */}
        {isEditMode && currentProjectId && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              ✏️ Editando Proposta
            </h1>
            <p className="text-gray-600 text-sm">
              Cliente: <span className="font-medium">{clientName}</span> |
              Projeto: <span className="font-medium">{projectName}</span>
            </p>
          </div>
        )}

        {/* Conteúdo das Etapas */}
        {(() => {
          const stepMap: Record<string, React.ReactNode> = {
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
                  projectName,
                  projectDescription,
                  clientName,
                  detailedClientInfo: clientDescription,
                }}
                setClientData={({
                  clientName,
                  projectName,
                  projectDescription,
                  detailedClientInfo,
                }) => {
                  console.log("Debug - setClientData called with:", {
                    clientName,
                    projectName,
                    projectDescription,
                    detailedClientInfo,
                  });
                  setClientName(clientName);
                  setProjectName(projectName);
                  setProjectDescription(projectDescription);
                  setClientDescription(clientDescription);
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
              <div>
                <FinalStep
                  handleGenerateProposal={handleGenerateProposal}
                  handleBack={() => setCurrentStep("pricing_step")}
                  userName="usuário"
                  step={currentStep}
                />
              </div>
            ),
          };
          return stepMap[currentStep] || null;
        })()}
      </div>
    </div>
  );
}
