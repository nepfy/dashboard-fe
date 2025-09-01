"use client";

import { useState } from "react";

import {
  StartProposal,
  SelectTemplate,
} from "#/modules/ai-generator/components/generation-steps";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { GenerateProposal } from "#/modules/ai-generator/components/generation-steps/GenerateProposal";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FAQStep } from "#/modules/ai-generator/components/generation-steps/FAQ";

// Componente para mostrar o resumo dos dados
function DataSummary({
  selectedService,
  clientName,
  projectName,
  projectDescription,
  companyInfo,
  selectedPlan,
}: {
  selectedService: string | null;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo: string;
  selectedPlan: number | null;
}) {
  if (
    !selectedService &&
    !clientName &&
    !projectName &&
    !projectDescription &&
    !companyInfo
  ) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-800 mb-2">
        📋 Resumo dos Dados
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {selectedService && (
          <div>
            <span className="font-medium text-blue-700">Serviço:</span>{" "}
            {selectedService}
          </div>
        )}
        {clientName && (
          <div>
            <span className="font-medium text-blue-700">Cliente:</span>{" "}
            {clientName}
          </div>
        )}
        {projectName && (
          <div>
            <span className="font-medium text-blue-700">Projeto:</span>{" "}
            {projectName}
          </div>
        )}
        {projectDescription && (
          <div>
            <span className="font-medium text-blue-700">Descrição:</span>{" "}
            {projectDescription.substring(0, 50)}...
          </div>
        )}
        {companyInfo && (
          <div>
            <span className="font-medium text-blue-700">Empresa:</span>{" "}
            {companyInfo}
          </div>
        )}
        {selectedPlan && (
          <div>
            <span className="font-medium text-blue-700">Plano:</span>{" "}
            {selectedPlan}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar o progresso das etapas
function StepProgress({ currentStep }: { currentStep: string }) {
  const steps = [
    { key: "start", label: "Início", icon: "🚀" },
    { key: "template_selection", label: "Template", icon: "🎨" },
    { key: "service_selection", label: "Serviço", icon: "⚙️" },
    { key: "company_info", label: "Empresa", icon: "🏢" },
    { key: "client_details", label: "Cliente", icon: "👤" },
    { key: "pricing_step", label: "Preços", icon: "💰" },
    { key: "faq_step", label: "Configurações", icon: "⚙️" },
    { key: "generated_proposal", label: "Proposta", icon: "📄" },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">
          Progresso da Geração
        </h2>
        <span className="text-sm text-gray-500">
          Etapa {currentIndex + 1} de {steps.length}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index <= currentIndex
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentIndex ? "✓" : step.icon}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 ${
                  index < currentIndex ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600">
          {steps[currentIndex]?.label}
        </span>
      </div>
    </div>
  );
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  const { templateType, formData } = useProjectGenerator();

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
          companyInfo,
          templateType: templateType || "flash",
          mainColor: formData.step1?.mainColor || "#3B82F6",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveMessage("✅ Proposta salva com sucesso! ID: " + result.data.id);
        // Opcional: redirecionar para o dashboard ou mostrar link para editar
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

  return (
    <div className="bg-gray-50 flex flex-1 items-center justify-center min-h-[calc(100vh-250px)]">
      <div className="mx-auto p-6">
        {/* Conteúdo das Etapas */}
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
                handleBack={() => setCurrentStep("start")}
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
                  console.log("Debug - setClientData called with:", {
                    clientName,
                    projectName,
                    projectDescription,
                  });
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
              <div className="bg-white rounded-lg shadow-sm  p-6">
                <FAQStep
                  handleNext={({ includeTerms, includeFAQ }) => {
                    handleGenerateProposal({ includeTerms, includeFAQ });
                  }}
                  handleBack={() => setCurrentStep("pricing_step")}
                />
              </div>
            ),
            generated_proposal: (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <GenerateProposal
                  isGenerating={isGenerating}
                  generatedProposal={generatedProposal}
                />

                {/* Botões de Ação */}
                {generatedProposal && !isGenerating && (
                  <div className="flex flex-col items-center gap-4 mt-6">
                    {/* Botão de Salvar */}
                    <button
                      onClick={handleSaveProposal}
                      disabled={isSaving}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? "Salvando..." : "💾 Salvar Proposta"}
                    </button>

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

                      <button
                        onClick={handleEditPrompt}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        ✏️ Editar Dados do Prompt
                      </button>
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
    </div>
  );
}
