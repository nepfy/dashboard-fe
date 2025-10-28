"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  trianglePosition?: string;
}

export default function EditableModal({
  isOpen,
  children,
  className,
  trianglePosition,
}: ModalProps) {
  // Block scroll on mobile when modal is open
  useEffect(() => {
    const handleScrollBlock = () => {
      if (isOpen) {
        // Only block scroll on mobile viewports (< 640px)
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
      } else {
        document.body.style.overflow = "auto";
      }
    };

    // Initial check
    handleScrollBlock();

    // Listen for window resize to handle orientation changes
    window.addEventListener("resize", handleScrollBlock);

    return () => {
      window.removeEventListener("resize", handleScrollBlock);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop - only visible on mobile */}
      <div className="bg-filter fixed inset-0 z-[9999] sm:hidden" />

      {/* Mobile modal container - centered on mobile */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:hidden">
        <div className="bg-white-neutral-light-100 h-auto w-full overflow-hidden rounded-[8px] border border-[#CDCDCD] px-4 py-6">
          {children}
        </div>
      </div>

      {/* Tablet+ modal container - absolute positioning with triangle */}
      <div className={`hidden sm:block ${className}`}>
        <div
          className={`absolute hidden h-0 w-0 border-t-[12px] border-r-[12px] border-b-[12px] border-t-transparent border-r-white border-b-transparent sm:block ${trianglePosition}`}
        />
        <div className="bg-white-neutral-light-100 h-full w-full overflow-hidden rounded-[8px] border border-[#CDCDCD] px-4 py-6 sm:w-[360px]">
          {children}
        </div>
      </div>
    </>
  );
}
