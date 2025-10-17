"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useSaveDraft } from "#/hooks/useProjectGenerator/useSaveDraft";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { toast, Slide } from "react-toastify";
import { ProposalFormData } from "#/types/project";

interface SaveDraftButtonProps {
  mainColor?: string;
  detailedClientInfo?: string;
  originalPageUrl?: string;
  pagePassword?: string;
  validUntil?: string;
  selectedService?: string | null;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo: string;
  selectedPlan?: number | null;
  className?: string;
}

export function SaveDraftButton({
  mainColor,
  detailedClientInfo,
  originalPageUrl,
  pagePassword,
  validUntil,
  selectedService,
  clientName,
  projectName,
  projectDescription,
  companyInfo,
  selectedPlan,
  className = "",
}: SaveDraftButtonProps) {
  const { saveDraft, isSaving, getLastSavedText } = useSaveDraft();
  const { templateType } = useProjectGenerator();
  const [isVisible, setIsVisible] = useState(false);

  const handleSaveDraft = async () => {
    const proposalData = {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      detailedClientInfo,
      companyInfo,
      selectedPlan,
      templateType,
      mainColor,
      originalPageUrl,
      pagePassword,
      validUntil,
    };

    const result = await saveDraft(
      proposalData as ProposalFormData,
      templateType
    );

    if (result.success) {
      toast.success("Rascunho salvo com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: "font-satoshi",
      });
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 2000);
    } else {
      toast.error(result.message || "Erro ao salvar rascunho", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: "font-satoshi",
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSaveDraft}
        disabled={isSaving}
        className={`h-[44px] px-4 border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Salvar rascunho"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm ml-2">Salvando</span>
          </>
        ) : (
          <>
            <Save size={18} strokeWidth={1} />
            <span className="text-sm ml-2">Salvar rascunho</span>
          </>
        )}
      </button>

      {isVisible && (
        <div className="absolute top-12 left-4 text-white-neutral-light-900 text-xs">
          {getLastSavedText()}
        </div>
      )}
    </div>
  );
}
