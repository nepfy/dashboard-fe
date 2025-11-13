"use client";

import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
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
        className={`border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 button-inner flex h-[44px] cursor-pointer items-center justify-center rounded-[10px] border px-4 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        title="Salvar rascunho"
      >
        {isSaving ? (
          <>
            <LoaderCircle className="text-primary-light-400 animate-spin" />
            <span className="ml-2 text-sm">Salvando</span>
          </>
        ) : (
          <>
            <Save size={18} strokeWidth={1} />
            <span className="ml-2 text-sm">Salvar rascunho</span>
          </>
        )}
      </button>

      {isVisible && (
        <div className="text-white-neutral-light-900 absolute top-12 left-4 text-xs">
          {getLastSavedText()}
        </div>
      )}
    </div>
  );
}
