// src/hooks/useProjectGenerator/useProjectGenerator.ts
import { useState } from "react";
import { ProposalFormData, TemplateType } from "#/types/project";

import { Project } from "#/types/project";

interface UseProjectGeneratorReturn {
  formData: ProposalFormData;
  currentStep: number;
  templateType: TemplateType | null;
  updateFormData: <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => void;
  setTemplateType: (template: TemplateType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  importProjectData: (projectData: Project) => void; // New method
}

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

export function useProjectGenerator(): UseProjectGeneratorReturn {
  const [formData, setFormData] = useState<ProposalFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0); // 0 for template selection
  const [templateType, setTemplateTypeState] = useState<TemplateType | null>(
    null
  );

  const updateFormData = <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const setTemplateType = (template: TemplateType) => {
    setTemplateTypeState(template);
    setCurrentStep(1); // Move to first step after template selection
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 16));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 16)));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setTemplateTypeState(null);
  };

  const importProjectData = (projectData: Project) => {
    // Helper function to safely map project data to form steps
    const safeUpdate = <T extends keyof ProposalFormData>(
      step: T,
      data: ProposalFormData[T]
    ) => {
      // Only update if data contains valid values
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
      mainColor: projectData.mainColor,
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      ctaButtonTitle: projectData.ctaButtonTitle,
      pageTitle: projectData.pageTitle,
      pageSubtitle: projectData.pageSubtitle,
      services: projectData.services
        ? projectData.services.split(",")
        : undefined,
    });

    // Step 2 - About us
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

    // Step 5 - Results
    safeUpdate("step5", {
      resultsSubtitle: projectData.resultsSubtitle,
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

    // Step 13 - Terms
    safeUpdate("step13", {
      termsTitle: projectData.termsTitle,
    });

    // Step 15 - End message
    safeUpdate("step15", {
      endMessageTitle: projectData.endMessageTitle,
      endMessageDescription: projectData.endMessageDescription,
    });

    // Step 16 - Project settings
    safeUpdate("step16", {
      pageUrl: projectData.projectUrl,
      pagePassword: projectData.pagePassword,
      projectValidUntil: projectData.projectValidUntil,
    });
  };

  return {
    formData,
    currentStep,
    templateType,
    updateFormData,
    setTemplateType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    importProjectData,
  };
}
