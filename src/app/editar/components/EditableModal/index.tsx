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
  if (!isOpen) return null;

  return (
    <div className={`${className}`}>
      <div
        className={`absolute hidden h-0 w-0 border-t-[12px] border-r-[12px] border-b-[12px] border-t-transparent border-r-white border-b-transparent sm:block ${trianglePosition}`}
      />
      <div className="bg-white-neutral-light-100 h-full w-[90%] overflow-hidden rounded-[8px] border border-[#CDCDCD] px-4 py-6 sm:w-[360px]">
        {children}
      </div>
    </div>
  );
}
