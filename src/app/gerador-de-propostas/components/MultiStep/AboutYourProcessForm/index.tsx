"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";
import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ProcessStep } from "#/types/project";

import ProcessAccordion from "./ProcessAccordion";

export default function AboutYourProcessForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step7", {
      ...formData?.step7,
      hideProcessSection: isHidden,
      // Se a seção for ocultada e já houver etapas, removê-las
      processSteps: isHidden ? [] : formData?.step7?.processSteps || [],
    });
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step7", {
        ...formData?.step7,
        [fieldName]: e.target.value,
      });

      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    };

  const handleFormListChange = (process: ProcessStep[]) => {
    updateFormData("step7", {
      ...formData?.step7,
      processSteps: process,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const processSubtitle = formData?.step7?.processSubtitle || "";
    const hideProcessSection = formData?.step7?.hideProcessSection || false;
    const hideProcessSubtitle = formData?.step7?.hideProcessSubtitle || false;
    const processList = formData?.step7?.processSteps || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideProcessSection) {
      if (processSubtitle.length < 70 && !hideProcessSubtitle) {
        newErrors.processSubtitle =
          "O campo 'Subtítulo' deve ter pelo menos 70 caracteres";
      }

      if (processList.length === 0) {
        newErrors.processList = "Ao menos 1 etapa é requerida";
      } else {
        // Validate individual process items
        processList.forEach((process: ProcessStep, index: number) => {
          if (!process.stepName?.trim()) {
            newErrors[`process_${index}_stepName`] = `Nome da etapa ${
              index + 1
            } é obrigatório`;
          }
          if (!process.description?.trim()) {
            newErrors[`process_${index}_description`] = `Descrição da etapa ${
              index + 1
            } é obrigatória`;
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

  const isAccordionDisabled = formData?.step7?.hideProcessSection || false;

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
          title="Etapas do processo:"
          description="Explique como o trabalho será desenvolvido"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step7?.hideProcessSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Etapas do processo&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          {!isAccordionDisabled && (
            <div className="py-2">
              <label
                className={`text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center ${
                  isAccordionDisabled ? "bg-white-neutral-light-300" : ""
                }`}
                style={{
                  backgroundColor: isAccordionDisabled
                    ? undefined
                    : "rgba(107, 70, 245, 0.05)",
                }}
              >
                Subtítulo
              </label>
              <TextAreaField
                id="processSubtitle"
                textareaName="processSubtitle"
                placeholder="Detalhe o processo de desenvolvimento"
                value={formData?.step7?.processSubtitle || ""}
                onChange={handleFieldChange("processSubtitle")}
                maxLength={100}
                minLength={70}
                rows={2}
                showCharCount
                error={errors.processSubtitle}
                disabled={isAccordionDisabled}
              />
            </div>
          )}
          <div className="pt-4">
            <ProcessAccordion
              processList={formData?.step7?.processSteps || []}
              onFormChange={handleFormListChange}
              disabled={isAccordionDisabled}
            />
            {errors.processList && !isAccordionDisabled && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.processList}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6">
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

        {errors.processSubtitle || errors.processList ? (
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
