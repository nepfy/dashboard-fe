"use client";

import CloseIcon from "#/components/icons/CloseIcon";
import EditableModal from "#/app/editar/components/EditableModal";

interface EditableImageProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  memberId: string;
}

export default function EditableImage({
  isModalOpen,
  setIsModalOpen,
  memberId,
}: EditableImageProps) {
  return (
    <div className="z-[10] w-full">
      <EditableModal
        isOpen={isModalOpen}
        className="absolute top-[-16px] right-0"
        trianglePosition="top-[85px] left-[-8px]"
      >
        <div
          className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6"
          onClick={(e) => e.stopPropagation()}
          key={memberId}
        >
          <span className="text-lg font-medium text-[#2A2A2A]">Time</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
          >
            <CloseIcon width="12" height="12" fill="#1C1A22" />
          </button>
        </div>
      </EditableModal>
    </div>
  );
}
