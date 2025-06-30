"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProposalFormData, TemplateType, Project } from "#/types/project";
import { useSaveDraft } from "#/hooks/useProjectGenerator/useSaveDraft";

interface ProjectGeneratorContextType {
  formData: ProposalFormData;
  currentStep: number;
  templateType: TemplateType | null;
  currentProjectId: string | null;
  isEditMode: boolean;
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
  // Draft functionality
  saveDraft: () => Promise<void>;
  isSavingDraft: boolean;
  lastSaved: Date | null;
  getLastSavedText: () => string;
}

const ProjectGeneratorContext = createContext<
  ProjectGeneratorContextType | undefined
>(undefined);

const initialFormData: ProposalFormData = {
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
  step6: {},
  step7: {},
  step8: {},
  step9: {},
  step10: {},
  step11: {},
  step12: {},
  step13: {},
  step14: {},
  step15: {},
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

  const {
    saveDraft: saveDraftHook,
    isSaving: isSavingDraft,
    lastSaved,
    getLastSavedText,
    currentProjectId: hookProjectId,
  } = useSaveDraft();

  console.log("Context - currentStep:", currentStep);
  console.log("Context - mainColor:", formData.step1?.mainColor);

  const updateFormData = <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => {
    console.log(
      "Context - Updating form data for step:",
      step,
      "with data:",
      data
    );
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const setTemplateType = (template: TemplateType) => {
    console.log("Context - Setting template type:", template);
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
    console.log("Context - Loading project data for editing:", projectData);

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
    console.log("Context - nextStep called, current:", currentStep);
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 16);
      console.log("Context - Moving from step", prev, "to step", newStep);
      return newStep;
    });
  };

  const prevStep = () => {
    console.log("Context - prevStep called, current:", currentStep);
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      console.log("Context - Moving from step", prev, "to step", newStep);
      return newStep;
    });
  };

  const goToStep = (step: number) => {
    console.log("Context - goToStep called with step:", step);
    const newStep = Math.max(0, Math.min(step, 16));
    console.log("Context - Going to step:", newStep);
    setCurrentStep(newStep);
  };

  const resetForm = () => {
    console.log("Context - Resetting form");
    setFormData(initialFormData);
    setCurrentStep(0);
    setTemplateTypeState(null);
    setCurrentProjectId(null);
    setIsEditMode(false);
  };

  const importProjectData = (projectData: Project) => {
    console.log("Context - Importing project data:", projectData);

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

    // Step 1 - Basic company info
    safeUpdate("step1", {
      templateType: projectData?.templateType,
      mainColor: projectData.mainColor,
      clientName: projectData.clientName,
      projectName: projectData.projectName,
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      ctaButtonTitle: projectData.ctaButtonTitle,
      pageTitle: projectData.pageTitle,
      pageSubtitle: projectData.pageSubtitle,
      hidePageSubtitle: projectData.hidePageSubtitle,
      services: projectData.services
        ? projectData.services.split(",")
        : undefined,
      hideServices: projectData.hideServices,
    });

    // Step 2 - About us (Your Business)
    safeUpdate("step2", {
      hideAboutUsSection: projectData.hideAboutUsSection || false,
      aboutUsTitle: projectData.aboutUsTitle,
      aboutUsSubtitle1: projectData.aboutUsSubtitle1,
      aboutUsSubtitle2: projectData.aboutUsSubtitle2,
    });

    // Step 3 - Our team
    safeUpdate("step3", {
      ourTeamSubtitle: projectData.ourTeamSubtitle,
      hideAboutYourTeamSection: projectData.hideAboutYourTeamSection || false,
      teamMembers: projectData.teamMembers || [],
    });

    // Step 4 - Expertise
    safeUpdate("step4", {
      hideExpertiseSection: projectData.hideExpertiseSection || false,
      expertiseSubtitle: projectData.expertiseSubtitle,
      expertise: projectData.expertise || [],
    });

    // Step 5 - Results
    safeUpdate("step5", {
      hideYourResultsSection: projectData.hideResultsSection || false,
      results: projectData.results || [],
    });

    // Step 6 - Clients
    safeUpdate("step6", {
      hideClientsSection: projectData.hideClientsSection || false,
      hideLogoField: projectData.hideLogoField || false,
      clients: projectData.clients || [],
    });

    // Step 7 - Process
    safeUpdate("step7", {
      hideProcessSection: projectData.hideProcessSection || false,
      hideProcessSubtitle: projectData.hideProcessSubtitle || false,
      processSubtitle: projectData.processSubtitle,
      processSteps: projectData.processSteps || [],
    });

    // Step 8 - CTA Background
    safeUpdate("step8", {
      hideCTASection: projectData.hideCTASection || false,
      ctaBackgroundImage: projectData.ctaBackgroundImage,
    });

    // Step 9 - Testimonials
    safeUpdate("step9", {
      hideTestimonialsSection: projectData.hideTestimonialsSection || false,
      testimonials: projectData.testimonials || [],
    });

    // Step 10 - Investment
    safeUpdate("step10", {
      hideInvestmentSection: projectData.hideInvestmentSection || false,
      investmentTitle: projectData.investmentTitle,
    });

    // Step 11 - Services
    safeUpdate("step11", {
      hideIncludedServicesSection:
        projectData.hideIncludedServicesSection || false,
      includedServices: projectData.includedServices || [],
    });

    // Step 12 - Plans
    safeUpdate("step12", {
      hidePlansSection: projectData.hidePlansSection || false,
      plans: projectData.plans || [],
    });

    // Step 13 - Terms
    safeUpdate("step13", {
      hideTermsSection: projectData.hideTermsSection || false,
      termsConditions: projectData.termsConditions || [],
    });

    // Step 14 - FAQ
    safeUpdate("step14", {
      hideFaqSection: projectData.hideFaqSection || false,
      faq: projectData.faq || [],
    });

    // Step 15 - End message
    safeUpdate("step15", {
      hideFinalMessage: projectData.hideFinalMessage || false,
      hideFinalMessageSubtitle: projectData.hideFinalMessageSubtitle || false,
      endMessageTitle: projectData.endMessageTitle,
      endMessageTitle2: projectData.endMessageTitle2,
      endMessageDescription: projectData.endMessageDescription,
      projectValidUntil: projectData.projectValidUntil,
    });

    // Step 16 - Project settings
    safeUpdate("step16", {
      pageUrl: projectData.projectUrl,
      pagePassword: projectData.pagePassword,
    });
  };

  // Draft functionality
  const saveDraft = async () => {
    await saveDraftHook(
      formData,
      templateType,
      currentProjectId || hookProjectId
    );
  };

  const value = {
    formData,
    currentStep,
    templateType,
    currentProjectId: currentProjectId || hookProjectId,
    isEditMode,
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
