"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

import { TextAreaField } from "#/components/Inputs";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";
import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function AboutYourBusinessForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get current values from formData
  const hideAboutUsSection = formData?.step2?.hideAboutUsSection || false;
  const hideAboutUsTitle = formData?.step2?.hideAboutUsTitle || false;
  const hideSubtitles1 = formData?.step2?.hideSubtitles1 || false;
  const hideSubtitles2 = formData?.step2?.hideSubtitles2 || false;

  // Calculate field visibility based on formData (no local state needed)
  const fieldVisibility = {
    aboutUsSection: !hideAboutUsSection,
    aboutUsTitle: !hideAboutUsTitle && !hideAboutUsSection,
    aboutUsSubtitle1: !hideSubtitles1 && !hideAboutUsSection,
    aboutUsSubtitle2: !hideSubtitles2 && !hideAboutUsSection,
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const aboutUsTitle = formData?.step2?.aboutUsTitle || "";
    const aboutUsSubtitle1 = formData?.step2?.aboutUsSubtitle1 || "";
    const aboutUsSubtitle2 = formData?.step2?.aboutUsSubtitle2 || "";
    const newErrors: { [key: string]: string } = {};

    if (!hideAboutUsSection) {
      if (!hideAboutUsTitle) {
        if (fieldVisibility.aboutUsTitle && aboutUsTitle.length < 85) {
          newErrors.aboutUsTitle =
            "O campo 'Sobre nós' deve ter pelo menos 85 caracteres";
        }
      }

      if (!hideSubtitles1 || !hideSubtitles2) {
        if (fieldVisibility.aboutUsSubtitle1 && aboutUsSubtitle1.length < 40) {
          newErrors.aboutUsSubtitle1 =
            "O campo 'Subtítulo 1' deve ter pelo menos 40 caracteres";
        }

        if (fieldVisibility.aboutUsSubtitle2 && aboutUsSubtitle2.length < 195) {
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
    setErrors({});
    const isHiding = e.target.checked;

    updateFormData("step2", {
      ...formData?.step2,
      hideAboutUsSection: isHiding,
    });
  };

  const toggleFieldVisibility = (fieldName: string) => {
    setErrors({});

    if (fieldName === "aboutUsTitle") {
      const newValue = !hideAboutUsTitle;
      updateFormData("step2", {
        ...formData?.step2,
        hideAboutUsTitle: newValue,
      });

      // Clear error if hiding field
      if (newValue) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.aboutUsTitle;
          return newErrors;
        });
      }
    } else if (fieldName === "aboutUsSubtitle1") {
      const newValue = !hideSubtitles1;
      updateFormData("step2", {
        ...formData?.step2,
        hideSubtitles1: newValue,
      });

      // Clear error if hiding field
      if (newValue) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.aboutUsSubtitle1;
          return newErrors;
        });
      }
    } else if (fieldName === "aboutUsSubtitle2") {
      const newValue = !hideSubtitles2;
      updateFormData("step2", {
        ...formData?.step2,
        hideSubtitles2: newValue,
      });

      // Clear error if hiding field
      if (newValue) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.aboutUsSubtitle2;
          return newErrors;
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col justify-between relative overflow-y-scroll">
      <div className="p-7 mb-13">
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
            checked={hideAboutUsSection}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {hideAboutUsSection && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Sobre seu negócio&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="py-2">
            <div
              className={`text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center ${
                hideAboutUsSection || hideAboutUsTitle
                  ? "bg-white-neutral-light-300"
                  : ""
              }`}
              style={{
                backgroundColor:
                  hideAboutUsSection || hideAboutUsTitle
                    ? undefined
                    : "rgba(107, 70, 245, 0.05)",
              }}
            >
              <span>Sobre nós</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFieldVisibility("aboutUsTitle");
                }}
                className={`${
                  hideAboutUsSection ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={hideAboutUsSection}
              >
                {fieldVisibility.aboutUsTitle ? <EyeOpened /> : <EyeClosed />}
              </button>
            </div>
            {fieldVisibility.aboutUsTitle && (
              <TextAreaField
                id="aboutUsTitle"
                textareaName="aboutUsTitle"
                placeholder="Fale sobre você ou sua empresa"
                value={formData?.step2?.aboutUsTitle || ""}
                onChange={handleFieldChange("aboutUsTitle")}
                maxLength={160}
                minLength={85}
                showCharCount
                error={errors.aboutUsTitle}
                disabled={hideAboutUsTitle || hideAboutUsSection}
              />
            )}
          </div>

          <div className="py-2">
            <div
              className={`text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center ${
                hideAboutUsSection || hideSubtitles1
                  ? "bg-white-neutral-light-300"
                  : ""
              }`}
              style={{
                backgroundColor:
                  hideAboutUsSection || hideSubtitles1
                    ? undefined
                    : "rgba(107, 70, 245, 0.05)",
              }}
            >
              <span>Subtítulo 1</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFieldVisibility("aboutUsSubtitle1");
                }}
                className={`${
                  hideAboutUsSection ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={hideAboutUsSection}
              >
                {fieldVisibility.aboutUsSubtitle1 ? (
                  <EyeOpened />
                ) : (
                  <EyeClosed />
                )}
              </button>
            </div>
            {fieldVisibility.aboutUsSubtitle1 && (
              <TextAreaField
                id="aboutUsSubtitle1"
                textareaName="aboutUsSubtitle1"
                placeholder="Descreva sua empresa ou negócio"
                value={formData?.step2?.aboutUsSubtitle1 || ""}
                onChange={handleFieldChange("aboutUsSubtitle1")}
                maxLength={70}
                minLength={40}
                showCharCount
                error={errors.aboutUsSubtitle1}
                disabled={hideAboutUsSection || hideSubtitles1}
              />
            )}
          </div>

          <div className="py-2">
            <div
              className={`text-white-neutral-light-800 text-sm px-2 py-1 rounded-3xs font-medium flex justify-between items-center ${
                hideAboutUsSection || hideSubtitles2
                  ? "bg-white-neutral-light-300"
                  : ""
              }`}
              style={{
                backgroundColor:
                  hideAboutUsSection || hideSubtitles2
                    ? undefined
                    : "rgba(107, 70, 245, 0.05)",
              }}
            >
              <span>Subtítulo 2</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFieldVisibility("aboutUsSubtitle2");
                }}
                className={`${
                  hideAboutUsSection ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={hideAboutUsSection}
              >
                {fieldVisibility.aboutUsSubtitle2 ? (
                  <EyeOpened />
                ) : (
                  <EyeClosed />
                )}
              </button>
            </div>
            {fieldVisibility.aboutUsSubtitle2 && (
              <TextAreaField
                id="aboutUsSubtitle2"
                textareaName="aboutUsSubtitle2"
                placeholder="Adicione mais detalhes"
                value={formData?.step2?.aboutUsSubtitle2 || ""}
                onChange={handleFieldChange("aboutUsSubtitle2")}
                maxLength={250}
                minLength={195}
                showCharCount
                error={errors.aboutUsSubtitle2}
                disabled={hideAboutUsSection || hideSubtitles2}
              />
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[90px] xl:h-[100px] flex items-center gap-2 p-6 fixed bottom-0 bg-white-neutral-light-200">
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
        {errors.aboutUsTitle ||
        errors.aboutUsSubtitle1 ||
        errors.aboutUsSubtitle2 ? (
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
