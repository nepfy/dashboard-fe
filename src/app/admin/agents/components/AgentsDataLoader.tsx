"use client";

import { useState, useEffect } from "react";
import { BaseAgentConfig } from "#/modules/ai-generator/agents/base/types";
import AgentsTabs from "./AgentsTabs";

export default function AgentsDataLoader() {
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

  return (
    <AgentsTabs 
      agents={agents} 
      loading={loading} 
      error={error} 
    />
  );
}
