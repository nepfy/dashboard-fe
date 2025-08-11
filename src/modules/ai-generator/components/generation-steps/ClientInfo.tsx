import Pagination from "#/components/Pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepPagination } from "../pagination";

export function ClientInfo({
  clientName,
  setClientName,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  steps,
  currentStep,
  handleNextStep,
  handlePreviousStep,
  setCurrentStep,
}: {
  clientName: string;
  setClientName: (clientName: string) => void;
  projectName: string;
  setProjectName: (projectName: string) => void;
  projectDescription: string;
  setProjectDescription: (projectDescription: string) => void;
  steps: string[];
  currentStep: string;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  setCurrentStep: (step: string) => void;
}) {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full">
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

          <StepPagination
            steps={steps}
            currentStep={currentStep}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        </div>
      </div>
    </section>
  );
}
