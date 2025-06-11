// src/app/dashboard/components/SuccessModal/index.tsx
"use client";

import { useEffect, useState } from "react";
import Modal from "#/components/Modal";

import SuccessSVG from "./SuccessSVG";

interface SuccessModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  projectName?: string;
}

export default function SuccessModal({
  isOpen,
  onCloseAction,
  projectName = "Proposta",
}: SuccessModalProps) {
  const [, setShouldShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShouldShow(false);
    setTimeout(() => {
      onCloseAction();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Proposta gerada"
      width="350px"
      footer={false}
    >
      <div>
        <div className="w-full flex items-center justify-center pt-9 pb-4">
          <SuccessSVG />
        </div>
        <p className="text-white-neutral-light-500 mb-6 text-sm p-7">
          Sua proposta &quot;{projectName}&quot; está pronta e já pode ser
          compartilhada com seus clientes. Acompanhe o status diretamente na
          plataforma.
        </p>

        {/* Action Buttons */}
        <div className="border-t border-t-white-neutral-light-300">
          <div className="flex flex-col sm:flex-row gap-3 justify-start items-center py-4 px-7">
            <button
              type="button"
              onClick={handleClose}
              className="w-[110px] h-[44px] px-4 py-2 text-sm font-medium 
                     border rounded-[12px] bg-primary-light-500 button-inner-inverse 
                     border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
            >
              Copiar link
            </button>

            <button
              type="button"
              onClick={() => {}}
              className="flex items-center justify-center gap-1 w-[110px] h-[44px] 
                     px-4 py-2 text-sm font-medium border rounded-[12px] 
                     border-white-neutral-light-300 cursor-pointer button-inner 
                     text-white-neutral-light-900 hover:bg-white-neutral-light-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Visualizar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
