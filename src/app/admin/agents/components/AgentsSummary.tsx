"use client";

import { BaseAgentConfig } from "#/modules/ai-generator/agents/base/types";

interface AgentsSummaryProps {
  agents: Record<string, BaseAgentConfig>;
  loading: boolean;
}

export default function AgentsSummary({ agents, loading }: AgentsSummaryProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const agentsList = Object.values(agents);
  
  // Group by template
  const flashAgents = agentsList.filter(agent => agent.id.includes('flash'));
  const primeAgents = agentsList.filter(agent => agent.id.includes('prime'));
  const baseAgents = agentsList.filter(agent => agent.id.includes('base'));

  // Group by service
  const serviceGroups = agentsList.reduce((acc, agent) => {
    const service = agent.sector;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      name: "Total de Agentes",
      value: agentsList.length,
      icon: "🤖",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Templates Flash",
      value: flashAgents.length,
      icon: "⚡",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Templates Prime",
      value: primeAgents.length,
      icon: "👑",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Templates Base",
      value: baseAgents.length,
      icon: "🔧",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Resumo dos Agentes
        </h3>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute ${stat.bgColor} rounded-md p-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Service Breakdown */}
        {Object.keys(serviceGroups).length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Distribuição por Serviço
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries(serviceGroups).map(([service, count]) => (
                <div
                  key={service}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <div className="text-lg font-semibold text-gray-900">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {service}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
