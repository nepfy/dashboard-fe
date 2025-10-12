import { useEffect } from "react";
import Link from "next/link";
import Personalize from "../personalize";
import Sections from "../sections";
import Publish from "../publish";

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

  if (!isOpen) return null;

  return (
    <div
      className="sm:hidden fixed inset-x-0 top-[53px] z-[1000] bg-black/60 w-full h-full"
      onClick={onClose}
    >
      <div
        className="bg-white-neutral-light-200 mx-4 mt-4 rounded-[8px] p-6 shadow-lg relative z-[1000]"
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

          <div className="border-b border-white-neutral-light-300 mt-6 mb-8" />

          <Publish />

          <Link
            href="/dashboard"
            className="h-[40px] w-full sm:h-[44px] text-sm border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            Sair do editor
          </Link>
        </div>
      </div>
    </div>
  );
}
