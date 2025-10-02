"use client";

import type React from "react";
import { useState } from "react";
import { Box } from "#/modules/ai-generator/components/box/Box";

export function ClientInfo({
  handleNext,
  handleBack,
  clientData,
  setClientData,
}: {
  handleNext: () => void;
  handleBack: () => void;
  clientData: {
    clientName: string;
    projectName: string;
    projectDescription: string;
    detailedClientInfo?: string;
  };
  setClientData: (data: {
    clientName: string;
    projectName: string;
    projectDescription: string;
    detailedClientInfo?: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    clientName: clientData.clientName,
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

  const isFormValid = formData.clientName.trim() && formData.projectName.trim();

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-gray-50 justify-center items-center gap-10 font-satoshi">
      <Box
        title="Sobre seu cliente"
        description="Nome, área de atuação e no que a empresa é especializada."
        handleBack={handleBack}
        handleNext={() => {
          setClientData({
            clientName: formData.clientName,
            projectName: formData.projectName,
            projectDescription: formData.projectDescription,
            detailedClientInfo: formData.detailedClientInfo,
          });

          handleNext();
        }}
        disabled={!isFormValid}
      >
        <div className="space-y-6 mt-6">
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
              placeholder="Ex: Site institucional da Loja XYZ"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="detailedClientInfo"
              className="block text-sm font-satoshi font-medium text-gray-700 p-3 bg-[#E8E2FD]/30 rounded-lg border border-[#E8E2FD]"
            >
              Sobre o seu cliente
            </label>
            <textarea
              id="detailedClientInfo"
              name="detailedClientInfo"
              value={formData.detailedClientInfo || ""}
              onChange={handleInputChange}
              placeholder="Ex: Clínica de dermatologia que oferece tratamentos estéticos e médicos e busca fortalecer sua presença digital para atrair novos pacientes."
              rows={6}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>

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
              placeholder="Ex: Desenvolvimento de um site institucional moderno e responsivo para apresentar a empresa, seus serviços e diferenciais. O objetivo é transmitir credibilidade, facilitar o contato de novos clientes e reforçar a presença digital da marca."
              rows={6}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-gray-700 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>
        </div>
      </Box>
    </div>
  );
}
