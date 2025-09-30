"use client";

import type React from "react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export function ClientInfo({
  handleNext,
  handleBack,
  clientData,
  setClientData,
}: {
  handleNext: () => void;
  handleBack: () => void;
  clientData: {
    companyName: string;
    clientName: string;
    projectName: string;
    projectDescription: string;
    detailedClientInfo?: string;
  };
  setClientData: (data: {
    companyName: string;
    clientName: string;
    projectName: string;
    projectDescription: string;
    detailedClientInfo?: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    clientName: clientData.clientName,
    companyName: clientData.companyName,
    projectName: clientData.projectName,
    projectDescription: clientData.projectDescription,
    detailedClientInfo: clientData.detailedClientInfo || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.clientName.trim() &&
    formData.companyName.trim() &&
    formData.projectName.trim();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10 font-satoshi">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 self-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Sobre seu cliente
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Nome do cliente, empresa, projeto e detalhes sobre o cliente.
            Conte-nos mais sobre quem você está atendendo para personalizar a
            proposta.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Client Name */}
          <div className="space-y-2">
            <label
              htmlFor="clientName"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Nome do cliente
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Loja XYZ"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Nome da empresa
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Empresa ABC Ltda"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <label
              htmlFor="projectName"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Nome do projeto
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Ex: Site institucional da Loja XYZ (para você identificar essa proposta no seu painel de gerenciamento)"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Para você identificar essa proposta no seu painel de gerenciamento
            </p>
          </div>

          {/* Detailed Client Information */}
          <div className="space-y-2">
            <label
              htmlFor="detailedClientInfo"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Conte um pouco mais sobre o seu cliente
            </label>
            <textarea
              id="detailedClientInfo"
              name="detailedClientInfo"
              value={formData.detailedClientInfo || ""}
              onChange={handleInputChange}
              placeholder="Descreva mais profundamente quem é o seu cliente: personalidade, preferências de comunicação, histórico de trabalhos anteriores, relacionamento com a empresa, expectativas específicas, contexto do mercado onde atua, etc. Quanto mais detalhes você compartilhar, mais personalizada será a abordagem da proposta."
              rows={6}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 resize-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este campo é opcional, mas altamente recomendado para uma proposta
              mais personalizada
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label
              htmlFor="projectDescription"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Descrição do Projeto
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              placeholder="Descreva detalhadamente o projeto, incluindo escopo, valores e expectativas, para uma proposta mais personalizada."
              rows={6}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 resize-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-200 w-full flex items-center gap-4 mt-8 pt-6">
          <button
            onClick={handleBack}
            className="flex items-center justify-start gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Voltar
          </button>

          <button
            onClick={() => {
              setClientData({
                companyName: formData.companyName,
                clientName: formData.clientName,
                projectName: formData.projectName,
                projectDescription: formData.projectDescription,
                detailedClientInfo: formData.detailedClientInfo,
              });

              handleNext();
            }}
            disabled={!isFormValid}
            className={`py-3 px-8 font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              !isFormValid
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
