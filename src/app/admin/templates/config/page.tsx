"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TemplateConfig } from "#/modules/ai-generator/config/template-config";

export default function TemplateConfigPage() {
  const [configs, setConfigs] = useState<TemplateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/templates/config");
      const data = await response.json();

      if (data.success) {
        setConfigs(data.data);
      } else {
        setError(data.error || "Failed to fetch configurations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Template Configurations
          </h1>
          <p className="text-gray-600">
            Manage AI generation settings for each template type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configs.map((config) => (
            <div
              key={config.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {config.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      config.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {config.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {config.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">MoA Enabled:</span>
                    <span
                      className={`font-medium ${
                        config.moa.enabled ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {config.moa.enabled ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reference Models:</span>
                    <span className="font-medium text-gray-900">
                      {config.moa.referenceModels.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="font-medium text-gray-900">
                      {config.lastUpdated}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/templates/config/${config.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
                >
                  Configure
                </Link>
              </div>
            </div>
          ))}
        </div>

        {configs.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No template configurations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
