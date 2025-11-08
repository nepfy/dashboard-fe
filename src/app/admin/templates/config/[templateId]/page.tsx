"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TemplateConfig } from "#/modules/ai-generator/config/template-prompts";

export default function TemplateConfigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.templateId as string;

  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/templates/config");
      const data = await response.json();

      if (data.success) {
        const templateConfig = data.data.find(
          (c: TemplateConfig) => c.id === templateId
        );
        if (templateConfig) {
          setConfig(templateConfig);
        } else {
          setError("Template configuration not found");
        }
      } else {
        setError(data.error || "Failed to fetch configuration");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (templateId) {
      fetchConfig();
    }
  }, [templateId, fetchConfig]);

  const updateMoAConfig = async (moaConfig: Partial<TemplateConfig["moa"]>) => {
    try {
      setSaving(true);
      const response = await fetch(
        `/api/admin/templates/config/${templateId}/moa`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(moaConfig),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchConfig();
        alert("MoA configuration updated successfully!");
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error || "Configuration not found"}</p>
          <button
            onClick={() => router.push("/admin/templates/config")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/templates/config")}
              className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
            >
              ← Back to Configurations
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.name} Template Configuration
            </h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              config.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {config.status}
          </span>
        </div>

        {/* Template Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Informações do Template
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Template
              </label>
              <input
                type="text"
                value={config.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <input
                type="text"
                value={config.type}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={config.description}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={config.status}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última Atualização
              </label>
              <input
                type="text"
                value={config.lastUpdated}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        {/* MoA Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Configuração Mixture of Agents (MoA)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MoA Habilitado
              </label>
              <select
                value={config.moa.enabled ? "true" : "false"}
                onChange={(e) =>
                  updateMoAConfig({ enabled: e.target.value === "true" })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo Agregador
              </label>
              <select
                value={config.moa.aggregatorModel}
                onChange={(e) =>
                  updateMoAConfig({ aggregatorModel: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                <option value="mistralai/Mistral-7B-Instruct-v0.3">
                  Mixtral 8x22B
                </option>
                <option value="meta-llama/Llama-3.3-70B-Instruct-Turbo">
                  Llama 3.3 70B
                </option>
                <option value="Qwen/Qwen2-72B-Instruct">Qwen2 72B</option>
                <option value="databricks/dbrx-instruct">DBRX Instruct</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Tentativas
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={config.moa.maxRetries}
                onChange={(e) =>
                  updateMoAConfig({ maxRetries: parseInt(e.target.value, 10) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura (0.0 - 1.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={config.moa.temperature}
                onChange={(e) =>
                  updateMoAConfig({ temperature: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Tokens
              </label>
              <input
                type="number"
                min="1000"
                max="5000"
                step="500"
                value={config.moa.maxTokens}
                onChange={(e) =>
                  updateMoAConfig({ maxTokens: parseInt(e.target.value, 10) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelos de Referência
            </label>
            <div className="space-y-2">
              {config.moa.referenceModels.map((model, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="flex-1 text-gray-900">{model}</span>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {config.moa.referenceModels.length} modelos de referência ativos
            </p>
          </div>
        </div>

        {/* Sections Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Configuração de Seções
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.sections).map(([key, section]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedSection === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedSection(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {key === "introduction"
                      ? "Introdução"
                      : key === "aboutUs"
                      ? "Sobre Nós"
                      : key === "team"
                      ? "Equipe"
                      : key === "specialties"
                      ? "Especialidades"
                      : key === "steps"
                      ? "Etapas"
                      : key === "scope"
                      ? "Escopo"
                      : key === "investment"
                      ? "Investimento"
                      : key === "terms"
                      ? "Termos"
                      : key === "faq"
                      ? "FAQ"
                      : key === "footer"
                      ? "Rodapé"
                      : key}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      (section as { enabled?: boolean }).enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {(section as { enabled?: boolean }).enabled
                      ? "Ativo"
                      : "Inativo"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {(section as { rules?: string[] }).rules?.length || 0} regras
                  configuradas
                </p>
              </div>
            ))}
          </div>

          {selectedSection && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedSection === "introduction"
                  ? "Introdução"
                  : selectedSection === "aboutUs"
                  ? "Sobre Nós"
                  : selectedSection === "team"
                  ? "Equipe"
                  : selectedSection === "specialties"
                  ? "Especialidades"
                  : selectedSection === "steps"
                  ? "Etapas"
                  : selectedSection === "scope"
                  ? "Escopo"
                  : selectedSection === "investment"
                  ? "Investimento"
                  : selectedSection === "terms"
                  ? "Termos"
                  : selectedSection === "faq"
                  ? "FAQ"
                  : selectedSection === "footer"
                  ? "Rodapé"
                  : selectedSection}
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seção Ativa
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        (
                          config.sections as Record<
                            string,
                            { enabled?: boolean }
                          >
                        )[selectedSection]?.enabled
                      }
                      className="w-5 h-5"
                      disabled
                    />
                    <span className="text-sm text-gray-600">
                      {(
                        config.sections as Record<string, { enabled?: boolean }>
                      )[selectedSection]?.enabled
                        ? "Esta seção está ativa"
                        : "Esta seção está inativa"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regras de Geração
                  </label>
                  <div className="space-y-2">
                    {(
                      (config.sections as Record<string, { rules?: string[] }>)[
                        selectedSection
                      ]?.rules || []
                    ).map((rule, index) => (
                      <div
                        key={index}
                        className="bg-white px-4 py-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium text-sm">
                            {index + 1}.
                          </span>
                          <span className="text-gray-700 text-sm">{rule}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(
                    (config.sections as Record<string, { rules?: string[] }>)[
                      selectedSection
                    ]?.rules || []
                  ).length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                      Nenhuma regra específica configurada para esta seção
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
