"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

import { TextField, TextAreaField, DatePicker } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function FinalMessageForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const endMessageTitle = formData?.step15?.endMessageTitle || "";
    const endMessageDescription = formData?.step15?.endMessageDescription || "";
    const hideSection = formData?.step15?.hideSection || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (endMessageTitle.length < 20) {
        newErrors.endMessageTitle =
          "O campo 'Título da mensagem final' deve ter pelo menos 20 caracteres";
      }

      if (endMessageDescription.length < 70) {
        newErrors.endMessageDescription =
          "O campo 'Descrição da mensagem final' deve ter pelo menos 70 caracteres";
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
      updateFormData("step15", {
        ...formData?.step15,
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step15", {
      ...formData?.step15,
      projectValidUntil: e.target.value,
    });
  };

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step15", {
      ...formData?.step15,
      hideSection: e.target.checked,
    });
  };

  const getDateValue = () => {
    try {
      const dateValue = formData?.step15?.projectValidUntil;

      console.log("dateValue", dateValue);

      if (!dateValue || dateValue.toString().trim() === "") {
        return "";
      }

      const date = new Date(dateValue).toISOString().split("T")[0];
      console.log("date", date);
      return date;
    } catch {
      return "";
    }
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
          title="Mensagem final:"
          description="Finalize com um agradecimento e convite para avançar"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step15?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="py-6">
          <div className="py-2">
            <TextField
              label="Agradecimento"
              inputName="endMessageTitle"
              id="endMessageTitle"
              type="text"
              placeholder="Ex: Obrigado pela sua atenção!"
              value={formData?.step15?.endMessageTitle || ""}
              onChange={handleFieldChange("endMessageTitle")}
              maxLength={50}
              error={errors.endMessageTitle}
            />
          </div>

          <div className="py-2">
            <TextAreaField
              label="Subtítulo"
              id="endMessageDescription"
              textareaName="endMessageDescription"
              placeholder="Escreva uma mensagem de agradecimento e próximos passos"
              value={formData?.step15?.endMessageDescription || ""}
              onChange={handleFieldChange("endMessageDescription")}
              maxLength={225}
              minLength={70}
              showCharCount
              rows={4}
              error={errors.endMessageDescription}
            />
          </div>

          <div className="py-2 max-w-[235px] w-full">
            <DatePicker
              label="Qual a validade desta proposta?"
              inputName="projectValidUntil"
              id="projectValidUntil"
              placeholder="Escolha uma data"
              value={getDateValue()}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[90px] xl:h-[100px] flex gap-2 p-6">
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
