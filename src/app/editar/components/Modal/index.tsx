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
    <div className="fixed inset-x-0 top-[55px] sm:top-[70px] z-[2000] bg-black/60 w-full h-full bg-filter px-3">
      <div className="bg-white-neutral-light-200 mt-4 rounded-[8px] px-8 py-6 shadow-lg w-auto max-h-[calc(100vh-80px)] inline-flex flex-col">
        <div className="overflow-y-auto flex-1 min-h-0">{children}</div>

        <div className="border-t border-gray-200 mt-8 flex-shrink-0">
          <div className="w-full flex flex-col md:flex-row items-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="order-2 md:order-1 w-full md:w-auto cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-center md:justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={disabled}
              className={`order-1 md:order-2 w-full md:w-auto px-6 py-3.5 text-sm font-medium rounded-[12px] flex justify-center items-center gap-1 transition-all duration-200 transform cursor-pointer ${
                disabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform"
              }`}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
