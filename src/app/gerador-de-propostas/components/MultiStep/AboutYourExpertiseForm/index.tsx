"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";
import StepProgressIndicator from "../../StepProgressIndicator";
import ExpertiseAccordion from "./ExpertiseAccordion";
import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Expertise } from "#/types/project";

export default function AboutYourExpertiseForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    updateFormData("step4", {
      ...formData?.step4,
      hideExpertiseSection: e.target.checked,
    });
  };

  const handleExpertiseChange = (expertise: Expertise[]) => {
    updateFormData("step4", {
      ...formData?.step4,
      expertise: expertise,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideExpertiseSection = formData?.step4?.hideExpertiseSection || false;
    const expertiseSubtitle = formData?.step4?.expertiseSubtitle || "";
    const expertiseList = formData?.step4?.expertise || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideExpertiseSection) {
      if (expertiseSubtitle.length < 90) {
        newErrors.expertiseSubtitle =
          "O campo 'Subtítulo' deve ter pelo menos 90 caracteres";
      }

      if (expertiseList.length === 0) {
        newErrors.expertiseList = "Ao menos 1 especialização é requerida";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step4", {
        ...formData?.step4,
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

  const hideSectionChecked = formData?.step4?.hideExpertiseSection || false;

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
          title="Suas especialidades:"
          description="Mostre em que você é especialista"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step4?.hideExpertiseSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {hideSectionChecked && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Suas especialidades&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6 space-y-6">
          <div>
            <label
              className={`text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center ${
                hideSectionChecked ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hideSectionChecked
                  ? undefined
                  : "rgba(107, 70, 245, 0.05)",
              }}
            >
              Subtítulo
            </label>
            <TextAreaField
              id="expertiseSubtitle"
              textareaName="expertiseSubtitle"
              placeholder="Descreva suas especialidades"
              value={formData?.step4?.expertiseSubtitle || ""}
              onChange={handleFieldChange("expertiseSubtitle")}
              maxLength={120}
              minLength={90}
              rows={2}
              showCharCount
              error={errors.expertiseSubtitle}
              disabled={hideSectionChecked}
            />
          </div>

          <div>
            <ExpertiseAccordion
              expertise={formData?.step4?.expertise || []}
              onExpertiseChange={handleExpertiseChange}
              disabled={hideSectionChecked}
            />
            {errors.expertiseList && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.expertiseList}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6 items-center bg-white-neutral-light-200">
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
        {errors.expertiseSubtitle || errors.expertiseList ? (
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
