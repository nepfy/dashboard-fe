"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ProposalGeneratorState {
  // Step management
  currentStep: string;
  setCurrentStep: (step: string) => void;

  // Service selection
  selectedService: string | null;
  setSelectedService: (service: string | null) => void;

  // Client information
  clientName: string;
  setClientName: (name: string) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  detailedClientInfo: string;
  setDetailedClientInfo: (info: string) => void;

  // Company information
  companyInfo: string;
  setCompanyInfo: (info: string) => void;

  // Pricing
  selectedPlan: number | null;
  setSelectedPlan: (plan: number | null) => void;

  // Page settings
  originalPageUrl: string;
  setOriginalPageUrl: (url: string) => void;
  pagePassword: string;
  setPagePassword: (password: string) => void;
  validUntil: string;
  setValidUntil: (date: string) => void;

  // User data
  userName: string;
  setUserName: (name: string) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProposalGeneratorContext = createContext<
  ProposalGeneratorState | undefined
>(undefined);

export function ProposalGeneratorProvider({
  children,
}: {
  children: ReactNode;
}) {
  // State declarations
  const [currentStep, setCurrentStep] = useState<string>("template_selection");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [detailedClientInfo, setDetailedClientInfo] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [originalPageUrl, setOriginalPageUrl] = useState<string>("");
  const [pagePassword, setPagePassword] = useState<string>("");
  const [validUntil, setValidUntil] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user-account", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.success && result.data?.userName) {
        setUserName(result?.data?.userName);
        setCompanyInfo(result?.data?.companyInfo);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const value: ProposalGeneratorState = {
    currentStep,
    setCurrentStep,
    selectedService,
    setSelectedService,
    clientName,
    setClientName,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    detailedClientInfo,
    setDetailedClientInfo,
    companyInfo,
    setCompanyInfo,
    selectedPlan,
    setSelectedPlan,
    originalPageUrl,
    setOriginalPageUrl,
    pagePassword,
    setPagePassword,
    validUntil,
    setValidUntil,
    userName,
    setUserName,
    isLoading,
    setIsLoading,
  };

  return (
    <ProposalGeneratorContext.Provider value={value}>
      {children}
    </ProposalGeneratorContext.Provider>
  );
}

export function useProposalGenerator() {
  const context = useContext(ProposalGeneratorContext);
  if (context === undefined) {
    throw new Error(
      "useProposalGenerator must be used within a ProposalGeneratorProvider"
    );
  }
  return context;
}
