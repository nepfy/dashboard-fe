/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Save, Check, AlertCircle } from "lucide-react";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useSaveDraft } from "#/hooks/useProjectGenerator/useSaveDraft";

interface SaveDraftButtonProps {
  className?: string;
  showText?: boolean;
  variant?: "primary" | "secondary" | "minimal";
}

export default function SaveDraftButton({
  className = "",
  showText = true,
  variant = "secondary",
}: SaveDraftButtonProps) {
  const { formData, templateType, currentStep } = useProjectGenerator();
  const { saveDraft, isSaving, lastSaved, getLastSavedText } = useSaveDraft();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (!isSaving && formData) {
        handleSaveDraft(true);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(autoSaveInterval);
  }, [formData, isSaving]);

  const handleSaveDraft = async (isAutoSave = false) => {
    if (isSaving) return;

    try {
      const result = await saveDraft(formData, templateType);

      if (result.success) {
        setSaveStatus("success");
        setStatusMessage(
          isAutoSave ? "Salvo automaticamente" : "Rascunho salvo!"
        );

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus("idle");
          setStatusMessage("");
        }, 3000);
      } else {
        setSaveStatus("error");
        setStatusMessage(result.message || "Erro ao salvar");

        // Clear error message after 5 seconds
        setTimeout(() => {
          setSaveStatus("idle");
          setStatusMessage("");
        }, 5000);
      }
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(`Erro ao salvar rascunho ${error}`);

      setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  const getButtonClass = () => {
    const baseClass =
      "flex items-center justify-center gap-2 font-medium rounded-[var(--radius-s)] transition-all duration-200 cursor-pointer";

    switch (variant) {
      case "primary":
        return `${baseClass} px-4 py-2 h-[44px] text-white bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse`;
      case "minimal":
        return `${baseClass} px-3 py-2 h-[36px] text-white-neutral-light-700 hover:text-white-neutral-light-900 hover:bg-white-neutral-light-200`;
      default: // secondary
        return `${baseClass} px-4 py-2 h-[44px] border border-white-neutral-light-300 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 text-white-neutral-light-900 button-inner`;
    }
  };

  const getIcon = () => {
    if (isSaving) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      );
    }

    switch (saveStatus) {
      case "success":
        return <Check size={16} className="hidden sm:block text-green-600" />;
      case "error":
        return (
          <AlertCircle size={16} className="hidden sm:block text-red-600" />
        );
      default:
        return <Save className="hidden sm:block" size={16} />;
    }
  };

  const getButtonText = () => {
    if (isSaving) return "Salvando...";
    if (saveStatus === "success") return "Salvo!";
    if (saveStatus === "error") return "Erro ao salvar";
    return "Salvar rascunho";
  };

  return (
    <>
      {currentStep !== 0 && (
        <div className={`relative ${className}`}>
          <button
            type="button"
            onClick={() => handleSaveDraft(false)}
            disabled={isSaving}
            className={`${getButtonClass()} ${
              isSaving ? "opacity-75 cursor-not-allowed" : ""
            }`}
            title="Salvar progresso como rascunho"
          >
            {getIcon()}
            {showText && <span className="text-sm">{getButtonText()}</span>}
          </button>

          {(statusMessage || lastSaved) && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-white-neutral-light-500 whitespace-nowrap">
              {statusMessage || getLastSavedText()}
            </div>
          )}
        </div>
      )}
    </>
  );
}
