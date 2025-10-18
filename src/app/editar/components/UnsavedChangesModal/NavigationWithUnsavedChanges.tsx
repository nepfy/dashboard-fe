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

type OpenModal = "personalize" | "sections" | null;

export default function NavigationWithUnsavedChanges() {
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const { isDirty } = useEditor();
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

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedModal(false);
    router.push("/dashboard");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden fixed top-0 left-0 right-0 z-50 sm:flex px-7 py-3 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo fill="#1C1A22" />
          <div className="border-l border-l-white-neutral-light-300 h-4" />
          <Personalize
            isModalOpen={openModal === "personalize"}
            setIsModalOpen={(open) => setOpenModal(open ? "personalize" : null)}
          />
          <Sections
            isModalOpen={openModal === "sections"}
            setIsModalOpen={(open) => setOpenModal(open ? "sections" : null)}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Publish />
          <Link
            href="/dashboard"
            onClick={handleLeaveClick}
            className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            <CloseIcon width="10" height="10" fill="#1C1A22" />
          </Link>
        </div>
      </nav>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onContinue={handleContinueEditing}
        onLeave={handleLeaveWithoutSaving}
      />
    </>
  );
}
