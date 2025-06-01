"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import ResultsAccordion from "./ResultsAccordion";
import { Result } from "#/types/project";

export default function AboutYourResultsForm() {
  const { prevStep, nextStep, updateFormData, formData } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step5", {
      ...formData?.step5,
      hideSection: e.target.checked,
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

  const handleResultsChange = (results: Result[]) => {
    updateFormData("step5", {
      ...formData?.step5,
      results: results,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const resultsSubtitle = formData?.step5?.resultsSubtitle || "";
    const hideSection = formData?.step5?.hideSection || false;
    const results = formData?.step5?.results || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (resultsSubtitle.length < 70) {
        newErrors.resultsSubtitle =
          "O campo 'Subtítulo' deve ter pelo menos 70 caracteres";
      }

      // Validate results list
      if (results.length === 0) {
        newErrors.results = "Ao menos 1 resultado é requerido";
      } else {
        // Validate individual result items
        results.forEach((result: Result, index: number) => {
          if (!result.client?.trim()) {
            newErrors[`result_${index}_client`] = `Cliente do resultado ${
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
            checked={formData?.step5?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="py-6 space-y-6">
          <div>
            <TextAreaField
              label="Subtítulo"
              id="resultsSubtitle"
              textareaName="resultsSubtitle"
              placeholder="Descreva os resultados que você entrega"
              value={formData?.step5?.resultsSubtitle || ""}
              onChange={handleFieldChange("resultsSubtitle")}
              maxLength={95}
              minLength={70}
              rows={2}
              showCharCount
              error={errors.resultsSubtitle}
            />
          </div>

          <div>
            <ResultsAccordion
              results={formData?.step5?.results || []}
              onResultsChange={handleResultsChange}
            />
            {errors.results && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.results}
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
