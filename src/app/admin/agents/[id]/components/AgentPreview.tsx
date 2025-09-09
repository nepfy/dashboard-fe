"use client";

import { DatabaseAgentConfig } from "#/modules/ai-generator/agents/database-agents";

interface AgentPreviewProps {
  agent: DatabaseAgentConfig;
}

export default function AgentPreview({ agent }: AgentPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Preview do Agente
          </h3>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Nome</h4>
              <p className="mt-1 text-sm text-gray-900">{agent.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Setor</h4>
              <p className="mt-1 text-sm text-gray-900">{agent.sector}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">ID</h4>
              <p className="mt-1 text-sm text-gray-900 font-mono">{agent.id}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Modelo de Preços
              </h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {agent.pricingModel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompt Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Prompt
          </h3>
          <div className="bg-gray-50 rounded-md p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {agent.systemPrompt}
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {agent.systemPrompt.length} caracteres
          </p>
        </div>
      </div>

      {/* Expertise Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Expertise ({agent.expertise?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2">
            {(agent.expertise || []).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Serviços Comuns Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Serviços Comuns ({agent.commonServices?.length || 0})
          </h3>
          <ul className="space-y-2">
            {(agent.commonServices || []).map((item, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Estrutura da Proposta Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Estrutura da Proposta ({agent.proposalStructure?.length || 0})
          </h3>
          <ol className="space-y-2">
            {(agent.proposalStructure || []).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="ml-3 text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Termos-chave Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Termos-chave ({agent.keyTerms?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2">
            {(agent.keyTerms || []).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Configurações Específicas do Template */}
      {agent.flashSpecific && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Configurações Flash
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Estilo de Introdução
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.flashSpecific.introductionStyle}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Foco Sobre Nós
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.flashSpecific.aboutUsFocus}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Abordagem de Especialidades
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.flashSpecific.specialtiesApproach}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Ênfase do Processo
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.flashSpecific.processEmphasis}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Estratégia de Investimento
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.flashSpecific.investmentStrategy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {agent.primeSpecific && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Configurações Prime
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Estilo de Introdução
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.primeSpecific.introductionStyle}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Foco Sobre Nós
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.primeSpecific.aboutUsFocus}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Abordagem de Especialidades
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.primeSpecific.specialtiesApproach}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Ênfase do Processo
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.primeSpecific.processEmphasis}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Estratégia de Investimento
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {agent.primeSpecific.investmentStrategy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
