"use client";

import { useState, useEffect, useCallback } from "react";
import { DatabaseAgentConfig } from "#/modules/ai-generator/agents/database-agents";
import { TemplateConfig } from "#/modules/ai-generator/agents/base/template-constraints";
import AgentForm from "./AgentForm";

interface AgentEditorProps {
  agent: DatabaseAgentConfig;
}

export default function AgentEditor({ agent }: AgentEditorProps) {
  const [editedAgent, setEditedAgent] = useState<DatabaseAgentConfig>(agent);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;

    console.log("Debug - AgentEditor handleSave called with:", {
      hasChanges,
      agentId: agent.id,
      editedAgent: {
        name: editedAgent.name,
        systemPrompt: editedAgent.systemPrompt?.substring(0, 100) + "...",
        sector: editedAgent.sector,
      },
    });

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const response = await fetch(`/api/admin/agents/${agent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedAgent),
      });

      console.log("Debug - API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Debug - API error response:", errorData);
        throw new Error(
          `Erro ao salvar agente: ${errorData.error || response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("Debug - API success response:", responseData);

      setSaveStatus("saved");
      setHasChanges(false);

      // Forçar revalidação da página para mostrar as mudanças
      if (typeof window !== "undefined") {
        window.location.reload();
      }

      // Reset status após 3 segundos
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Error saving agent:", error);
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, agent.id, editedAgent]);

  // Detectar mudanças
  // Função para comparar objetos de forma mais robusta
  const compareAgents = (
    a: DatabaseAgentConfig,
    b: DatabaseAgentConfig
  ): boolean => {
    // Comparar campos básicos
    if (a.name !== b.name) return false;
    if (a.sector !== b.sector) return false;
    if (a.systemPrompt !== b.systemPrompt) return false;

    // Comparar arrays
    const compareArrays = (arr1: string[], arr2: string[]): boolean => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => item === arr2[index]);
    };

    if (!compareArrays(a.expertise || [], b.expertise || [])) return false;
    if (!compareArrays(a.commonServices || [], b.commonServices || []))
      return false;
    if (!compareArrays(a.proposalStructure || [], b.proposalStructure || []))
      return false;
    if (!compareArrays(a.keyTerms || [], b.keyTerms || [])) return false;

    // Comparar templateConfig
    if (JSON.stringify(a.templateConfig) !== JSON.stringify(b.templateConfig))
      return false;

    return true;
  };

  useEffect(() => {
    const hasChanges = !compareAgents(editedAgent, agent);
    console.log("Debug - Change detection:", {
      hasChanges,
      editedAgent: {
        name: editedAgent.name,
        systemPrompt: editedAgent.systemPrompt?.substring(0, 50) + "...",
        expertise: editedAgent.expertise?.length || 0,
      },
      originalAgent: {
        name: agent.name,
        systemPrompt: agent.systemPrompt?.substring(0, 50) + "...",
        expertise: agent.expertise?.length || 0,
      },
    });
    setHasChanges(hasChanges);
  }, [editedAgent, agent]);

  // Auto-save desabilitado temporariamente para debug
  // useEffect(() => {
  //   if (!hasChanges) return;

  //   const timeoutId = setTimeout(() => {
  //     handleSave();
  //   }, 2000);

  //   return () => clearTimeout(timeoutId);
  // }, [editedAgent, hasChanges, handleSave]);

  const handleChange = (
    field: string,
    value: string | string[] | TemplateConfig | null
  ) => {
    console.log("Debug - handleChange called:", {
      field,
      value: typeof value === "string" ? value.substring(0, 50) + "..." : value,
    });

    const normalizedValue =
      field === "templateConfig" && value === null ? undefined : value;

    setEditedAgent((prev) => {
      const newAgent = {
        ...prev,
        [field]: normalizedValue as
          | string
          | string[]
          | TemplateConfig
          | undefined,
      };
      console.log("Debug - Updated agent:", {
        field,
        oldValue: prev[field as keyof DatabaseAgentConfig],
        newValue: normalizedValue,
      });
      return newAgent;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Voltar
            </button>
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {editedAgent.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {editedAgent.sector} • {editedAgent.id}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {/* Status de Salvamento */}
          <div className="flex items-center space-x-2">
            {saveStatus === "saving" && (
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="flex items-center text-sm text-green-600">
                <svg
                  className="h-4 w-4 mr-1"
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
                Salvo
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center text-sm text-red-600">
                <svg
                  className="h-4 w-4 mr-1"
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
                Erro ao salvar
              </div>
            )}
          </div>

          {/* Botão de Salvar Manual */}
          <button
            onClick={() => {
              console.log("Debug - Save button clicked:", {
                hasChanges,
                isSaving,
              });
              handleSave();
            }}
            disabled={!hasChanges || isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-full">
        <AgentForm agent={editedAgent} onChange={handleChange} />
      </div>
    </div>
  );
}
