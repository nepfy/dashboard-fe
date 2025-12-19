"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CloseIcon from "#/components/icons/CloseIcon";
import Logo from "#/components/icons/Logo";
import Personalize from "../personalize";
import Sections from "../sections";
import Publish from "../publish";
import UnsavedChangesModal from "../UnsavedChangesModal/UnsavedChangesModal";
import { useEditor } from "../../contexts/EditorContext";
import SaveTemplateModal from "#/components/SaveTemplateModal";
import EditTemplateModal from "#/components/EditTemplateModal";

type OpenModal = "personalize" | "sections" | null;

export default function NavigationWithUnsavedChanges() {
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const { isDirty, saveProject, projectData, isTemplateMode, templateId } =
    useEditor();
  const router = useRouter();

  const handleLeaveClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      setShowUnsavedModal(true);
    }
  };

  const handleContinueEditing = () => {
    setShowUnsavedModal(false);
  };

  const handleSaveDraftAndLeave = async () => {
    setShowUnsavedModal(false);
    try {
      // Protected statuses that should not be changed to draft
      const protectedStatuses: string[] = [
        "active",
        "approved",
        "negotiation",
        "rejected",
        "expired",
      ];
      const currentStatus = projectData?.projectStatus;

      // Only set to draft if current status is not one of the protected statuses
      const shouldSaveAsDraft =
        !currentStatus || !protectedStatuses.includes(currentStatus);

      await saveProject({
        ...(shouldSaveAsDraft && { projectStatus: "draft" }),
        ...(shouldSaveAsDraft && { isPublished: false }),
        skipNavigation: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving draft:", error);
      // Still navigate even if save fails
      router.push("/dashboard");
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="border-b-white-neutral-light-300 bg-white-neutral-light-200 fixed top-0 right-0 left-0 z-50 hidden items-center justify-between border-b px-7 py-3 sm:flex">
        <div className="flex items-center gap-4">
          <Logo fill="#1C1A22" />
          <div className="border-l-white-neutral-light-300 h-4 border-l" />
          {!templateId && (
            <Personalize
              isModalOpen={openModal === "personalize"}
              setIsModalOpen={(open) =>
                setOpenModal(open ? "personalize" : null)
              }
            />
          )}
          <Sections
            isModalOpen={openModal === "sections"}
            setIsModalOpen={(open) => setOpenModal(open ? "sections" : null)}
          />
          {!isTemplateMode && (
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="rounded-[10px] border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Salvar como template
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Publish
            onOpenTemplateModal={() => setIsEditTemplateModalOpen(true)}
          />
          <Link
            href="/dashboard"
            onClick={handleLeaveClick}
            className="border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 button-inner flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] border sm:h-[44px] sm:w-[44px]"
          >
            <CloseIcon width="10" height="10" fill="#1C1A22" />
          </Link>
        </div>
      </nav>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onContinue={handleContinueEditing}
        onLeave={handleSaveDraftAndLeave}
      />
      {!isTemplateMode && (
        <SaveTemplateModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          projectData={projectData}
        />
      )}
      <EditTemplateModal
        isOpen={isEditTemplateModalOpen}
        onClose={() => setIsEditTemplateModalOpen(false)}
        templateId={templateId}
        templateData={projectData}
      />
    </>
  );
}
