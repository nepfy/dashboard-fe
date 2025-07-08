"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import InfoIcon from "#/components/icons/InfoIcon";
import TextAreaField from "#/components/Inputs/TextAreaField";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import ResultsAccordion from "./ResultsAccordion";

import { Result } from "#/types/project";

export default function AboutYourResultsForm() {
  const {
    prevStep,
    nextStep,
    updateFormData,
    formData,
    currentStep,
    templateType,
  } = useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check if template type is Prime to show subtitle field
  const isPrimeTemplate = templateType?.toLowerCase() === "prime";
  const shouldShowSubtitle = isPrimeTemplate;

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step5", {
      ...formData?.step5,
      hideYourResultsSection: isHidden,
    });
  };

  const handleResultsChange = (results: Result[]) => {
    updateFormData("step5", {
      ...formData?.step5,
      results: results,
    });
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step5", {
        ...formData?.step5,
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

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideYourResultsSection =
      formData?.step5?.hideYourResultsSection || false;
    const resultsSubtitle = formData?.step5?.resultsSubtitle || "";
    const results = formData?.step5?.results || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideYourResultsSection) {
      // Only validate subtitle if it should be visible (Prime template)
      if (shouldShowSubtitle && resultsSubtitle.length < 90) {
        newErrors.resultsSubtitle =
          "O campo 'Subtítulo' deve ter pelo menos 90 caracteres";
      }

      // Validate results list
      if (results.length === 0) {
        newErrors.results = "Ao menos 1 resultado é requerido";
      } else {
        // Validate individual result items
        results.forEach((result: Result, index: number) => {
          // Validate client field
          if (!result.client?.trim()) {
            newErrors[`result_${index}_client`] = `Cliente do resultado ${
              index + 1
            } é obrigatório`;
          }

          // Validate subtitle field (Instagram)
          if (!result.subtitle?.trim()) {
            newErrors[`result_${index}_subtitle`] = `Instagram do resultado ${
              index + 1
            } é obrigatório`;
          }

          // Validate investment field
          if (!result.investment?.trim()) {
            newErrors[
              `result_${index}_investment`
            ] = `Investimento do resultado ${index + 1} é obrigatório`;
          }

          // Validate ROI field
          if (!result.roi?.trim()) {
            newErrors[`result_${index}_roi`] = `ROI do resultado ${
              index + 1
            } é obrigatório`;
          }

          if (result.hidePhoto === false && !result.photo?.trim()) {
            newErrors[`result_${index}_photo`] = `Foto do resultado ${
              index + 1
            } é obrigatória ou deve ser ocultada`;
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

  const isAccordionDisabled = formData?.step5?.hideYourResultsSection || false;

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
          title="Seus resultados:"
          description="Comprove com dados reais o impacto do seu trabalho"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step5?.hideYourResultsSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Seus resultados&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        {/* Only show subtitle field if Prime template */}
        {shouldShowSubtitle && (
          <div>
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
              id="resultsSubtitle"
              textareaName="resultsSubtitle"
              placeholder="Descreva seus resultados"
              value={formData?.step5?.resultsSubtitle || ""}
              onChange={handleFieldChange("resultsSubtitle")}
              maxLength={120}
              minLength={90}
              rows={2}
              showCharCount
              error={errors.resultsSubtitle}
              disabled={isAccordionDisabled}
              allowOverText
            />
          </div>
        )}

        <div className="py-6 space-y-6">
          <div>
            <ResultsAccordion
              results={formData?.step5?.results || []}
              onResultsChange={handleResultsChange}
              disabled={isAccordionDisabled}
              errors={errors}
            />
            {errors.results && !isAccordionDisabled && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.results}
              </div>
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
              {errors.results
                ? "Preencha todos os campos"
                : "Corrija os erros para continuar"}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
