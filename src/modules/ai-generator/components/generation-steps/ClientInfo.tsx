"use client";

import type React from "react";
import { useState } from "react";

import { TextField, TextAreaField } from "#/components/Inputs";
import { Box } from "#/modules/ai-generator/components/box/Box";

export function ClientInfo({
  handleNext,
  handleBack,
  clientData,
  setClientData,
  onClientNameSubmit,
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
  onClientNameSubmit?: (clientName: string) => void;
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
          onClientNameSubmit?.(formData.clientName);

          handleNext();
        }}
        disabled={!isFormValid}
      >
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <TextField
              bgLabel
              id="clientName"
              inputName="clientName"
              label="Nome do cliente"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Loja XYZ"
            />
          </div>

          <div className="space-y-2">
            <TextField
              bgLabel
              id="projectName"
              inputName="projectName"
              label="Nome do projeto"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Ex: Site institucional da Loja XYZ"
            />
          </div>

          <div className="space-y-2">
            <TextAreaField
              bgLabel
              id="detailedClientInfo"
              textareaName="detailedClientInfo"
              label="Sobre o seu cliente"
              value={formData.detailedClientInfo || ""}
              onChange={handleInputChange}
              placeholder="Ex: Clínica de dermatologia que oferece tratamentos estéticos e médicos e busca fortalecer sua presença digital para atrair novos pacientes."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <TextAreaField
              bgLabel
              id="projectDescription"
              textareaName="projectDescription"
              label="Descrição do projeto"
              value={formData.projectDescription}
              onChange={handleInputChange}
              placeholder="Ex: Desenvolvimento de um site institucional moderno e responsivo para apresentar a empresa, seus serviços e diferenciais. O objetivo é transmitir credibilidade, facilitar o contato de novos clientes e reforçar a presença digital da marca."
              rows={6}
            />
          </div>
        </div>
      </Box>
    </div>
  );
}
