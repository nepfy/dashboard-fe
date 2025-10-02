"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { SelectTemplate } from "#/modules/ai-generator/components/generation-steps";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { GenerateProposal } from "#/modules/ai-generator/components/generation-steps/GenerateProposal";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FAQStep } from "#/modules/ai-generator/components/generation-steps/FAQ";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";

// Componente para mostrar o resumo dos dados (não usado no modo de edição)

// Componente para mostrar o progresso das etapas (não usado no modo de edição)

export default function NepfyAIPage() {
  const searchParams = useSearchParams();
  const {
    templateType,
    formData,
    updateFormData,
    setTemplateType,
    loadProjectData,
  } = useProjectGenerator();

  const [currentStep, setCurrentStep] = useState<string>("start");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<
    Record<string, unknown> | null | undefined
  >(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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

  const handleGenerateProposal = async ({
    includeTerms,
    includeFAQ,
  }: {
    includeTerms: boolean;
    includeFAQ: boolean;
  }) => {
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

    setIsGenerating(true);
    setCurrentStep("generated_proposal");

    console.log({
      selectedService,
      clientName,
      projectName,
      projectDescription,
      clientDescription,
      companyInfo,
      selectedPlan,
      includeTerms,
      includeFAQ,
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

  const handleSaveProposal = async () => {
    if (!generatedProposal) {
      setSaveMessage("Nenhuma proposta para salvar");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

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
          templateType: templateType || "flash",
          mainColor: formData.step1?.mainColor || "#3B82F6",
        }),
      });

      const result = await response.json();
      console.log("result", result);

      if (result.success) {
        setSaveMessage(
          "✅ Proposta salva com sucesso! ID: " + result?.metadata?.projectId
        );
        // Set project ID for edit mode
        setCurrentProjectId(result.data.id);
        setIsEditMode(true);
      } else {
        setSaveMessage("❌ Erro ao salvar: " + result.error);
      }
    } catch (error) {
      console.error("Error saving proposal:", error);
      setSaveMessage("❌ Erro ao salvar proposta. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit mode functions - simplified for regeneration flow
  const handleEdit = () => {
    setIsEditMode(true);
    setCurrentStep("faq_step");
  };

  const handleSaveChanges = async () => {
    if (!currentProjectId) {
      setSaveMessage("❌ Nenhum projeto para salvar");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch(`/api/projects/${currentProjectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          projectName,
          projectDescription,
          clientDescription,
          companyName: companyInfo,
          templateType,
          mainColor: formData.step1?.mainColor || "#3B82F6",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveMessage("✅ Alterações salvas com sucesso!");
        // Go to FAQ step to regenerate proposal
        setCurrentStep("faq_step");
      } else {
        setSaveMessage("❌ Erro ao salvar: " + result.error);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      setSaveMessage("❌ Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Go back to generated proposal view
    setCurrentStep("generated_proposal");
  };

  const handleEditPrompt = () => {
    // Volta para a primeira etapa para editar os dados
    setCurrentStep("start");
    setGeneratedProposal(null);
    setSaveMessage("");
  };

  const handleRegenerateProposal = () => {
    // Volta para a etapa de FAQ para regenerar com os mesmos dados
    setCurrentStep("faq_step");
    setGeneratedProposal(null);
    setSaveMessage("");
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
    <div className="bg-gray-50 flex flex-1 items-center justify-center min-h-[calc(100vh-250px)]">
      <div className="mx-auto p-6">
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
                  clientName,
                  projectName,
                  projectDescription,
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
                  setClientDescription(detailedClientInfo || "");
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
              <div>
                <FAQStep
                  handleNext={({ includeTerms, includeFAQ }) => {
                    handleGenerateProposal({ includeTerms, includeFAQ });
                  }}
                  handleBack={() => setCurrentStep("pricing_step")}
                />

                {/* Show edit mode info */}
                {isEditMode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      ✏️ Modo de Edição
                    </h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Você está editando a proposta:{" "}
                      <strong>{projectName}</strong> para{" "}
                      <strong>{clientName}</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Clique em &quot;Gerar Proposta&quot; para re-gerar com os
                      dados atualizados.
                    </p>
                    {currentProjectId && (
                      <p className="text-xs text-blue-600 mt-2">
                        ID do Projeto: {currentProjectId}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ),
            generated_proposal: (
              <div className="">
                <GenerateProposal
                  isGenerating={isGenerating}
                  generatedProposal={generatedProposal}
                />

                {/* Botões de Ação */}
                {generatedProposal && !isGenerating && (
                  <div className="flex flex-col items-center gap-4 mt-6">
                    {/* Botão de Salvar (only for new proposals) */}
                    {!isEditMode && (
                      <button
                        onClick={handleSaveProposal}
                        disabled={isSaving}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSaving ? "Salvando..." : "💾 Salvar Proposta"}
                      </button>
                    )}

                    {/* Mensagem de Status */}
                    {saveMessage && (
                      <div
                        className={`text-sm ${
                          saveMessage.includes("✅")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {saveMessage}
                      </div>
                    )}

                    {/* Botões de Edição */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={handleRegenerateProposal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🔄 Regenerar Proposta
                      </button>

                      {!isEditMode ? (
                        <button
                          onClick={handleEditPrompt}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          ✏️ Editar Dados do Prompt
                        </button>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          ✏️ Editar Dados
                        </button>
                      )}
                    </div>

                    {/* Botão para Nova Proposta */}
                    <button
                      onClick={() => {
                        setCurrentStep("start");
                        setGeneratedProposal(null);
                        setSaveMessage("");
                        setSelectedService(null);
                        setClientName("");
                        setProjectName("");
                        setProjectDescription("");
                        setCompanyInfo("");
                        setSelectedPlan(null);
                        setIsEditMode(false);
                        setCurrentProjectId(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Nova Proposta
                    </button>
                  </div>
                )}
              </div>
            ),
          };
          return stepMap[currentStep] || null;
        })()}
      </div>

      {/* Edit Save Bottom Bar for edit mode */}
      {isEditMode && currentProjectId && (
        <EditSaveBottomBar
          isEditing={isEditMode}
          onEdit={handleEdit}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
          isLoading={isSaving}
          hasChanges={false} // Always allow saving in edit mode
        />
      )}
    </div>
  );
}
