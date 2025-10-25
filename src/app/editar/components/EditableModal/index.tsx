interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function EditableModal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center sm:absolute sm:inset-auto sm:top-[-90px] sm:left-[25px]">
      <div className="absolute top-[90px] left-[-12px] hidden h-0 w-0 border-t-[12px] border-r-[12px] border-b-[12px] border-t-transparent border-r-white border-b-transparent sm:block" />
      <div className="bg-white-neutral-light-100 mt-4 inline-flex w-[90%] flex-col rounded-[8px] border border-[#CDCDCD] px-4 py-6 sm:w-[360px]">
        <div>{children}</div>
      </div>
    </div>
  );
}
