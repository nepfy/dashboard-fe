interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  handleSave: () => void;
  disabled: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  handleSave,
  disabled,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-filter fixed inset-x-0 top-[55px] z-[2000] h-full w-full bg-black/60 px-3 sm:top-[70px]">
      <div className="bg-white-neutral-light-200 mt-4 inline-flex max-h-[calc(100vh-80px)] w-auto flex-col rounded-[8px] px-8 py-6 shadow-lg">
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        <div className="mt-8 flex-shrink-0 border-t border-gray-200">
          <div className="flex w-full flex-col items-center gap-4 pt-4 md:flex-row">
            <button
              onClick={onClose}
              className="button-inner border-white-neutral-light-300 text-white-neutral-light-900 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 group order-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-6 py-3 transition-all duration-200 hover:text-gray-800 md:order-1 md:w-auto md:justify-start"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={disabled}
              className={`order-1 flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] px-6 py-3.5 text-sm font-medium transition-all duration-200 md:order-2 md:w-auto ${
                disabled
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "transform bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              }`}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
