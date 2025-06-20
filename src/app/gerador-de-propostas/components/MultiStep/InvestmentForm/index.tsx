"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

import { TextAreaField } from "#/components/Inputs";
import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function InvestmentForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const investmentTitle = formData?.step10?.investmentTitle || "";
    const hideSection = formData?.step10?.hideSection || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (investmentTitle.length < 50) {
        newErrors.investmentTitle = // ← Corrigido: era 'aboutUsTitle'
          "O campo 'Título' deve ter pelo menos 50 caracteres";
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
      updateFormData("step10", {
        ...formData?.step10,
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

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step10", {
      ...formData?.step10,
      hideSection: e.target.checked,
    });
  };

  const isDisabled = formData?.step10?.hideSection || false;

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
          title="Investimento:"
          description="Apresente as entregas, planos e valores"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step10?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Investimento&quot;</span> está
              atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="py-2">
            <p
              className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              Título {/* ← Corrigido: era 'Títutlo' */}
            </p>
            <TextAreaField
              id="investmentTitle"
              textareaName="investmentTitle"
              placeholder="Fale sobre você ou sua empresa"
              value={formData?.step10?.investmentTitle || ""}
              onChange={handleFieldChange("investmentTitle")}
              maxLength={90}
              minLength={50}
              showCharCount
              error={errors.investmentTitle}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[90px] xl:h-[100px] flex items-center gap-2 p-6">
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
        {errors.investmentTitle ? (
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
