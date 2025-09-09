"use client";

import { useState, useEffect } from "react";
import { BaseAgentConfig } from "#/modules/ai-generator/agents/base/types";
import AgentsSummary from "./AgentsSummary";

export default function AgentsSummaryLoader() {
  const [agents, setAgents] = useState<Record<string, BaseAgentConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true);
        
        const response = await fetch("/api/admin/agents");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        
        const data = await response.json();
        setAgents(data.agents);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar agentes"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

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
              Erro ao carregar resumo
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AgentsSummary agents={agents} loading={loading} />;
}
