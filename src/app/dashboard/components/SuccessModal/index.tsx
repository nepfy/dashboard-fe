"use client";

import { useEffect, useState } from "react";
import Modal from "#/components/Modal";
import { useCopyLinkWithCache } from "#/contexts/CopyLinkCacheContext";

import SuccessSVG from "./SuccessSVG";

interface SuccessModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  projectName?: string;
  projectId?: string;
}

export default function SuccessModal({
  isOpen,
  onCloseAction,
  projectName = "Proposta",
  projectId,
}: SuccessModalProps) {
  const [, setShouldShow] = useState(false);

  const [isLoadingCopyLink, setIsLoadingCopyLink] = useState(false);
  const [copyLinkMessage, setCopyLinkMessage] = useState<string | null>(null);

  const { copyLinkWithCache } = useCopyLinkWithCache();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
      setCopyLinkMessage(null);
      setIsLoadingCopyLink(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShouldShow(false);
    setTimeout(() => {
      onCloseAction();
    }, 200);
  };

  const handleCopyLink = async () => {
    if (!projectId) {
      setCopyLinkMessage("ID do projeto não encontrado");
      setTimeout(() => setCopyLinkMessage(null), 3000);
      return;
    }

    if (isLoadingCopyLink) return;

    setIsLoadingCopyLink(true);
    setCopyLinkMessage(null);

    try {
      const result = await copyLinkWithCache(projectId);

      await navigator.clipboard.writeText(result.fullUrl);

      const successMessage = result.fromCache
        ? "Link copiado novamente com sucesso!"
        : "Link copiado com sucesso!";

      setCopyLinkMessage(successMessage);

      setTimeout(() => {
        setCopyLinkMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      setCopyLinkMessage("Erro ao copiar link. Tente novamente.");

      setTimeout(() => {
        setCopyLinkMessage(null);
      }, 3000);
    } finally {
      setIsLoadingCopyLink(false);
    }
  };

  const isCopyLinkDisabled = !projectId || isLoadingCopyLink;

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

        {copyLinkMessage && (
          <div className="px-7 pb-4">
            <div
              className={`text-xs px-3 py-2 rounded-2xs text-center ${
                copyLinkMessage.includes("Erro")
                  ? "text-red-700 bg-red-100"
                  : "text-green-700 bg-green-100"
              }`}
            >
              {copyLinkMessage}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-t-white-neutral-light-300">
          <div className="flex flex-col sm:flex-row gap-3 justify-start items-center py-4 px-7">
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={isCopyLinkDisabled}
              className="w-[110px] h-[44px] px-4 py-2 text-sm font-medium 
                     border rounded-[12px] bg-primary-light-500 button-inner-inverse 
                     border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
            >
              {isLoadingCopyLink ? "Copiando..." : "Copiar link"}
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
