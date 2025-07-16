"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Service } from "#/types/project";

import ProjectDeliveriesAccordion from "./ProjectDeliveriesAccordion";

export default function ProjectDeliveriesForm() {
  const {
    prevStep,
    nextStep,
    updateFormData,
    formData,
    currentStep,
    templateType,
  } = useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check template types
  const isEssencialTemplate = templateType?.toLowerCase() === "essencial";

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step11", {
      ...formData?.step11,
      hideIncludedServicesSection: isHidden,
    });
  };

  const handleFormListChange = (services: Service[]) => {
    updateFormData("step11", {
      ...formData?.step11,
      includedServices: services,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideIncludedServicesSection =
      formData?.step11?.hideIncludedServicesSection || false;
    const servicesList = formData?.step11?.includedServices || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideIncludedServicesSection) {
      if (servicesList.length === 0) {
        newErrors.includedServices = "Ao menos 1 entrega é requerida";
      } else {
        // Validate individual service items
        servicesList.forEach((service: Service, index: number) => {
          // Validate title field
          if (!service.title?.trim()) {
            newErrors[`service_${index}_title`] = `Título da entrega ${
              index + 1
            } é obrigatório`;
          } else if (service.title.length > 50) {
            newErrors[`service_${index}_title`] = `Título da entrega ${
              index + 1
            } deve ter no máximo 50 caracteres`;
          }

          // Validate description field
          if (!service.description?.trim()) {
            newErrors[`service_${index}_description`] = `Descrição da entrega ${
              index + 1
            } é obrigatória`;
          } else {
            // Check character limits for description
            // For Essencial template, only check maxLength (no minLength)
            if (isEssencialTemplate) {
              if (service.description.length > 340) {
                newErrors[
                  `service_${index}_description`
                ] = `Descrição da entrega ${
                  index + 1
                } deve ter no máximo 340 caracteres`;
              }
            } else {
              // For other templates, check both min and max length
              if (service.description.length < 165) {
                newErrors[
                  `service_${index}_description`
                ] = `Descrição da entrega ${
                  index + 1
                } deve ter pelo menos 165 caracteres`;
              } else if (service.description.length > 340) {
                newErrors[
                  `service_${index}_description`
                ] = `Descrição da entrega ${
                  index + 1
                } deve ter no máximo 340 caracteres`;
              }
            }
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

  // Determinar se o accordion deve estar desabilitado
  const isAccordionDisabled =
    formData?.step11?.hideIncludedServicesSection || false;

  return (
    <div className="h-full flex flex-col justify-between relative overflow-y-scroll">
      <div className="p-7 mb-20">
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
            checked={formData?.step11?.hideIncludedServicesSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Entregas incluídas&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="pt-4">
            <ProjectDeliveriesAccordion
              servicesList={formData?.step11?.includedServices || []}
              onFormChange={handleFormListChange}
              disabled={isAccordionDisabled}
              errors={errors}
              templateType={templateType ?? undefined}
            />
            {errors.includedServices && !isAccordionDisabled && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.includedServices}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6 fixed bottom-0 bg-white-neutral-light-200">
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
        {Object.keys(errors).length > 0 && !isAccordionDisabled ? (
          <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2 ">
            <InfoIcon fill="#D00003" />
            <p className="text-white-neutral-light-800 text-sm">
              Preencha todos os campos
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
