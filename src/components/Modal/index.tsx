"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  width?: string;
  closeOnClickOutside?: boolean;
  footer?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  width,
  closeOnClickOutside = true,
  footer = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent scrolling of the body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle clicking outside of the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnClickOutside &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-filter backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-white-neutral-light-100 rounded-[var(--radius-m)] shadow-lg max-h-[90vh] overflow-auto ${
          !width ? "w-[320px] sm:w-[520px]" : ""
        }`}
        style={{ width: width || undefined }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6">
            {title && (
              <h3
                id="modal-title"
                className="font-medium text-white-neutral-light-800"
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white-neutral-light-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} className="text-white-neutral-light-600" />
              </button>
            )}
          </div>
        )}

        <div>{children}</div>
        {footer && (
          <div className="border-t border-white-neutral-light-300 p-6">
            <button
              onClick={onClose}
              className="w-[93px] h-[44px] text-center text-white rounded-[var(--radius-xs)] font-medium transition-colors cursor-pointer bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] button-inner-inverse"
            >
              Entendi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
