"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  boldTitle?: boolean;
  children: React.ReactNode;
  showCloseButton?: boolean;
  width?: string;
  closeOnClickOutside?: boolean;
  footer?: boolean;
  disableClose?: boolean; // Nova prop para desabilitar todas as formas de fechar
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  boldTitle = false,
  children,
  showCloseButton = true,
  width,
  closeOnClickOutside = true,
  footer = true,
  disableClose = false, // Valor padrão false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Só fecha com ESC se disableClose for false
      if (event.key === "Escape" && isOpen && !disableClose) {
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
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, disableClose]);

  // Handle clicking outside of the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop (the overlay div itself)
    // and not on the modal content or any of its children
    if (
      closeOnClickOutside &&
      !disableClose &&
      modalRef.current &&
      e.target === e.currentTarget
    ) {
      onClose();
    }
  };

  // Função para fechar o modal (usada pelos botões)
  const handleClose = () => {
    if (!disableClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-filter"
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
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {(title || (showCloseButton && !disableClose)) && (
          <div className="flex items-center justify-between px-6 pt-6">
            {title && (
              <h3
                id="modal-title"
                className={`font-medium text-white-neutral-light-800
                  ${boldTitle ? "font-bold text-[24px]" : "font-medium"}  
                `}
              >
                {title}
              </h3>
            )}
            {/* Só mostra o botão X se showCloseButton for true E disableClose for false */}
            {showCloseButton && !disableClose && (
              <button
                onClick={handleClose}
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
              onClick={handleClose}
              disabled={disableClose} // Desabilita o botão se disableClose for true
              className={`w-[93px] h-[44px] text-center text-white rounded-[var(--radius-xs)] font-medium transition-colors button-inner-inverse ${
                disableClose
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] cursor-pointer"
              }`}
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
