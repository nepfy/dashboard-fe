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

// Template field configurations
const TEMPLATE_FIELD_CONFIG = {
  flash: {
    fields: ["aboutUsTitle", "aboutUsSubtitle1", "aboutUsSubtitle2"],
    aboutUsTitle: { minLength: 85, maxLength: 160 },
    aboutUsSubtitle1: { minLength: 40, maxLength: 70 },
    aboutUsSubtitle2: { minLength: 195, maxLength: 250 },
  },
  prime: {
    fields: ["aboutUsTitle", "aboutUsSubtitle1", "aboutUsSubtitle2"],
    aboutUsTitle: { minLength: 85, maxLength: 160 },
    aboutUsSubtitle1: { minLength: 40, maxLength: 70 },
    aboutUsSubtitle2: { minLength: 195, maxLength: 250 },
  },
  essencial: {
    fields: ["aboutUsTitle"],
    aboutUsTitle: { minLength: 150, maxLength: 420 },
  },
  grid: {
    fields: ["aboutUsTitle", "aboutUsSubtitle1"],
    aboutUsTitle: { minLength: 100, maxLength: 220 },
    aboutUsSubtitle1: { minLength: 150, maxLength: 420 },
  },
};

export default function AboutYourBusinessForm() {
  const {
    prevStep,
    nextStep,
    updateFormData,
    formData,
    currentStep,
    templateType,
  } = useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentTemplate =
    templateType?.toLowerCase() as keyof typeof TEMPLATE_FIELD_CONFIG;
  const templateConfig =
    TEMPLATE_FIELD_CONFIG[currentTemplate] || TEMPLATE_FIELD_CONFIG.flash;

  // Get current values from formData
  const hideAboutUsSection = formData?.step2?.hideAboutUsSection || false;
  const hideAboutUsTitle = formData?.step2?.hideAboutUsTitle || false;
  const hideSubtitles1 = formData?.step2?.hideSubtitles1 || false;
  const hideSubtitles2 = formData?.step2?.hideSubtitles2 || false;

  const handleBack = () => {
    prevStep();
  };

  const validateField = (fieldName: string, value: string): string | null => {
    if (!templateConfig.fields.includes(fieldName)) {
      return null; // Field not required for this template
    }

    const fieldConfig =
      templateConfig[fieldName as keyof typeof templateConfig];
    if (!fieldConfig || typeof fieldConfig !== "object") {
      return null;
    }

    const { minLength, maxLength } = fieldConfig as {
      minLength: number;
      maxLength: number;
    };

    if (!value.trim()) {
      const fieldNames = {
        aboutUsTitle: "Sobre nós",
        aboutUsSubtitle1: "Subtítulo 1",
        aboutUsSubtitle2: "Subtítulo 2",
      };
      return `O campo '${
        fieldNames[fieldName as keyof typeof fieldNames]
      }' é obrigatório`;
    }

    if (value.length < minLength) {
      const fieldNames = {
        aboutUsTitle: "Sobre nós",
        aboutUsSubtitle1: "Subtítulo 1",
        aboutUsSubtitle2: "Subtítulo 2",
      };
      return `O campo '${
        fieldNames[fieldName as keyof typeof fieldNames]
      }' deve ter pelo menos ${minLength} caracteres`;
    }

    if (value.length > maxLength) {
      const fieldNames = {
        aboutUsTitle: "Sobre nós",
        aboutUsSubtitle1: "Subtítulo 1",
        aboutUsSubtitle2: "Subtítulo 2",
      };
      return `O campo '${
        fieldNames[fieldName as keyof typeof fieldNames]
      }' deve ter no máximo ${maxLength} caracteres`;
    }

    return null;
  };

  const handleNext = () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    // Only validate if section is not hidden
    if (!hideAboutUsSection) {
      // Validate each field based on template configuration and visibility
      templateConfig.fields.forEach((fieldName) => {
        let isFieldVisible = false;
        let fieldValue = "";

        switch (fieldName) {
          case "aboutUsTitle":
            isFieldVisible = !hideAboutUsTitle;
            fieldValue = formData?.step2?.aboutUsTitle || "";
            break;
          case "aboutUsSubtitle1":
            isFieldVisible = !hideSubtitles1;
            fieldValue = formData?.step2?.aboutUsSubtitle1 || "";
            break;
          case "aboutUsSubtitle2":
            isFieldVisible = !hideSubtitles2;
            fieldValue = formData?.step2?.aboutUsSubtitle2 || "";
            break;
        }

        if (isFieldVisible) {
          const error = validateField(fieldName, fieldValue);
          if (error) {
            newErrors[fieldName] = error;
          }
        }
      });
    }

    // If there are validation errors, show them and prevent navigation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If all validations pass, proceed to next step
    nextStep();
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step2", {
        ...formData?.step2,
        [fieldName]: e.target.value,
      });

      // Clear error for this field when user starts typing
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

  const renderField = (fieldName: string) => {
    const fieldConfig =
      templateConfig[fieldName as keyof typeof templateConfig];
    if (!fieldConfig || typeof fieldConfig !== "object") return null;

    const { minLength, maxLength } = fieldConfig as {
      minLength: number;
      maxLength: number;
    };

    switch (fieldName) {
      case "aboutUsTitle":
        const isAboutUsTitleVisible = !hideAboutUsTitle && !hideAboutUsSection;
        return (
          <div className="py-2" key={fieldName}>
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
                {isAboutUsTitleVisible ? <EyeOpened /> : <EyeClosed />}
              </button>
            </div>
            {isAboutUsTitleVisible && (
              <TextAreaField
                id="aboutUsTitle"
                textareaName="aboutUsTitle"
                placeholder="Fale sobre você ou sua empresa"
                value={formData?.step2?.aboutUsTitle || ""}
                onChange={handleFieldChange("aboutUsTitle")}
                maxLength={maxLength}
                minLength={minLength}
                autoExpand={true}
                showCharCount
                error={errors.aboutUsTitle}
                disabled={hideAboutUsTitle || hideAboutUsSection}
                allowOverText
              />
            )}
          </div>
        );

      case "aboutUsSubtitle1":
        const isSubtitle1Visible = !hideSubtitles1 && !hideAboutUsSection;
        return (
          <div className="py-2" key={fieldName}>
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
                {isSubtitle1Visible ? <EyeOpened /> : <EyeClosed />}
              </button>
            </div>
            {isSubtitle1Visible && (
              <TextAreaField
                id="aboutUsSubtitle1"
                textareaName="aboutUsSubtitle1"
                placeholder={
                  currentTemplate === "grid"
                    ? "Descreva mais detalhes sobre sua empresa"
                    : "Descreva sua empresa ou negócio"
                }
                value={formData?.step2?.aboutUsSubtitle1 || ""}
                onChange={handleFieldChange("aboutUsSubtitle1")}
                maxLength={maxLength}
                minLength={minLength}
                autoExpand={true}
                showCharCount
                error={errors.aboutUsSubtitle1}
                disabled={hideAboutUsSection || hideSubtitles1}
                allowOverText
              />
            )}
          </div>
        );

      case "aboutUsSubtitle2":
        const isSubtitle2Visible = !hideSubtitles2 && !hideAboutUsSection;
        return (
          <div className="py-2" key={fieldName}>
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
                {isSubtitle2Visible ? <EyeOpened /> : <EyeClosed />}
              </button>
            </div>
            {isSubtitle2Visible && (
              <TextAreaField
                id="aboutUsSubtitle2"
                textareaName="aboutUsSubtitle2"
                placeholder="Adicione mais detalhes"
                value={formData?.step2?.aboutUsSubtitle2 || ""}
                onChange={handleFieldChange("aboutUsSubtitle2")}
                maxLength={maxLength}
                minLength={minLength}
                autoExpand={true}
                showCharCount
                error={errors.aboutUsSubtitle2}
                disabled={hideAboutUsSection || hideSubtitles2}
                allowOverText
              />
            )}
          </div>
        );

      default:
        return null;
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
          description="Conte quem é você ou a sua empresa"
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
          {/* Render fields based on template configuration */}
          {templateConfig.fields.map((fieldName) => renderField(fieldName))}
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
        {(errors.aboutUsTitle ||
          errors.aboutUsSubtitle1 ||
          errors.aboutUsSubtitle2) && (
          <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2">
            <InfoIcon fill="#D00003" />
            <p className="text-white-neutral-light-800 text-sm">
              Preencha todos os campos corretamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
