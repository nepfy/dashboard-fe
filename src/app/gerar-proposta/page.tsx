"use client";

import { useEffect, useState } from "react";
import { toast, Slide } from "react-toastify";
import { useRouter } from "next/navigation";

import { SelectTemplate } from "#/modules/ai-generator/components/generation-steps";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { ServiceType } from "#/modules/ai-generator/components/generation-steps/ServiceType";
import { ClientInfo } from "#/modules/ai-generator/components/generation-steps/ClientInfo";
import { CompanyInfo } from "#/modules/ai-generator/components/generation-steps/CompanyInfo";
import { PricingStep } from "#/modules/ai-generator/components/generation-steps/PricingStep";
import { FinalStep } from "#/modules/ai-generator/components/generation-steps/FinalStep";
import { Loading } from "#/modules/ai-generator/components/loading/Loading";

export default function NepfyAIPage() {
  const { templateType, formData } = useProjectGenerator();
  const router = useRouter();
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

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user-account", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.success && result.data?.userName) {
        setUserName(result?.data?.userName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGenerateProposal = async () => {
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription ||
      !originalPageUrl ||
      !pagePassword ||
      !validUntil
    ) {
      return;
    }

    setCurrentStep("final_step");

    try {
      setIsLoading(true);
      const response = await fetch("/api/projects/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedService,
          clientName,
          projectName,
          projectDescription,
          detailedClientInfo,
          companyInfo,
          selectedPlan,
          templateType,
          mainColor: formData.step1?.mainColor || null,
          originalPageUrl,
          pagePassword,
          validUntil,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Proposal generated successfully:", result.data);
        router.push(
          `/dashboard?success&project=${projectName}&projectId=${result.data.id}`
        );
      } else {
        console.error("Error generating proposal:", result.error);
        toast.error("Erro ao gerar proposta: " + result.error, {
          position: "top-right",
          autoClose: 5000,
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
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error("Erro ao gerar proposta. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: "font-satoshi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-7">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mx-auto h-full p-6">
        {(() => {
          const stepMap: Record<string, React.ReactNode> = {
            template_selection: (
              <div>
                <SelectTemplate
                  handleNextStep={() => setCurrentStep("service_selection")}
                />
              </div>
            ),
            service_selection: (
              <ServiceType
                onServiceSelect={handleServiceSelect}
                selectedService={selectedService}
                handleBack={() => setCurrentStep("template_selection")}
                handleNext={() => setCurrentStep("company_info")}
              />
            ),
            company_info: (
              <CompanyInfo
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
                handleBack={() => setCurrentStep("service_selection")}
                handleNext={() => setCurrentStep("client_details")}
              />
            ),
            client_details: (
              <ClientInfo
                clientData={{
                  clientName,
                  projectName,
                  detailedClientInfo,
                  projectDescription,
                }}
                setClientData={({
                  clientName,
                  projectName,
                  projectDescription,
                  detailedClientInfo,
                }) => {
                  setClientName(clientName);
                  setProjectName(projectName);
                  setProjectDescription(projectDescription);
                  setDetailedClientInfo(detailedClientInfo || "");
                }}
                handleBack={() => setCurrentStep("company_info")}
                handleNext={() => setCurrentStep("pricing_step")}
              />
            ),
            pricing_step: (
              <PricingStep
                selectedPlan={selectedPlan || 1}
                handlePlanSelect={setSelectedPlan}
                handleBack={() => setCurrentStep("client_details")}
                handleNext={() => setCurrentStep("final_step")}
              />
            ),
            final_step: (
              <FinalStep
                handleGenerateProposal={handleGenerateProposal}
                handleBack={() => setCurrentStep("pricing_step")}
                userName={userName}
                step={currentStep}
                originalPageUrl={originalPageUrl}
                setOriginalPageUrl={setOriginalPageUrl}
                pagePassword={pagePassword}
                setPagePassword={setPagePassword}
                validUntil={validUntil}
                setValidUntil={setValidUntil}
              />
            ),
          };
          return stepMap[currentStep] || null;
        })()}
      </div>
    </div>
  );
}
