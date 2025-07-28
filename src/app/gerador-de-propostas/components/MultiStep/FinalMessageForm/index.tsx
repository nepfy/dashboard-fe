"use client";

import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

import InfoIcon from "#/components/icons/InfoIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import { TextField, TextAreaField, DatePicker } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

interface FieldValidation {
  required?: boolean;
  maxLength?: number;
  isEmail?: boolean;
}

interface TemplateConfig {
  fields: string[];
  labels: Record<string, string>;
  placeholders?: Record<string, string>;
  validation: Record<string, FieldValidation>;
}

const TEMPLATE_FIELD_CONFIG: Record<string, TemplateConfig> = {
  flash: {
    fields: [
      "endMessageTitle",
      "endMessageTitle2",
      "endMessageDescription",
      "projectValidUntil",
    ],
    labels: {
      endMessageTitle: "Agradecimento 1",
      endMessageTitle2: "Agradecimento 2",
      endMessageDescription: "Subtítulo",
      projectValidUntil: "Qual a validade desta proposta?",
    },
    placeholders: {
      endMessageTitle: "Ex: Agradecemos pela oportunidade!",
      endMessageTitle2: "Ex: Esperamos seu retorno em breve!",
      endMessageDescription:
        "Escreva uma mensagem de agradecimento e próximos passos",
    },
    validation: {
      endMessageTitle: { required: true },
      endMessageTitle2: { required: true },
      endMessageDescription: { required: true },
      projectValidUntil: { required: true },
    },
  },
  prime: {
    fields: [
      "endMessageTitle",
      "endMessageTitle2",
      "endMessageDescription",
      "projectValidUntil",
    ],
    labels: {
      endMessageTitle: "Agradecimento",
      endMessageTitle2: "Frase de Impacto",
      endMessageDescription: "Subtítulo",
      projectValidUntil: "Qual a validade desta proposta?",
    },
    placeholders: {
      endMessageTitle: "Ex: Agradecemos pela oportunidade!",
      endMessageTitle2: "Adicione uma frase impactante",
      endMessageDescription:
        "Escreva uma mensagem de agradecimento e próximos passos",
    },
    validation: {
      endMessageTitle: { required: true },
      endMessageTitle2: { required: true },
      endMessageDescription: { required: true },
      projectValidUntil: { required: true },
    },
  },
  essencial: {
    fields: ["endMessageTitle", "endMessageDescription", "projectValidUntil"],
    labels: {
      endMessageTitle: "Frase de Impacto",
      endMessageDescription: "Subtítulo",
      projectValidUntil: "Qual a validade desta proposta?",
    },
    placeholders: {
      endMessageTitle: "Adicione uma frase impactante",
      endMessageDescription:
        "Escreva uma mensagem de agradecimento e próximos passos",
    },
    validation: {
      endMessageTitle: { required: true },
      endMessageDescription: { required: true },
      projectValidUntil: { required: true },
    },
  },
  grid: {
    fields: [
      "endMessageTitle",
      "endMessageDescription",
      "endMessageTitle2",
      "projectValidUntil",
    ],
    labels: {
      endMessageTitle: "Frase de Impacto",
      endMessageDescription: "Subtítulo",
      endMessageTitle2: "Email",
      projectValidUntil: "Qual a validade desta proposta?",
    },
    placeholders: {
      endMessageTitle: "Adicione uma frase impactante",
      endMessageDescription:
        "Escreva uma mensagem de agradecimento e próximos passos",
      endMessageTitle2: "Digite seu email de contato",
    },
    validation: {
      endMessageTitle: { required: true },
      endMessageDescription: { required: true },
      endMessageTitle2: { required: true, isEmail: true },
      projectValidUntil: { required: true },
    },
  },
};

export default function FinalMessageForm() {
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

  const [subtitleVisible, setSubtitleVisible] = useState(
    !formData?.step15?.hideFinalMessageSubtitle
  );

  useEffect(() => {
    setSubtitleVisible(!formData?.step15?.hideFinalMessageSubtitle);
  }, [formData?.step15?.hideFinalMessageSubtitle]);

  const handleBack = () => {
    prevStep();
  };

  const validateField = (fieldName: string, value: string): string | null => {
    if (!templateConfig.fields.includes(fieldName)) {
      return null;
    }

    const fieldValidation = templateConfig.validation[fieldName];
    if (!fieldValidation) return null;

    const label = templateConfig.labels[fieldName];

    if (fieldValidation.required && (!value || !value.trim())) {
      return `O campo '${label}' é obrigatório`;
    }

    if (!value || !value.trim()) return null;

    if (fieldValidation.isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Por favor, insira um email válido";
      }
    }

    return null;
  };

  const handleNext = () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    const hideSection = formData?.step15?.hideFinalMessage || false;
    const hideFinalMessageSubtitle =
      formData?.step15?.hideFinalMessageSubtitle || false;

    if (!hideSection) {
      templateConfig.fields.forEach((fieldName) => {
        let fieldValue = "";
        let shouldValidate = true;

        switch (fieldName) {
          case "endMessageTitle":
            fieldValue = formData?.step15?.endMessageTitle || "";
            break;
          case "endMessageTitle2":
            fieldValue = formData?.step15?.endMessageTitle2 || "";
            break;
          case "endMessageDescription":
            fieldValue = formData?.step15?.endMessageDescription || "";
            shouldValidate = !hideFinalMessageSubtitle;
            break;
          case "projectValidUntil":
            fieldValue = String(formData?.step15?.projectValidUntil || "");
            break;
        }

        if (shouldValidate) {
          const error = validateField(fieldName, fieldValue);
          if (error) {
            newErrors[fieldName] = error;
          }
        }
      });
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
      if (isFormDisabled) return;

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
    if (isFormDisabled) return;

    updateFormData("step15", {
      ...formData?.step15,
      projectValidUntil: e.target.value,
    });

    if (errors.projectValidUntil) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.projectValidUntil;
        return newErrors;
      });
    }
  };

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step15", {
      ...formData?.step15,
      hideFinalMessage: isHidden,
    });
  };

  const toggleSubtitleVisibility = () => {
    if (isFormDisabled) return;

    const newVisibility = !subtitleVisible;

    updateFormData("step15", {
      ...formData?.step15,
      hideFinalMessageSubtitle: !newVisibility,
    });

    if (!newVisibility && errors.endMessageDescription) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.endMessageDescription;
        return newErrors;
      });
    }
  };

  const getDateValue = () => {
    try {
      const dateValue = formData?.step15?.projectValidUntil;

      if (!dateValue || dateValue.toString().trim() === "") {
        return "";
      }

      const date = new Date(dateValue).toISOString().split("T")[0];
      return date;
    } catch {
      return "";
    }
  };

  const renderField = (fieldName: string) => {
    if (!templateConfig.fields.includes(fieldName)) return null;

    const label = templateConfig.labels[fieldName];
    const placeholder = templateConfig.placeholders?.[fieldName] || "";

    switch (fieldName) {
      case "endMessageTitle":
        return (
          <div className="py-2" key={fieldName}>
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              {label}
            </label>
            <TextField
              inputName="endMessageTitle"
              id="endMessageTitle"
              type="text"
              placeholder={placeholder}
              value={formData?.step15?.endMessageTitle || ""}
              onChange={handleFieldChange("endMessageTitle")}
              showCharCount
              error={errors.endMessageTitle}
              disabled={isFormDisabled}
              charCountMessage="Recomendado: 50 caracteres"
            />
          </div>
        );

      case "endMessageTitle2":
        return (
          <div className="py-2" key={fieldName}>
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              {label}
            </label>
            <TextField
              inputName="endMessageTitle2"
              id="endMessageTitle2"
              type={currentTemplate === "grid" ? "email" : "text"}
              placeholder={placeholder}
              value={formData?.step15?.endMessageTitle2 || ""}
              onChange={handleFieldChange("endMessageTitle2")}
              showCharCount={currentTemplate !== "grid"} // Don't show char count for email field
              error={errors.endMessageTitle2}
              disabled={isFormDisabled}
              charCountMessage="Recomendado: 50 caracteres"
            />
          </div>
        );

      case "endMessageDescription":
        return (
          <div className="py-2" key={fieldName}>
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              {label}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSubtitleVisibility();
                }}
                className={`cursor-pointer ${
                  isFormDisabled ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isFormDisabled}
              >
                {subtitleVisible ? <EyeOpened /> : <EyeClosed />}
              </button>
            </label>
            {subtitleVisible && (
              <TextAreaField
                id="endMessageDescription"
                textareaName="endMessageDescription"
                placeholder={placeholder}
                value={formData?.step15?.endMessageDescription || ""}
                onChange={handleFieldChange("endMessageDescription")}
                showCharCount
                rows={4}
                error={errors.endMessageDescription}
                disabled={isFormDisabled || !subtitleVisible}
                style={{
                  display: subtitleVisible ? "block" : "none",
                }}
                autoExpand
                charCountMessage="Recomendado: 50 caracteres"
              />
            )}
          </div>
        );

      case "projectValidUntil":
        return (
          <div className="py-2 max-w-[235px] w-full" key={fieldName}>
            <DatePicker
              label={label}
              inputName="projectValidUntil"
              id="projectValidUntil"
              placeholder="Escolha uma data"
              value={getDateValue()}
              onChange={handleDateChange}
              error={errors.projectValidUntil}
              disabled={isFormDisabled}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isFormDisabled = formData?.step15?.hideFinalMessage || false;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
      <div className="p-7 mb-20">
        <div className="mb-6">
          <StepProgressIndicator currentStep={currentStep} />
        </div>
        {/* <button
          type="button"
          onClick={() => {}}
          className="xl:hidden mb-4 w-full p-3 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
        >
          <Eye width="18" height="18" /> Pré-visualizar essa seção
        </button> */}
        <TitleDescription
          title="Mensagem final:"
          description="Finalize com um agradecimento e convite para avançar"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step15?.hideFinalMessage || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isFormDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Mensagem Final&quot;</span> está
              atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className={`py-6 ${isFormDisabled ? "opacity-60" : ""}`}>
          {templateConfig.fields.map((fieldName) => renderField(fieldName))}
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
        {hasErrors && !isFormDisabled ? (
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
