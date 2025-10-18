import EditorIcon from "./EditorIcon";
interface UnsavedChangesModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLeave: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  onContinue,
  onLeave,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white-neutral-light-200 rounded-[12px] p-6 max-w-md shadow-xl w-full sm:w-[426px]">
        <p className="text-[24px] font-medium text-primary-light-400 mb-3">
          Deseja sair do editor?
        </p>
        <div className="py-8">
          <EditorIcon />
        </div>
        <p className="text-white-neutral-light-900 text-sm mb-6">
          <span className="block mb-3">
            Sua proposta vai ficar salva como rascunho e o link ainda{" "}
            <span className="font-bold">não ficará</span> disponível para o
            cliente.
          </span>
          Continue editando ou volte mais tarde para retomar de onde parou.
        </p>
        <div className="border-t border-gray-200 mt-8 flex-shrink-0">
          <div className="w-full flex flex-col md:flex-row items-center gap-4 pt-4">
            <button
              onClick={onLeave}
              className="order-2 md:order-1 w-full md:w-auto cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-center md:justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
            >
              Sair
            </button>
            <button
              onClick={onContinue}
              className="order-1 md:order-2 w-full md:w-auto px-6 py-3.5 text-sm font-medium rounded-[12px] flex justify-center items-center gap-1 transition-all duration-200 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform"
            >
              Continuar editando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
