"use client";

import CloseIcon from "#/components/icons/CloseIcon";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div
      className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-lg font-medium text-[#2A2A2A]">{title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
      >
        <CloseIcon width="12" height="12" fill="#1C1A22" />
      </button>
    </div>
  );
}
