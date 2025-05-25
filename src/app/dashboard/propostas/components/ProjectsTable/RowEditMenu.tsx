import { useEffect, useRef } from "react";

import UpdateIcon from "#/components/icons/UpdateIcon";
import CopyIcon from "#/components/icons/CopyIcon";
import EditIcon from "#/components/icons/EditIcon";
import Archive from "#/components/icons/Archive";

interface RowEditMenuProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function RowEditMenu({
  isOpen,
  onClose,
  projectId,
}: RowEditMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleMenuItemClick = (action: string) => {
    console.log(`Action: ${action} for project: ${projectId}`);
    // Add your menu item logic here
    onClose(); // Close menu after action
  };

  return (
    <div
      ref={menuRef}
      className="p-5 e0 border border-white-neutral-light-300 rounded-[12px] absolute right-4 bg-white-neutral-light-100 z-10 min-w-[230px] sm:min-w-[280px]"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-medium text-white-neutral-light-900 mb-4"> Opções </p>
      <div className="flex flex-col gap-1 my-1 cursor-pointer">
        <button
          onClick={() => handleMenuItemClick("update-status")}
          className="text-left py-3 px-2 hover:bg-white-neutral-light-300 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 cursor-pointer"
        >
          <UpdateIcon width="16" height="16" />
          Atualizar Status
        </button>
        <button
          onClick={() => handleMenuItemClick("duplicate")}
          className="text-left py-3 px-2 hover:bg-white-neutral-light-300 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 cursor-pointer"
        >
          <CopyIcon width="16" height="16" />
          Duplicar
        </button>
        <button
          onClick={() => handleMenuItemClick("edit")}
          className="text-left py-3 px-2 hover:bg-white-neutral-light-300 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 cursor-pointer"
        >
          <EditIcon width="16" height="16" />
          Editar
        </button>
        <button
          onClick={() => handleMenuItemClick("archive")}
          className="text-left py-3 px-2 hover:bg-white-neutral-light-300 rounded-lg text-sm font-medium text-white-neutral-light-900 flex items-center gap-1 my-1 cursor-pointer"
        >
          <Archive width="16" height="16" />
          Arquivar
        </button>
      </div>
    </div>
  );
}
