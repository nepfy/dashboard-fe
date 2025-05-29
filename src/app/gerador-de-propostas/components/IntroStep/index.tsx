import { useState } from "react";
import ImportDataModal from "../ImportData";
import { useProjectGenerator } from "#/hooks/useProjectGenerator/useProjectGenerator";
import { Project } from "#/types/project";

export default function IntroStep() {
  const [showImportModal, setShowImportModal] = useState(true);
  const { updateFormData, nextStep } = useProjectGenerator();

  const handleImportProject = (projectData: Project) => {
    // Map project data to form steps
    // This is a basic mapping - you can expand based on your needs

    // Step 1 - Basic info
    updateFormData("step1", {
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      ctaButtonTitle: projectData.ctaButtonTitle,
      pageTitle: projectData.pageTitle,
      pageSubtitle: projectData.pageSubtitle,
      mainColor: projectData.mainColor,
    });

    // Step 2 - About us
    if (
      projectData.aboutUsTitle ||
      projectData.aboutUsSubtitle1 ||
      projectData.aboutUsSubtitle2
    ) {
      updateFormData("step2", {
        aboutUsTitle: projectData.aboutUsTitle,
        aboutUsSubtitle1: projectData.aboutUsSubtitle1,
        aboutUsSubtitle2: projectData.aboutUsSubtitle2,
      });
    }

    // Step 3 - Team
    if (projectData.ourTeamSubtitle) {
      updateFormData("step3", {
        ourTeamSubtitle: projectData.ourTeamSubtitle,
        // teamMembers would need to be fetched from related tables
      });
    }

    // Step 10 - Investment
    if (projectData.investmentTitle) {
      updateFormData("step10", {
        investmentTitle: projectData.investmentTitle,
      });
    }

    // Step 13 - Terms
    if (projectData.termsTitle) {
      updateFormData("step13", {
        termsTitle: projectData.termsTitle,
      });
    }

    // Step 15 - End message
    if (projectData.endMessageTitle || projectData.endMessageDescription) {
      updateFormData("step15", {
        endMessageTitle: projectData.endMessageTitle,
        endMessageDescription: projectData.endMessageDescription,
      });
    }

    // Step 16 - Project settings
    updateFormData("step16", {
      pageUrl: projectData.projectUrl,
      pagePassword: projectData.pagePassword,
      projectValidUntil: projectData.projectValidUntil,
    });

    setShowImportModal(false);
    nextStep(); // Move to next step after importing
  };

  const handleCreateNew = () => {
    setShowImportModal(false);
    nextStep(); // Move to next step without importing data
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
    nextStep(); // Move to next step
  };

  if (!showImportModal) {
    return (
      <div className="bg-white-neutral-light-100 p-8 rounded-lg">
        <h3 className="text-xl font-medium mb-4">
          Dados importados com sucesso!
        </h3>
        <p className="text-white-neutral-light-600">
          Continue preenchendo o formulário para personalizar seu projeto.
        </p>
      </div>
    );
  }

  return (
    <ImportDataModal
      onImportProject={handleImportProject}
      onCreateNew={handleCreateNew}
      onClose={handleCloseModal}
    />
  );
}
