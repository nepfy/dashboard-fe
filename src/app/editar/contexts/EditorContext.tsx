"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  TemplateData,
  ProposalData,
  IntroductionSection,
  AboutUsSection,
  TeamSection,
  PlansSection,
  StepsSection,
  FooterSection,
  ClientsSection,
  ExpertiseSection,
  InvestmentSection,
  ResultSection,
  DeliverablesSection,
  TestimonialsSection,
  TermsConditionsSection,
  FAQSection,
} from "#/types/template-data";

interface EditorContextType {
  // State
  projectData: TemplateData | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isDirty: boolean;
  error: string | null;
  isSaving: boolean;

  // Actions
  updateIntroduction: (data: Partial<IntroductionSection>) => void;
  updateAboutUs: (data: Partial<AboutUsSection>) => void;
  updateTeam: (data: Partial<TeamSection>) => void;
  updatePlans: (data: Partial<PlansSection>) => void;
  updateSteps: (data: Partial<StepsSection>) => void;
  updateFooter: (data: Partial<FooterSection>) => void;
  updateClients: (data: Partial<ClientsSection>) => void;
  updateExpertise: (data: Partial<ExpertiseSection>) => void;
  updateInvestment: (data: Partial<InvestmentSection>) => void;
  updateResults: (data: Partial<ResultSection>) => void;
  updateDeliverables: (data: Partial<DeliverablesSection>) => void;
  updateTestimonials: (data: Partial<TestimonialsSection>) => void;
  updateTermsConditions: (data: Partial<TermsConditionsSection>) => void;
  updateFAQ: (data: Partial<FAQSection>) => void;
  updatePersonalization: (data: {
    mainColor?: string;
    projectUrl?: string;
    pagePassword?: string;
  }) => void;
  updateSectionVisibility: (sectionId: string, hidden: boolean) => void;
  getSectionVisibility: () => Record<string, boolean>;
  saveProject: () => Promise<void>;
  revertChanges: () => void;
  setProjectData: (data: TemplateData) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialData?: TemplateData;
}

export function EditorProvider({ children, initialData }: EditorProviderProps) {
  const [projectData, setProjectDataState] = useState<TemplateData | null>(
    initialData || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Browser-level unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        return "Você tem alterações não salvas. Tem certeza que deseja sair?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const setProjectData = useCallback((data: TemplateData) => {
    setProjectDataState(data);
    setIsDirty(false);
    setError(null);
  }, []);

  const updateSection = useCallback(
    (
      sectionName: keyof ProposalData,
      updates: Partial<ProposalData[keyof ProposalData]>
    ) => {
      if (!projectData) return;

      setProjectDataState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          proposalData: {
            ...prev.proposalData,
            [sectionName]: {
              ...prev.proposalData?.[sectionName],
              ...updates,
            },
          } as ProposalData,
        };
      });

      setIsDirty(true);
      setError(null);
    },
    [projectData]
  );

  // Section update functions
  const updateIntroduction = useCallback(
    (data: Partial<IntroductionSection>) => {
      updateSection("introduction", data);
    },
    [updateSection]
  );

  const updateAboutUs = useCallback(
    (data: Partial<AboutUsSection>) => {
      updateSection("aboutUs", data);
    },
    [updateSection]
  );

  const updateTeam = useCallback(
    (data: Partial<TeamSection>) => {
      updateSection("team", data);
    },
    [updateSection]
  );

  const updatePlans = useCallback(
    (data: Partial<PlansSection>) => {
      updateSection("plans", data);
    },
    [updateSection]
  );

  const updateSteps = useCallback(
    (data: Partial<StepsSection>) => {
      updateSection("steps", data);
    },
    [updateSection]
  );

  const updateFooter = useCallback(
    (data: Partial<FooterSection>) => {
      updateSection("footer", data);
    },
    [updateSection]
  );

  const updateClients = useCallback(
    (data: Partial<ClientsSection>) => {
      updateSection("clients", data);
    },
    [updateSection]
  );

  const updateExpertise = useCallback(
    (data: Partial<ExpertiseSection>) => {
      updateSection("expertise", data);
    },
    [updateSection]
  );

  const updateInvestment = useCallback(
    (data: Partial<InvestmentSection>) => {
      updateSection("investment", data);
    },
    [updateSection]
  );

  const updateResults = useCallback(
    (data: Partial<ResultSection>) => {
      updateSection("results", data);
    },
    [updateSection]
  );

  const updateDeliverables = useCallback(
    (data: Partial<DeliverablesSection>) => {
      updateSection("deliverables", data);
    },
    [updateSection]
  );

  const updateTestimonials = useCallback(
    (data: Partial<TestimonialsSection>) => {
      updateSection("testimonials", data);
    },
    [updateSection]
  );

  const updateTermsConditions = useCallback(
    (data: Partial<TermsConditionsSection>) => {
      updateSection("termsConditions", data);
    },
    [updateSection]
  );

  const updateFAQ = useCallback(
    (data: Partial<FAQSection>) => {
      updateSection("faq", data);
    },
    [updateSection]
  );

  const updatePersonalization = useCallback(
    (data: {
      mainColor?: string;
      projectUrl?: string;
      pagePassword?: string;
    }) => {
      if (!projectData) return;

      setProjectDataState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          ...(data.mainColor !== undefined && { mainColor: data.mainColor }),
          ...(data.projectUrl !== undefined && { projectUrl: data.projectUrl }),
          ...(data.pagePassword !== undefined && {
            pagePassword: data.pagePassword,
          }),
        };
      });

      setIsDirty(true);
      setError(null);
    },
    [projectData]
  );

  const updateSectionVisibility = useCallback(
    (sectionId: string, hidden: boolean) => {
      if (!projectData) return;

      // Map section IDs to their corresponding proposal data sections
      const sectionMap: Record<string, keyof ProposalData> = {
        introduction: "introduction",
        aboutUs: "aboutUs",
        team: "team",
        expertise: "expertise",
        steps: "steps",
        results: "results",
        testimonials: "testimonials",
        plans: "plans",
        investment: "investment",
        deliverables: "deliverables",
        faq: "faq",
        footer: "footer",
        clients: "clients",
        termsConditions: "termsConditions",
      };

      const sectionKey = sectionMap[sectionId];
      if (sectionKey) {
        updateSection(sectionKey, { hideSection: hidden });
      }
    },
    [updateSection, projectData]
  );

  const getSectionVisibility = useCallback(() => {
    if (!projectData?.proposalData) return {};

    const visibility: Record<string, boolean> = {};
    const proposalData = projectData.proposalData;

    // Extract hideSection flags from each section
    Object.keys(proposalData).forEach((key) => {
      const section = proposalData[key as keyof ProposalData];
      if (section && typeof section === "object" && "hideSection" in section) {
        visibility[key] = !!(section as { hideSection?: boolean }).hideSection;
      }
    });

    return visibility;
  }, [projectData]);

  const saveProject = useCallback(async () => {
    if (!projectData || !projectData.id || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save project: ${response.statusText}`);
      }

      setIsDirty(false);
      // Optionally show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [projectData, isSaving]);

  const revertChanges = useCallback(() => {
    if (initialData) {
      setProjectDataState(initialData);
      setIsDirty(false);
      setError(null);
    }
  }, [initialData]);

  const value: EditorContextType = {
    projectData,
    isLoading,
    setIsLoading,
    isDirty,
    error,
    isSaving,
    updateIntroduction,
    updateAboutUs,
    updateTeam,
    updatePlans,
    updateSteps,
    updateFooter,
    updateClients,
    updateExpertise,
    updateInvestment,
    updateResults,
    updateDeliverables,
    updateTestimonials,
    updateTermsConditions,
    updateFAQ,
    updatePersonalization,
    updateSectionVisibility,
    getSectionVisibility,
    saveProject,
    revertChanges,
    setProjectData,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
