/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Save, Check, AlertCircle } from "lucide-react";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

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
  const {
    formData,
    templateType,
    currentStep,
    currentProjectId,
    saveDraft,
    isSavingDraft,
    lastSaved,
    getLastSavedText,
    isEditMode,
  } = useProjectGenerator();

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (!isSavingDraft && formData && templateType) {
        handleSaveDraft(true);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [formData, templateType, isSavingDraft]);

  const handleSaveDraft = async (isAutoSave = false) => {
    if (isSavingDraft) return;

    // Don't save if we don't have essential data
    if (!templateType) {
      console.log("SaveDraftButton: No template type, skipping save");
      return;
    }

    try {
      console.log(
        "SaveDraftButton: Saving draft with projectId:",
        currentProjectId
      );
      await saveDraft();

      setSaveStatus("success");
      setStatusMessage(
        isAutoSave ? "Salvo automaticamente" : "Rascunho salvo!"
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      console.error("SaveDraftButton: Error saving draft:", error);
      setSaveStatus("error");
      setStatusMessage("Erro ao salvar rascunho");

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
    if (isSavingDraft) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      );
    }

    switch (saveStatus) {
      case "success":
        return <Check size={16} className="text-green-600" />;
      case "error":
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Save size={16} />;
    }
  };

  const getButtonText = () => {
    if (isEditMode) return "Salvar alterações";
    if (isSavingDraft) return "Salvando...";
    if (saveStatus === "success") return "Salvo!";
    if (saveStatus === "error") return "Erro ao salvar";
    return "Salvar rascunho";
  };

  // Only show the button if we're not on step 0 (template selection)
  if (currentStep === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => handleSaveDraft(false)}
        disabled={isSavingDraft}
        className={`${getButtonClass()} ${
          isSavingDraft ? "opacity-75 cursor-not-allowed" : ""
        }`}
        title="Salvar progresso como rascunho"
      >
        {getIcon()}
        {showText && <span className="text-sm">{getButtonText()}</span>}
      </button>

      {/* Status message and last saved info */}
      {(statusMessage || lastSaved) && (
        <div className="absolute top-full left-0 mt-1 text-xs text-white-neutral-light-500 whitespace-nowrap">
          {statusMessage || getLastSavedText()}
        </div>
      )}
    </div>
  );
}
