/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ProposalFormData, TemplateType, Project, Plan } from "#/types/project";
import { useSaveDraft } from "#/hooks/useProjectGenerator/useSaveDraft";
import flash from "#/constants/flash";

interface ProjectGeneratorContextType {
  formData: ProposalFormData;
  currentStep: number;
  templateType: TemplateType | null;
  currentProjectId: string | null;
  isEditMode: boolean;
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  modalDismissed: boolean;
  setModalDismissed: (dismissed: boolean) => void;
  hasNavigatedBeyondStep1: boolean;
  setHasNavigatedBeyondStep1: (navigated: boolean) => void;
  updateFormData: <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => void;
  setTemplateType: (template: TemplateType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  importProjectData: (projectData: Project) => void;
  loadProjectData: (projectData: Project) => void;
  loadProjectWithRelations: (projectId: string) => Promise<Project | null>;
  saveDraft: () => Promise<{
    success: boolean;
    data?: Project;
    error?: string;
  }>;
  isSavingDraft: boolean;
  lastSaved: Date | null;
  getLastSavedText: () => string;
}

const ProjectGeneratorContext = createContext<
  ProjectGeneratorContextType | undefined
>(undefined);

const initialFormData: ProposalFormData = {
  step1: {
    companyName: flash.step1.companyName,
    companyEmail: flash.step1.companyEmail,
    ctaButtonTitle: flash.step1.ctaButtonTitle,
    pageTitle: flash.step1.pageTitle,
    pageSubtitle: flash.step1.pageSubtitle,
    hidePageSubtitle: flash.step1.hidePageSubtitle,
    services: flash.step1.services?.split(","),
  },
  step2: {
    hideAboutUsSection: flash.step2.hideAboutUsSection,
    hideAboutUsTitle: flash.step2.hideAboutUsTitle,
    hideAboutUsSubtitle1: flash.step2.hideAboutUsSubtitle1,
    hideAboutUsSubtitle2: flash.step2.hideAboutUsSubtitle2,
    aboutUsTitle: flash.step2.aboutUsTitle,
    aboutUsSubtitle1: flash.step2.aboutUsSubtitle1,
    aboutUsSubtitle2: flash.step2.aboutUsSubtitle2,
  },
  step3: {
    ourTeamSubtitle: flash.step3.ourTeamSubtitle,
    teamMembers: flash.step3.teamMembers,
  },
  step4: {
    expertiseSubtitle: flash.step4.expertiseSubtitle,
    expertise: flash.step4.expertise,
  },
  step5: {
    resultsSubtitle: flash.step5.resultsSubtitle,
    results: flash.step5.results,
  },
  step6: {
    clients: flash.step6.clients,
  },
  step7: {
    processSubtitle: flash.step7.processSubtitle,
    processSteps: flash.step7.processSteps,
  },
  step8: {
    ctaBackgroundImage: flash.step8.ctaBackgroundImage,
  },
  step9: {
    testimonials: flash.step9.testimonials,
  },
  step10: {
    investmentTitle: flash.step10.investmentTitle,
  },
  step11: {
    includedServices: flash.step11.includedServices,
  },
  step12: {
    plans: flash.step12.plans as Plan[],
  },
  step13: {
    termsConditions: flash.step13.termsConditions,
  },
  step14: {
    faq: flash.step14.faq,
  },
  step15: {
    endMessageTitle: flash.step15.endMessageTitle,
    endMessageTitle2: flash.step15.endMessageTitle2,
    endMessageDescription: flash.step15.endMessageDescription,
  },
  step16: {},
};

export function ProjectGeneratorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [formData, setFormData] = useState<ProposalFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [templateType, setTemplateTypeState] = useState<TemplateType | null>(
    null
  );
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [hasNavigatedBeyondStep1, setHasNavigatedBeyondStep1] = useState(false);

  const {
    saveDraft: saveDraftHook,
    isSaving: isSavingDraft,
    lastSaved,
    getLastSavedText,
    setProjectId,
    clearDraftData,
    currentProjectId: hookProjectId,
  } = useSaveDraft();

  // Initialize with persisted color from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedColor = localStorage.getItem("flash-mainColor");
      if (
        persistedColor &&
        (!formData.step1?.mainColor ||
          formData.step1.mainColor !== persistedColor)
      ) {
        setFormData((prev) => ({
          ...prev,
          step1: { ...prev.step1, mainColor: persistedColor },
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (hookProjectId && hookProjectId !== currentProjectId) {
      setCurrentProjectId(hookProjectId);
    }
  }, [hookProjectId]);

  useEffect(() => {
    if (currentProjectId && currentProjectId !== hookProjectId) {
      setProjectId(currentProjectId);
    }
  }, [currentProjectId, setProjectId]);

  const updateFormData = <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [step]: { ...prev[step], ...data },
      };

      // Persist mainColor to localStorage when it changes
      if (
        step === "step1" &&
        data &&
        typeof data === "object" &&
        "mainColor" in data
      ) {
        const mainColor = (data as { mainColor?: string }).mainColor;
        if (mainColor && typeof window !== "undefined") {
          localStorage.setItem("flash-mainColor", mainColor);
        }
      }

      return newFormData;
    });
  };

  const setTemplateType = (template: TemplateType) => {
    setTemplateTypeState(template);
    setCurrentStep(1);
  };

  const loadProjectWithRelations = async (
    projectId: string
  ): Promise<Project | null> => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}?includeRelations=true`
      );
      const result = await response.json();

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || "Erro ao carregar projeto");
    } catch (error) {
      console.error("Error loading project with relations:", error);
      return null;
    }
  };

  const loadProjectData = async (projectData: Project) => {
    if (projectData.id) {
      setCurrentProjectId(projectData.id);
      setIsEditMode(true);

      const completeProjectData = await loadProjectWithRelations(
        projectData.id
      );
      if (completeProjectData) {
        importProjectData(completeProjectData);
      } else {
        importProjectData(projectData);
      }
    } else {
      importProjectData(projectData);
    }

    if (projectData.templateType) {
      setTemplateTypeState(projectData.templateType as TemplateType);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 16);
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      return newStep;
    });
  };

  const goToStep = (step: number) => {
    const newStep = Math.max(0, Math.min(step, 16));
    setCurrentStep(newStep);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setTemplateTypeState(null);
    setCurrentProjectId(null);
    setIsEditMode(false);
    clearDraftData();
    setShowImportModal(false);
    setModalDismissed(false);
    setHasNavigatedBeyondStep1(false);
  };

  const importProjectData = (projectData: Project) => {
    if (projectData.id) {
      setCurrentProjectId(projectData.id);
    }

    const safeUpdate = <T extends keyof ProposalFormData>(
      step: T,
      data: ProposalFormData[T]
    ) => {
      const hasValidData = Object.values(data || {}).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== null && value !== undefined && value !== "";
      });

      if (hasValidData) {
        updateFormData(step, data);
      }
    };

    if (projectData.templateType) {
      setTemplateTypeState(projectData.templateType as TemplateType);
    }

    // Step 1 - Basic project metadata
    safeUpdate("step1", {
      templateType: projectData?.templateType,
      mainColor: projectData.mainColor,
      projectName: projectData.projectName,
    });

    // Step 15 - End message (includes projectValidUntil)
    safeUpdate("step15", {
      projectValidUntil: projectData.projectValidUntil
        ? new Date(projectData.projectValidUntil)
        : undefined,
    });

    // Step 16 - Project settings
    safeUpdate("step16", {
      pageUrl: projectData.projectUrl,
      pagePassword: projectData.pagePassword,
    });

    // NOTE: Template-specific content data (teamMembers, expertise, results, etc.)
    // is no longer stored in the projects table. It should be loaded from
    // template-specific tables based on templateType.
    //
  };

  const saveDraft = async () => {
    const result = await saveDraftHook(formData, templateType, hookProjectId);

    if (result.success && result.data?.id && !hookProjectId) {
      setCurrentProjectId(result.data.id);
    }

    return result;
  };

  const value = {
    formData,
    currentStep,
    templateType,
    currentProjectId: hookProjectId || currentProjectId,
    isEditMode,
    showImportModal,
    setShowImportModal,
    modalDismissed,
    setModalDismissed,
    hasNavigatedBeyondStep1,
    setHasNavigatedBeyondStep1,
    updateFormData,
    setTemplateType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    importProjectData,
    loadProjectData,
    loadProjectWithRelations,
    saveDraft,
    isSavingDraft,
    lastSaved,
    getLastSavedText,
  };

  return (
    <ProjectGeneratorContext.Provider value={value}>
      {children}
    </ProjectGeneratorContext.Provider>
  );
}

export function useProjectGenerator() {
  const context = useContext(ProjectGeneratorContext);
  if (context === undefined) {
    throw new Error(
      "useProjectGenerator must be used within a ProjectGeneratorProvider"
    );
  }
  return context;
}
