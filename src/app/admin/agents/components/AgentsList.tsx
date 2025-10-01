"use client";

import { useState, useEffect } from "react";
import { BaseAgentConfig } from "#/modules/ai-generator/agents/base/types";
import { useRouter } from "next/navigation";

export default function AgentsList() {
  const router = useRouter();
  const [agents, setAgents] = useState<Record<string, BaseAgentConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    agent: BaseAgentConfig | null;
  }>({ isOpen: false, agent: null });
  const [deleting, setDeleting] = useState(false);

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

  // Debug: Monitor modal state changes
  useEffect(() => {
    console.log("Debug - Modal state changed:", deleteModal);
  }, [deleteModal]);

  const handleEdit = (agentId: string) => {
    router.push(`/admin/agents/${agentId}`);
  };

  const handleDeleteClick = (agent: BaseAgentConfig) => {
    console.log("Debug - handleDeleteClick called with:", agent);
    setDeleteModal({ isOpen: true, agent });
    console.log("Debug - Modal state after setState:", { isOpen: true, agent });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.agent) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/agents/${deleteModal.agent.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao remover agente");
      }

      // Remove o agente da lista local
      setAgents((prev) => {
        const newAgents = { ...prev };
        delete newAgents[deleteModal.agent!.id];
        return newAgents;
      });

      setDeleteModal({ isOpen: false, agent: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover agente");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, agent: null });
  };

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

  const agentsList = Object.values(agents);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Agentes ({agentsList.length})
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exportar
            </button>
          </div>
        </div>

        {agentsList.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum agente encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando um novo agente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agentsList.map((agent) => (
              <div
                key={agent.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {agent.id.includes("base")
                        ? "Base"
                        : agent.id.includes("prime")
                        ? "Prime"
                        : agent.id.includes("flash")
                        ? "Flash"
                        : "Unknown"}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(agent.id)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                      </button>
                      <button
                        onClick={() => handleDeleteClick(agent)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Remover agente"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">ID:</span> {agent.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Serviços:</span>{" "}
                    {agent.commonServices?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Expertise:</span>{" "}
                    {agent.expertise?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de remoção */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Confirmar remoção
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja remover o agente{" "}
                  <span className="font-medium text-gray-900">
                    {deleteModal.agent?.name}
                  </span>
                  ? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleting ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
