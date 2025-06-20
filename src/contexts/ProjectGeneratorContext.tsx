// src/contexts/ProjectGeneratorContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProposalFormData, TemplateType, Project } from "#/types/project";
import { useSaveDraft } from "#/hooks/useProjectGenerator/useSaveDraft";

interface ProjectGeneratorContextType {
  formData: ProposalFormData;
  currentStep: number;
  templateType: TemplateType | null;
  currentProjectId: string | null;
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
    setCurrentStep(1); // Move to step 1 after template selection
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
  };

  const importProjectData = (projectData: Project) => {
    console.log("Context - Importing project data:", projectData);

    // Set the current project ID
    if (projectData.id) {
      setCurrentProjectId(projectData.id);
    }

    const safeUpdate = <T extends keyof ProposalFormData>(
      step: T,
      data: ProposalFormData[T]
    ) => {
      const hasValidData = Object.values(data || {}).some(
        (value) => value !== null && value !== undefined && value !== ""
      );

      if (hasValidData) {
        updateFormData(step, data);
      }
    };

    // Set template type if available
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
      services: projectData.services
        ? projectData.services.split(",")
        : undefined,
    });

    safeUpdate("step2", {
      aboutUsTitle: projectData.aboutUsTitle,
      aboutUsSubtitle1: projectData.aboutUsSubtitle1,
      aboutUsSubtitle2: projectData.aboutUsSubtitle2,
    });

    // Step 3 - Team
    safeUpdate("step3", {
      ourTeamSubtitle: projectData.ourTeamSubtitle,
      // Note: teamMembers would need to be fetched from related tables
    });

    // Step 4 - Expertise
    safeUpdate("step4", {
      expertiseSubtitle: projectData.expertiseSubtitle,
    });

    // Step 7 - Process
    safeUpdate("step7", {
      processSubtitle: projectData.processSubtitle,
    });

    // Step 8 - CTA Background
    safeUpdate("step8", {
      ctaBackgroundImage: projectData.ctaBackgroundImage,
    });

    // Step 10 - Investment
    safeUpdate("step10", {
      investmentTitle: projectData.investmentTitle,
    });

    safeUpdate("step11", {
      includedServices: projectData.includedServices,
      deliveryServices: projectData.deliveryServices,
    });

    // Step 13 - Terms
    safeUpdate("step13", {
      termsConditions: projectData?.termsConditions,
    });

    // Step 15 - End message
    safeUpdate("step15", {
      endMessageTitle: projectData.endMessageTitle,
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
    updateFormData,
    setTemplateType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    importProjectData,
    // Draft functionality
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
