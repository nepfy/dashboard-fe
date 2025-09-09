"use client";

import { useState } from "react";
import { BaseAgentConfig } from "#/modules/ai-generator/agents/base/types";

interface AgentsTabsProps {
  agents: Record<string, BaseAgentConfig>;
  loading: boolean;
  error: string | null;
}

interface TabData {
  id: string;
  name: string;
  count: number;
  agents: BaseAgentConfig[];
  color: string;
  description: string;
}

export default function AgentsTabs({ agents, loading, error }: AgentsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("flash");

  // Group agents by template
  const tabs: TabData[] = [
    {
      id: "flash",
      name: "Flash",
      count: 0,
      agents: [],
      color: "bg-blue-500",
      description: "Agentes rápidos e eficientes para propostas ágeis",
    },
    {
      id: "prime",
      name: "Prime",
      count: 0,
      agents: [],
      color: "bg-purple-500",
      description: "Agentes premium com metodologia avançada",
    },
    {
      id: "base",
      name: "Base",
      count: 0,
      agents: [],
      color: "bg-gray-500",
      description: "Agentes base para funcionalidades essenciais",
    },
  ];

  // Process agents and group by template
  const processedTabs = tabs.map((tab) => {
    const tabAgents = Object.values(agents).filter((agent) =>
      agent.id.includes(tab.id)
    );
    return {
      ...tab,
      count: tabAgents.length,
      agents: tabAgents,
    };
  });

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar agentes
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTabData = processedTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {processedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <div
                className={`w-3 h-3 rounded-full ${tab.color} ${
                  activeTab === tab.id ? "opacity-100" : "opacity-60"
                }`}
              />
              <span>{tab.name}</span>
              <span
                className={`${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-900"
                } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-5">
        {activeTabData && (
          <>
            {/* Tab Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${activeTabData.color}`} />
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTabData.name} Agents
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {activeTabData.count} agentes
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {activeTabData.description}
              </p>
            </div>

            {/* Agents List */}
            {activeTabData.agents.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className={`mx-auto h-12 w-12 rounded-full ${activeTabData.color} bg-opacity-20 flex items-center justify-center`}
                >
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum agente {activeTabData.name.toLowerCase()} encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Crie um novo agente {activeTabData.name.toLowerCase()} para começar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeTabData.agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-10 w-10 rounded-full ${activeTabData.color} bg-opacity-20 flex items-center justify-center`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  activeTabData.color === "bg-blue-500"
                                    ? "text-blue-600"
                                    : activeTabData.color === "bg-purple-500"
                                    ? "text-purple-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {agent.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {agent.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {agent.sector}
                            </p>
                          </div>
                        </div>

                        {/* Agent Stats */}
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Serviços:</span>{" "}
                            {agent.commonServices?.length || 0}
                          </div>
                          <div>
                            <span className="font-medium">Expertise:</span>{" "}
                            {agent.expertise?.length || 0}
                          </div>
                        </div>

                        {/* Agent ID */}
                        <div className="mt-2 text-xs text-gray-400 font-mono">
                          {agent.id}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-2">
                        <a
                          href={`/admin/agents/${agent.id}`}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title="Editar agente"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </a>
                        <button
                          type="button"
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title="Mais opções"
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
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
