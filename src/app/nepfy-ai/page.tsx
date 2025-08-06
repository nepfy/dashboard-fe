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

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: "marketing-digital",
    title: "Marketing digital",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    id: "designer",
    title: "Designer",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    id: "desenvolvedor",
    title: "Desenvolvedor",
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    id: "arquiteto",
    title: "Arquiteto",
    icon: <Ruler className="w-6 h-6" />,
  },
  {
    id: "fotografo",
    title: "Fotógrafo",
    icon: <Camera className="w-6 h-6" />,
  },
  {
    id: "medicos",
    title: "Médicos",
    icon: <Heart className="w-6 h-6" />,
  },
];

export default function NepfyAIPage() {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Step 4: Client and project details form
  const renderStep4 = () => (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      {/* Stepper Indicator */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <span className="text-sm text-gray-500">Criar Proposta</span>
        </div>
        <div className="w-8 h-0.5 bg-purple-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <span className="text-sm text-gray-500">Escolher Modelo</span>
        </div>
        <div className="w-8 h-0.5 bg-purple-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <span className="text-sm text-gray-500">Configurar</span>
        </div>
        <div className="w-8 h-0.5 bg-purple-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            4
          </div>
          <span className="text-sm font-medium text-gray-900">Cliente</span>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-purple-600 mb-2">
              Sobre seu cliente
            </h1>
            <p className="text-gray-600 text-lg">
              Nome, área de atuação e no que a empresa é especializada.
            </p>
          </div>

          <div className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do cliente
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Loja XYZ"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do projeto
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Site institucional da Loja XYZ (para você identificar essa proposta no seu painel de gerenciamento)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Projeto
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Quanto mais detalhes você der, mais personalizada fica a proposta!"
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              disabled={!clientName.trim() || !projectName.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                clientName.trim() && projectName.trim()
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Step 5: Company information and plans
  const renderStep5 = () => (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-purple-600 mb-2">
              Sobre sua empresa
            </h1>
            <p className="text-gray-600 text-lg">
              Informações da sua empresa e planos oferecidos.
            </p>
          </div>

          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informações da sua empresa
              </label>
              <textarea
                value={companyInfo}
                onChange={(e) => setCompanyInfo(e.target.value)}
                placeholder="Descreva sua empresa, experiência, especialidades e diferenciais..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Plans Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planos oferecidos
              </label>
              <div className="space-y-2">
                {["basic", "premium", "complete"].map((plan) => (
                  <label key={plan} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPlans.includes(plan)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlans([...selectedPlans, plan]);
                        } else {
                          setSelectedPlans(
                            selectedPlans.filter((p) => p !== plan)
                          );
                        }
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {plan}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Plan Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalhes dos planos
              </label>
              <textarea
                value={planDetails}
                onChange={(e) => setPlanDetails(e.target.value)}
                placeholder="Descreva o que está incluído em cada plano..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeTerms}
                  onChange={(e) => setIncludeTerms(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  Incluir termos e condições
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeFAQ}
                  onChange={(e) => setIncludeFAQ(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Incluir FAQ</span>
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={handleGenerateProposal}
              disabled={
                isGenerating || !clientName.trim() || !projectName.trim()
              }
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isGenerating || !clientName.trim() || !projectName.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando proposta...
                </>
              ) : (
                <>
                  Gerar Proposta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Step 6: Generated proposal results
  const renderStep6 = () => (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-purple-600 mb-2">
              Proposta Gerada com Sucesso!
            </h1>
            <p className="text-gray-600 text-lg">
              Sua proposta foi criada usando IA especializada.
            </p>
          </div>

          {generatedProposal && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {generatedProposal.finalProposal.title}
                </h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {generatedProposal.finalProposal.content}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Investimento
                  </h4>
                  <div className="text-blue-700">
                    {generatedProposal.finalProposal.pricing}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Cronograma
                  </h4>
                  <div className="text-green-700">
                    {generatedProposal.finalProposal.timeline}
                  </div>
                </div>
              </div>

              {generatedProposal.finalProposal.terms && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Termos e Condições
                  </h4>
                  <div className="text-yellow-700">
                    {generatedProposal.finalProposal.terms}
                  </div>
                </div>
              )}

              {generatedProposal.finalProposal.faq && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">FAQ</h4>
                  <div className="text-purple-700">
                    {generatedProposal.finalProposal.faq}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              Nova Proposta
            </button>
            <button
              onClick={() => {
                // Here you could save to the project generator or export
                console.log("Save proposal:", generatedProposal);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              Salvar Proposta
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen relative">
        {currentStep === 1 && (
          <StartProposal handleNextStep={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <SelectTemplate
            setCurrentStep={setCurrentStep}
            onSelectTemplate={handleTemplateSelect}
          />
        )}
        {currentStep === 3 && (
          <ServiceType
            services={services}
            setCurrentStep={setCurrentStep}
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        )}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </div>

      {/* Floating Continue Button */}
      {showContinueButton && (
        <button
          onClick={handleContinueClick}
          disabled={!isContinueEnabled()}
          className={`fixed bottom-10 right-10 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg z-50 transform hover:scale-105 ${
            isContinueEnabled()
              ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          {getContinueButtonText()}
        </button>
      )}
    </>
  );
}
