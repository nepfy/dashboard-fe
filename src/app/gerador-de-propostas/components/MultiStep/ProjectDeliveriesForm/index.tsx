"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import TagInput from "#/components/Inputs/TagInput";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Service } from "#/types/project";

import ProjectDeliveriesAccordion from "./ProjectDeliveriesAccordion";

export default function ProjectDeliveriesForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step11", {
      ...formData?.step11,
      hideSection: e.target.checked,
    });
  };

  const handleFormListChange = (services: Service[]) => {
    updateFormData("step11", {
      ...formData?.step11,
      includedServices: services,
    });
  };

  const handleServicesChange = (services: string[]) => {
    updateFormData("step11", {
      ...formData?.step11,
      deliveryServices: services,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideSection = formData?.step11?.hideSection || false;
    const servicesList = formData?.step11?.includedServices || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (servicesList.length === 0) {
        newErrors.includedServices = "Ao menos 1 item é requerido";
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
          title="Entregas incluídas:"
          description="Liste o que será entregue ao longo do projeto"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step11?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="py-6">
          <div className="pt-4">
            <ProjectDeliveriesAccordion
              servicesList={formData?.step11?.includedServices || []}
              onFormChange={handleFormListChange}
            />
            {errors.includedServices && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.includedServices}
              </p>
            )}
          </div>

          <div className="pb-6">
            <TagInput
              label="Serviços"
              placeholder="Digite um serviço e pressione ; ou Tab"
              value={formData?.step11?.deliveryServices || []}
              onChange={handleServicesChange}
              infoText="Separe os serviços por ponto e vírgula (;) ou Tab. Use as setas para navegar e Delete para remover."
            />
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
