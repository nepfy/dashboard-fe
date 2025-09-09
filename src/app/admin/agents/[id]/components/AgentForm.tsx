"use client";

import { DatabaseAgentConfig } from "#/modules/ai-generator/agents/database-agents";

interface AgentFormProps {
  agent: DatabaseAgentConfig;
  onChange: (field: string, value: string | string[]) => void;
}

export default function AgentForm({ agent, onChange }: AgentFormProps) {
  const handleArrayAdd = (field: string, currentValue: string[]) => {
    onChange(field, [...currentValue, ""]);
  };

  const handleArrayRemove = (
    field: string,
    index: number,
    currentValue: string[]
  ) => {
    const newValue = currentValue.filter((_, i) => i !== index);
    onChange(field, newValue);
  };

  const handleArrayItemChange = (
    field: string,
    index: number,
    value: string,
    currentValue: string[]
  ) => {
    const newValue = [...currentValue];
    newValue[index] = value;
    onChange(field, newValue);
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Informações Básicas
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do Agente
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={agent.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="sector"
                className="block text-sm font-medium text-gray-700"
              >
                Setor
              </label>
              <input
                type="text"
                name="sector"
                id="sector"
                value={agent.sector}
                onChange={(e) => onChange("sector", e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="pricingModel"
              className="block text-sm font-medium text-gray-700"
            >
              Modelo de Preços
            </label>
            <select
              name="pricingModel"
              id="pricingModel"
              value={agent.pricingModel}
              onChange={(e) => onChange("pricingModel", e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="fixed">Preço Fixo</option>
              <option value="hourly">Por Hora</option>
              <option value="project">Por Projeto</option>
              <option value="retainer">Retainer</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Prompt
          </h3>
          <div>
            <label
              htmlFor="systemPrompt"
              className="block text-sm font-medium text-gray-700"
            >
              Prompt do Sistema
            </label>
            <textarea
              name="systemPrompt"
              id="systemPrompt"
              rows={12}
              value={agent.systemPrompt}
              onChange={(e) => onChange("systemPrompt", e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono text-sm"
              placeholder="Digite o prompt do sistema aqui..."
            />
            <p className="mt-2 text-sm text-gray-500">
              {agent.systemPrompt.length} caracteres
            </p>
          </div>
        </div>
      </div>

      {/* Expertise */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Expertise
            </h3>
            <button
              type="button"
              onClick={() => handleArrayAdd("expertise", agent.expertise || [])}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {(agent.expertise || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "expertise",
                      index,
                      e.target.value,
                      agent.expertise || []
                    )
                  }
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite uma expertise..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayRemove("expertise", index, agent.expertise || [])
                  }
                  className="inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Serviços Comuns */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Serviços Comuns
            </h3>
            <button
              type="button"
              onClick={() =>
                handleArrayAdd("commonServices", agent.commonServices || [])
              }
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {(agent.commonServices || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "commonServices",
                      index,
                      e.target.value,
                      agent.commonServices || []
                    )
                  }
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite um serviço..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayRemove(
                      "commonServices",
                      index,
                      agent.commonServices || []
                    )
                  }
                  className="inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estrutura da Proposta */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Estrutura da Proposta
            </h3>
            <button
              type="button"
              onClick={() =>
                handleArrayAdd(
                  "proposalStructure",
                  agent.proposalStructure || []
                )
              }
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {(agent.proposalStructure || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "proposalStructure",
                      index,
                      e.target.value,
                      agent.proposalStructure || []
                    )
                  }
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite uma etapa da proposta..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayRemove(
                      "proposalStructure",
                      index,
                      agent.proposalStructure || []
                    )
                  }
                  className="inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Termos-chave */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Termos-chave
            </h3>
            <button
              type="button"
              onClick={() => handleArrayAdd("keyTerms", agent.keyTerms || [])}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {(agent.keyTerms || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "keyTerms",
                      index,
                      e.target.value,
                      agent.keyTerms || []
                    )
                  }
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite um termo-chave..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayRemove("keyTerms", index, agent.keyTerms || [])
                  }
                  className="inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
