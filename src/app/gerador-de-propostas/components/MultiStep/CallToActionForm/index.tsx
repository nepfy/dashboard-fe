"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import InfoIcon from "#/components/icons/InfoIcon";

import { useImageUpload } from "#/hooks/useImageUpload";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

export default function CallToActionForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const { uploadImage, clearError } = useImageUpload();

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step8", {
      ...formData?.step8,
      hideCTASection: isHidden,
      // Se a seção for ocultada, limpar a imagem
      ctaBackgroundImage: isHidden
        ? ""
        : formData?.step8?.ctaBackgroundImage || "",
      ctaBackgroundImageName: isHidden
        ? ""
        : formData?.step8?.ctaBackgroundImageName || "",
    });

    // Limpar erro de upload quando ocultar seção
    if (isHidden) {
      setUploadError("");
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file || isDisabled) return;

    // Limpar erros anteriores
    setUploadError("");
    clearError();

    try {
      // Set uploading state
      setIsUploading(true);

      // Upload the image
      const result = await uploadImage(file);

      if (result.success && result.data) {
        // Update the form data with the uploaded image URL
        updateFormData("step8", {
          ...formData?.step8,
          ctaBackgroundImage: result.data.url,
          ctaBackgroundImageName: file.name,
        });
      } else {
        console.error("Upload failed:", result.error);
        // Definir erro específico ao invés de alert
        setUploadError(result.error || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Definir erro específico ao invés de alert
      setUploadError("Erro ao fazer upload da imagem");
    } finally {
      // Remove uploading state
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const ctaBackgroundImage = formData?.step8?.ctaBackgroundImage;
    const hideSection = formData?.step8?.hideCTASection || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (!ctaBackgroundImage) {
        newErrors.ctaBackgroundImage = "Uma imagem de fundo é obrigatória";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  // Determinar se o formulário deve estar desabilitado
  const isDisabled = formData?.step8?.hideCTASection || false;

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
          title="Chamada para ação:"
          description="Reforce o convite para seguir com o projeto"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step8?.hideCTASection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Chamada para ação&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        {!isDisabled && (
          <div className="mt-6 space-y-4">
            <div className={`${isDisabled ? "opacity-60" : ""}`}>
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Plano de fundo do CTA
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-[200px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="cta-background-image"
                    disabled={isUploading || isDisabled}
                  />
                  <label
                    htmlFor="cta-background-image"
                    className={`w-full sm:w-[200px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white-neutral-light-300 rounded-2xs transition-colors button-inner ${
                      isUploading || isDisabled
                        ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                        : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <PictureIcon width="16" height="16" />
                        Alterar imagem
                      </>
                    )}
                  </label>
                </div>
                <div className="text-xs text-white-neutral-light-500">
                  {formData?.step8?.ctaBackgroundImageName ||
                    (formData?.step8?.ctaBackgroundImage
                      ? "Imagem carregada"
                      : "Nenhuma imagem selecionada")}
                </div>
              </div>
              <div className="text-xs text-white-neutral-light-400 mt-3">
                Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo: 5MB
              </div>

              {/* Show upload error if exists */}
              {uploadError && (
                <div className="text-xs text-red-500 mt-2 font-medium">
                  {uploadError}
                </div>
              )}
              {errors.ctaBackgroundImage && !isDisabled && (
                <p className="text-red-700 rounded-md text-sm font-medium mt-2">
                  {errors.ctaBackgroundImage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6">
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
        {errors.ctaBackgroundImage ? (
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
