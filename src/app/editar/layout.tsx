"use client";

import { useState, useEffect } from "react";
import MobileNavigation from "./components/MobileNavigation";
import MobileMenu from "./components/MobileMenu";
import NavigationWithUnsavedChanges from "./components/UnsavedChangesModal/NavigationWithUnsavedChanges";
import { EditorProvider } from "./contexts/EditorContext";

type OpenModal = "personalize" | "sections" | null;

export default function EditarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  // Centralized scroll blocking
  useEffect(() => {
    if (openModal) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [openModal]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <EditorProvider>
      <div className="h-screen">
        <NavigationWithUnsavedChanges />

        <MobileNavigation
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMenu={toggleMobileMenu}
        />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />

        <div className="mt-[56px] sm:mt-[66px]">{children}</div>
      </div>
    </EditorProvider>
  );
}
