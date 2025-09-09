"use client";

import { useState } from "react";

export default function AgentsFilters() {
  const [filters, setFilters] = useState({
    search: "",
    template: "all",
    service: "all",
    status: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Filtros
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Busca */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Buscar
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nome do agente..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Template */}
          <div>
            <label
              htmlFor="template"
              className="block text-sm font-medium text-gray-700"
            >
              Template
            </label>
            <select
              id="template"
              name="template"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.template}
              onChange={(e) => handleFilterChange("template", e.target.value)}
            >
              <option value="all">Todos os templates</option>
              <option value="base">Base</option>
              <option value="prime">Prime</option>
              <option value="flash">Flash</option>
            </select>
          </div>

          {/* Serviço */}
          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700"
            >
              Serviço
            </label>
            <select
              id="service"
              name="service"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.service}
              onChange={(e) => handleFilterChange("service", e.target.value)}
            >
              <option value="all">Todos os serviços</option>
              <option value="marketing-digital">Marketing Digital</option>
              <option value="design">Design</option>
              <option value="development">Desenvolvimento</option>
              <option value="photography">Fotografia</option>
              <option value="medical">Médico</option>
              <option value="architecture">Arquitetura</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() =>
              setFilters({
                search: "",
                template: "all",
                service: "all",
                status: "all",
              })
            }
          >
            Limpar Filtros
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

