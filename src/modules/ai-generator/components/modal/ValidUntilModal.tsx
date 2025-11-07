import { useMemo } from "react";
import Modal from "#/modules/ai-generator/components/modal/Modal";
import CloseIcon from "#/components/icons/CloseIcon";
import Calendar from "#/app/editar/components/Calendar";

interface ValidUntilModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export function ValidUntilModal({
  isModalOpen,
  onClose,
  selectedDate,
  onDateSelect,
  onConfirm,
  confirmDisabled = false,
}: ValidUntilModalProps) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      showCloseButton={false}
      footer={false}
      width="w-full sm:w-[350px]"
    >
      <div className="font-satoshi p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6">
          <p className="text-lg font-medium text-[#2A2A2A]">
            Validade da proposta
          </p>
          <button
            type="button"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
            onClick={onClose}
          >
            <CloseIcon width="12" height="12" fill="#1C1A22" />
          </button>
        </div>

        <span>
          <Calendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
        </span>

        <button
          type="button"
          className="mt-6 flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          Salvar data
        </button>
      </div>
    </Modal>
  );
}
