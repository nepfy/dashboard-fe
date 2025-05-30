"use client";

import { useState } from "react";

import ImportDataModal from "../../ImportData";
import TitleDescription from "../../TitleDescription";

import { useProjectGenerator } from "#/hooks/useProjectGenerator/useProjectGenerator";
import { Project } from "#/types/project";

export default function IntroStep() {
  const [showImportModal, setShowImportModal] = useState(true);
  const { updateFormData, nextStep } = useProjectGenerator();

  const handleImportProject = (projectData: Project) => {
    updateFormData("step1", {
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      ctaButtonTitle: projectData.ctaButtonTitle,
      pageTitle: projectData.pageTitle,
      pageSubtitle: projectData.pageSubtitle,
      mainColor: projectData.mainColor,
    });

    setShowImportModal(false);
    nextStep();
  };

  const handleCreateNew = () => {
    setShowImportModal(false);
    nextStep();
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
    nextStep();
  };

  if (!showImportModal) {
    return (
      <div className="h-full p-7">
        <TitleDescription
          title="Introdução:"
          description="Comece com uma apresentação impactante"
        />
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
