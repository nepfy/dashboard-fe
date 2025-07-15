"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useState, useEffect } from "react";

import InfoIcon from "#/components/icons/InfoIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import { TextField, TextAreaField, DatePicker } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function FinalMessageForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize subtitleVisible based on formData
  const [subtitleVisible, setSubtitleVisible] = useState(
    !formData?.step15?.hideFinalMessageSubtitle
  );

  // Sync subtitleVisible with formData when it changes
  useEffect(() => {
    setSubtitleVisible(!formData?.step15?.hideFinalMessageSubtitle);
  }, [formData?.step15?.hideFinalMessageSubtitle]);

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const endMessageTitle = formData?.step15?.endMessageTitle || "";
    const endMessageTitle2 = formData?.step15?.endMessageTitle2 || "";
    const endMessageDescription = formData?.step15?.endMessageDescription || "";
    const projectValidUntil = formData?.step15?.projectValidUntil || "";
    const hideSection = formData?.step15?.hideFinalMessage || false;
    const hideFinalMessageSubtitle =
      formData?.step15?.hideFinalMessageSubtitle || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      // Validate Agradecimento 1
      if (!endMessageTitle.trim()) {
        newErrors.endMessageTitle = "O campo 'Agradecimento 1' é obrigatório";
      } else {
        if (endMessageTitle.length < 20) {
          newErrors.endMessageTitle =
            "O campo 'Agradecimento 1' deve ter pelo menos 20 caracteres";
        } else if (endMessageTitle.length > 50) {
          newErrors.endMessageTitle =
            "O campo 'Agradecimento 1' deve ter no máximo 50 caracteres";
        }
      }

      // Validate Agradecimento 2
      if (!endMessageTitle2.trim()) {
        newErrors.endMessageTitle2 = "O campo 'Agradecimento 2' é obrigatório";
      } else {
        if (endMessageTitle2.length < 20) {
          newErrors.endMessageTitle2 =
            "O campo 'Agradecimento 2' deve ter pelo menos 20 caracteres";
        } else if (endMessageTitle2.length > 50) {
          newErrors.endMessageTitle2 =
            "O campo 'Agradecimento 2' deve ter no máximo 50 caracteres";
        }
      }

      // Validate Subtítulo only if it's visible
      if (!hideFinalMessageSubtitle) {
        if (!endMessageDescription.trim()) {
          newErrors.endMessageDescription = "O campo 'Subtítulo' é obrigatório";
        } else {
          if (endMessageDescription.length < 70) {
            newErrors.endMessageDescription =
              "O campo 'Subtítulo' deve ter pelo menos 70 caracteres";
          } else if (endMessageDescription.length > 225) {
            newErrors.endMessageDescription =
              "O campo 'Subtítulo' deve ter no máximo 225 caracteres";
          }
        }
      }

      // Validate Validade da proposta
      if (
        !projectValidUntil ||
        (typeof projectValidUntil === "string" &&
          projectValidUntil.trim() === "")
      ) {
        newErrors.projectValidUntil =
          "O campo 'Validade da proposta' é obrigatório";
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

  const isFormDisabled = formData?.step15?.hideFinalMessage || false;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
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
          <div className="py-2">
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              Agradecimento 1
            </label>
            <TextField
              inputName="endMessageTitle"
              id="endMessageTitle"
              type="text"
              placeholder="Ex: Obrigado pela sua atenção!"
              value={formData?.step15?.endMessageTitle || ""}
              onChange={handleFieldChange("endMessageTitle")}
              maxLength={50}
              showCharCount
              error={errors.endMessageTitle}
              disabled={isFormDisabled}
              allowOverText
            />
          </div>

          <div className="py-2">
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              Agradecimento 2
            </label>
            <TextField
              inputName="endMessageTitle2"
              id="endMessageTitle2"
              type="text"
              placeholder="Ex: Esperamos seu retorno em breve!"
              value={formData?.step15?.endMessageTitle2 || ""}
              onChange={handleFieldChange("endMessageTitle2")}
              maxLength={50}
              showCharCount
              error={errors.endMessageTitle2}
              disabled={isFormDisabled}
              allowOverText
            />
          </div>

          <div className="py-2">
            <label
              className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              Subtítulo
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
                placeholder="Escreva uma mensagem de agradecimento e próximos passos"
                value={formData?.step15?.endMessageDescription || ""}
                onChange={handleFieldChange("endMessageDescription")}
                maxLength={225}
                minLength={70}
                showCharCount
                rows={4}
                error={errors.endMessageDescription}
                disabled={isFormDisabled || !subtitleVisible}
                style={{
                  display: subtitleVisible ? "block" : "none",
                }}
                allowOverText
                autoExpand
              />
            )}
          </div>

          <div className="py-2 max-w-[235px] w-full">
            <DatePicker
              label="Qual a validade desta proposta?"
              inputName="projectValidUntil"
              id="projectValidUntil"
              placeholder="Escolha uma data"
              value={getDateValue()}
              onChange={handleDateChange}
              error={errors.projectValidUntil}
              disabled={isFormDisabled}
            />
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
