import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Personalize from "../personalize";
import Sections from "../sections";
import Publish from "../publish";
import UnsavedChangesModal from "../UnsavedChangesModal/UnsavedChangesModal";
import { useEditor } from "../../contexts/EditorContext";
import SaveTemplateModal from "#/components/SaveTemplateModal";

type OpenModal = "personalize" | "sections" | null;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  openModal: OpenModal;
  setOpenModal: (modal: OpenModal) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  openModal,
  setOpenModal,
}: MobileMenuProps) {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { isDirty, saveProject, projectData } = useEditor();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-[53px] z-[1000] h-full w-full bg-black/60 sm:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white-neutral-light-200 relative z-[1000] mx-4 mt-4 rounded-[8px] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <Personalize
            isModalOpen={openModal === "personalize"}
            setIsModalOpen={(open) => setOpenModal(open ? "personalize" : null)}
          />
          <Sections
            isModalOpen={openModal === "sections"}
            setIsModalOpen={(open) => setOpenModal(open ? "sections" : null)}
          />

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="w-full rounded-[10px] border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Salvar como template
          </button>

          <div className="border-white-neutral-light-300 mt-6 mb-8 border-b" />

          <Publish />

          <Link
            href="/dashboard"
            onClick={handleLeaveClick}
            className="border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 button-inner flex h-[40px] w-full cursor-pointer items-center justify-center rounded-[10px] border text-sm sm:h-[44px]"
          >
            Sair do editor
          </Link>
        </div>
      </div>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onContinue={handleContinueEditing}
        onLeave={handleSaveDraftAndLeave}
      />
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        projectData={projectData}
      />
    </div>
  );
}
