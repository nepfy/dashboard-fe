"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Client } from "#/types/project";

import ClientsAccordion from "./ClientsAccordion";

export default function AboutYourClientsForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step6", {
      ...formData?.step6,
      hideSection: e.target.checked,
    });
  };

  const handleClientsChange = (clients: Client[]) => {
    updateFormData("step6", {
      ...formData?.step6,
      clients: clients,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});
    const hideSection = formData?.step6?.hideSection || false;
    const clients = formData?.step6?.clients || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (clients.length === 0) {
        newErrors.clients = "Ao menos 1 cliente é requerido";
      } else {
        clients.forEach((client: Client, index: number) => {
          if (!client.name?.trim()) {
            newErrors[`client_${index}_name`] = `Nome do cliente ${
              index + 1
            } é obrigatório`;
          }
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-7">
        <div className="mb-6">
          <StepProgressIndicator currentStep={currentStep} />
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="xl:hidden mb-4 w-full p-3 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
        >
          <Eye width="18" height="18" /> Pré-visualizar essa seção
        </button>

        <TitleDescription
          title="Seus clientes:"
          description="Mostre quem já confiou no seu trabalho"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step6?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="py-6">
          <div>
            <ClientsAccordion
              clients={formData?.step6?.clients || []}
              onClientsChange={handleClientsChange}
            />
            {errors.clients && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.clients}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center gap-1 w-[110px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-300"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          className="w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] bg-primary-light-500 button-inner-inverse border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100"
          onClick={handleNext}
        >
          Avançar
        </button>
      </div>
    </div>
  );
}
