import Pagination from "#/components/Pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { StepPagination } from "../pagination";

export function CompanyInfo({
  companyInfo,
  setCompanyInfo,
  selectedPlans,
  setSelectedPlans,
  planDetails,
  setPlanDetails,
  steps,
  currentStep,
  handleNextStep,
  handlePreviousStep,
  setCurrentStep,
}: {
  companyInfo: string;
  setCompanyInfo: (companyInfo: string) => void;
  selectedPlans: string[];
  setSelectedPlans: (selectedPlans: string[]) => void;
  planDetails: string;
  setPlanDetails: (planDetails: string) => void;
  steps: string[];
  currentStep: string;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  setCurrentStep: (step: string) => void;
}) {
  const [includeTerms, setIncludeTerms] = useState(false);
  const [includeFAQ, setIncludeFAQ] = useState(false);

  return (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full">
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

          <StepPagination
            steps={steps}
            currentStep={currentStep || "start"}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep("generated_proposal")}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            {/* <button
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
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
