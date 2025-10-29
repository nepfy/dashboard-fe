/* eslint-disable react-hooks/exhaustive-deps */
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
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
} from "#/types/template-data";
import { useRouter } from "next/navigation";

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
  updateProjectValidUntil: (date: Date | string | null) => void;
  updateButtonConfig: (data: {
    buttonTitle?: string;
    buttonWhereToOpen?: "link" | "whatsapp";
    buttonHref?: string;
    buttonPhone?: string;
  }) => void;
  updateSectionVisibility: (sectionId: string, hidden: boolean) => void;
  getSectionVisibility: () => Record<string, boolean>;
  saveProject: () => Promise<void>;
  revertChanges: () => void;
  setProjectData: (data: TemplateData) => void;

  // Team member CRUD operations
  updateTeamMember: (memberId: string, data: Partial<TeamMember>) => void;
  addTeamMember: () => void;
  deleteTeamMember: (memberId: string) => void;
  reorderTeamMembers: (members: TeamMember[]) => void;

  // Result item CRUD operations
  updateResultItem: (itemId: string, data: Partial<Result>) => void;
  addResultItem: () => void;
  deleteResultItem: (itemId: string) => void;
  reorderResultItems: (items: Result[]) => void;

  // Expertise topic CRUD operations
  updateExpertiseTopic: (
    topicId: string,
    data: Partial<ExpertiseTopic>
  ) => void;
  addExpertiseTopic: () => void;
  deleteExpertiseTopic: (topicId: string) => void;
  reorderExpertiseTopics: (topics: ExpertiseTopic[]) => void;

  // Testimonial CRUD operations
  updateTestimonialItem: (itemId: string, data: Partial<Testimonial>) => void;
  addTestimonialItem: () => void;
  deleteTestimonialItem: (itemId: string) => void;
  reorderTestimonialItems: (items: Testimonial[]) => void;
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
  const router = useRouter();
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

  const updateProjectValidUntil = useCallback(
    (date: Date | string | null) => {
      if (!projectData) return;

      setProjectDataState((prev) => {
        if (!prev) return prev;

        let dateToSave: string | undefined;

        if (date) {
          if (typeof date === "string") {
            dateToSave = date;
          } else {
            // Format as YYYY-MM-DD in local timezone
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            dateToSave = `${year}-${month}-${day}`;
          }
        }

        return {
          ...prev,
          projectValidUntil: dateToSave,
        };
      });

      setIsDirty(true);
      setError(null);
    },
    [projectData]
  );

  const updateButtonConfig = useCallback(
    (data: {
      buttonTitle?: string;
      buttonWhereToOpen?: "link" | "whatsapp";
      buttonHref?: string;
      buttonPhone?: string;
    }) => {
      if (!projectData) return;

      setProjectDataState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          buttonConfig: {
            ...prev.buttonConfig,
            ...data,
          },
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
        escope: "escope",
        faq: "faq",
        footer: "footer",
        clients: "clients",
        termsConditions: "termsConditions",
      };

      const sectionKey = sectionMap[sectionId];
      if (sectionKey) {
        updateSection(sectionKey, {
          hideSection: hidden,
        });
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
      router.push(
        `/dashboard?success&project=${projectData.projectName}&projectId=${projectData.id}`
      );
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

  // Team member CRUD operations
  const updateTeamMember = useCallback(
    (memberId: string, data: Partial<TeamMember>) => {
      if (!projectData?.proposalData?.team?.members) return;

      const updatedMembers = projectData.proposalData.team.members.map(
        (member) => (member.id === memberId ? { ...member, ...data } : member)
      );

      updateSection("team", { members: updatedMembers });
    },
    [projectData, updateSection]
  );

  const addTeamMember = useCallback(() => {
    if (!projectData?.proposalData?.team?.members) return;

    const currentMembers = projectData.proposalData.team.members;
    if (currentMembers.length >= 6) return; // Max 6 members

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: "",
      role: "",
      image: "",
      hidePhoto: false,
      hideMember: false,
      sortOrder: currentMembers.length,
    };

    updateSection("team", { members: [...currentMembers, newMember] });
  }, [projectData, updateSection]);

  const deleteTeamMember = useCallback(
    (memberId: string) => {
      if (!projectData?.proposalData?.team?.members) return;

      const updatedMembers = projectData.proposalData.team.members.filter(
        (member) => member.id !== memberId
      );

      updateSection("team", { members: updatedMembers });
    },
    [projectData, updateSection]
  );

  const reorderTeamMembers = useCallback(
    (members: TeamMember[]) => {
      const reorderedMembers = members.map((member, index) => ({
        ...member,
        sortOrder: index,
      }));

      updateSection("team", { members: reorderedMembers });
    },
    [updateSection]
  );

  // Result item CRUD operations
  const updateResultItem = useCallback(
    (itemId: string, data: Partial<Result>) => {
      if (!projectData?.proposalData?.results?.items) return;

      const updatedItems = projectData.proposalData.results.items.map((item) =>
        item.id === itemId ? { ...item, ...data } : item
      );

      updateSection("results", { items: updatedItems });
    },
    [projectData, updateSection]
  );

  const addResultItem = useCallback(() => {
    if (!projectData?.proposalData?.results?.items) return;

    const currentItems = projectData.proposalData.results.items;
    if (currentItems.length >= 6) return; // Max 6 results

    const newItem: Result = {
      id: `result-${Date.now()}`,
      client: "",
      instagram: "",
      investment: "",
      roi: "",
      photo: null,
      hidePhoto: false,
      sortOrder: currentItems.length,
    };

    updateSection("results", { items: [...currentItems, newItem] });
  }, [projectData, updateSection]);

  const deleteResultItem = useCallback(
    (itemId: string) => {
      if (!projectData?.proposalData?.results?.items) return;

      const updatedItems = projectData.proposalData.results.items.filter(
        (item) => item.id !== itemId
      );

      updateSection("results", { items: updatedItems });
    },
    [projectData, updateSection]
  );

  const reorderResultItems = useCallback(
    (items: Result[]) => {
      const reorderedItems = items.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));

      updateSection("results", { items: reorderedItems });
    },
    [updateSection]
  );

  // Expertise topic CRUD operations
  const updateExpertiseTopic = useCallback(
    (topicId: string, data: Partial<ExpertiseTopic>) => {
      if (!projectData?.proposalData?.expertise?.topics) return;

      const updatedTopics = projectData.proposalData.expertise.topics.map(
        (topic) => (topic.id === topicId ? { ...topic, ...data } : topic)
      );

      updateSection("expertise", { topics: updatedTopics });
    },
    [projectData, updateSection]
  );

  const addExpertiseTopic = useCallback(() => {
    if (!projectData?.proposalData?.expertise?.topics) return;

    const currentTopics = projectData.proposalData.expertise.topics;
    if (currentTopics.length >= 6) return; // Max 6 topics

    const newTopic: ExpertiseTopic = {
      id: `topic-${Date.now()}`,
      title: "",
      description: "",
      icon: "",
      hideTitleField: false,
      hideDescription: false,
      sortOrder: currentTopics.length,
    };

    updateSection("expertise", { topics: [...currentTopics, newTopic] });
  }, [projectData, updateSection]);

  const deleteExpertiseTopic = useCallback(
    (topicId: string) => {
      if (!projectData?.proposalData?.expertise?.topics) return;

      const updatedTopics = projectData.proposalData.expertise.topics.filter(
        (topic) => topic.id !== topicId
      );

      updateSection("expertise", { topics: updatedTopics });
    },
    [projectData, updateSection]
  );

  const reorderExpertiseTopics = useCallback(
    (topics: ExpertiseTopic[]) => {
      const reorderedTopics = topics.map((topic, index) => ({
        ...topic,
        sortOrder: index,
      }));

      updateSection("expertise", { topics: reorderedTopics });
    },
    [updateSection]
  );

  // Testimonial CRUD operations
  const updateTestimonialItem = useCallback(
    (itemId: string, data: Partial<Testimonial>) => {
      if (!projectData?.proposalData?.testimonials?.items) return;

      const updatedItems = projectData.proposalData.testimonials.items.map(
        (item) => (item.id === itemId ? { ...item, ...data } : item)
      );

      updateSection("testimonials", { items: updatedItems });
    },
    [projectData, updateSection]
  );

  const addTestimonialItem = useCallback(() => {
    if (!projectData?.proposalData?.testimonials?.items) return;

    const currentItems = projectData.proposalData.testimonials.items;
    if (currentItems.length >= 6) return; // Max 6 testimonials

    const newItem: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: "",
      role: "",
      testimonial: "",
      photo: "",
      hidePhoto: false,
      sortOrder: currentItems.length,
    };

    updateSection("testimonials", { items: [...currentItems, newItem] });
  }, [projectData, updateSection]);

  const deleteTestimonialItem = useCallback(
    (itemId: string) => {
      if (!projectData?.proposalData?.testimonials?.items) return;

      const updatedItems = projectData.proposalData.testimonials.items.filter(
        (item) => item.id !== itemId
      );

      updateSection("testimonials", { items: updatedItems });
    },
    [projectData, updateSection]
  );

  const reorderTestimonialItems = useCallback(
    (items: Testimonial[]) => {
      const reorderedItems = items.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));

      updateSection("testimonials", { items: reorderedItems });
    },
    [updateSection]
  );

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
    updateProjectValidUntil,
    updateButtonConfig,
    updateSectionVisibility,
    getSectionVisibility,
    saveProject,
    revertChanges,
    setProjectData,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    reorderTeamMembers,
    updateResultItem,
    addResultItem,
    deleteResultItem,
    reorderResultItems,
    updateExpertiseTopic,
    addExpertiseTopic,
    deleteExpertiseTopic,
    reorderExpertiseTopics,
    updateTestimonialItem,
    addTestimonialItem,
    deleteTestimonialItem,
    reorderTestimonialItems,
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
