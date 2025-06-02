"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

import { TextAreaField } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function AboutYourBusinessForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const aboutUsTitle = formData?.step2?.aboutUsTitle || "";
    const aboutUsSubtitle1 = formData?.step2?.aboutUsSubtitle1 || "";
    const aboutUsSubtitle2 = formData?.step2?.aboutUsSubtitle2 || "";
    const hideSection = formData?.step2?.hideSection || false;
    const hideSubtitles = formData?.step2?.hideSubtitles || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (aboutUsTitle.length < 85) {
        newErrors.aboutUsTitle =
          "O campo 'Sobre nós' deve ter pelo menos 85 caracteres";
      }

      if (!hideSubtitles) {
        if (aboutUsSubtitle1.length < 40) {
          newErrors.aboutUsSubtitle1 =
            "O campo 'Subtítulo 1' deve ter pelo menos 40 caracteres";
        }

        if (aboutUsSubtitle2.length < 195) {
          newErrors.aboutUsSubtitle2 =
            "O campo 'Subtítulo 2' deve ter pelo menos 195 caracteres";
        }
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
      updateFormData("step2", {
        ...formData?.step2,
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
    updateFormData("step2", {
      ...formData?.step2,
      hideSection: e.target.checked,
    });
  };

  const handleHideSubtitlesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFormData("step2", {
      ...formData?.step2,
      hideSubtitles: e.target.checked,
    });
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
          title="Sobre seu negócio:"
          description="Conte mais sobre sua empresa e o que vocês fazem"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step2?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="py-6">
          <div className="py-2">
            <TextAreaField
              label="Sobre nós"
              id="aboutUsTitle"
              textareaName="aboutUsTitle"
              placeholder="Fale sobre você ou sua empresa"
              value={formData?.step2?.aboutUsTitle || ""}
              onChange={handleFieldChange("aboutUsTitle")}
              maxLength={160}
              minLength={85}
              showCharCount
              error={errors.aboutUsTitle}
            />
          </div>

          <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
            <input
              type="checkbox"
              checked={formData?.step2?.hideSubtitles || false}
              onChange={handleHideSubtitlesChange}
              className="border border-white-neutral-light-300 rounded-full"
            />
            Ocultar subtítulos 1 e 2
          </label>

          <div className="py-1">
            <TextAreaField
              label="Subtítulo 1"
              id="aboutUsSubtitle1"
              textareaName="aboutUsSubtitle1"
              placeholder="Descreva sua empresa ou negócio"
              value={formData?.step2?.aboutUsSubtitle1 || ""}
              onChange={handleFieldChange("aboutUsSubtitle1")}
              maxLength={70}
              minLength={40}
              showCharCount
              error={errors.aboutUsSubtitle1}
            />
          </div>

          <div className="py-1">
            <TextAreaField
              label="Subtítulo 2"
              id="aboutUsSubtitle2"
              textareaName="aboutUsSubtitle2"
              placeholder="Adicione mais detalhes"
              value={formData?.step2?.aboutUsSubtitle2 || ""}
              onChange={handleFieldChange("aboutUsSubtitle2")}
              maxLength={250}
              minLength={195}
              showCharCount
              error={errors.aboutUsSubtitle2}
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
