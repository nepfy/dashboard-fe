export default function ConfirmExclusion({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="bg-white-neutral-light-100 flex h-full w-full flex-col items-center justify-between pt-2">
      <div className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6">
        <span className="text-lg font-medium text-[#2A2A2A]">
          Confirmar exclusão
        </span>
      </div>

      <div className="mr-10 flex h-[90%] flex-col gap-2">
        <p className="text-white-neutral-light-900 font-bold">
          Tem certeza de que deseja excluir este item de forma permanente?
        </p>
        <p className="text-white-neutral-light-900 text-sm font-normal">
          Essa ação não poderá ser desfeita.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onConfirm}
          className="button-inner-inverse flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-[#D00003] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200"
        >
          Excluir
        </button>

        <button
          onClick={onClose}
          className="bg-white-neutral-light-100 border-white-neutral-light-300 button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-200 flex w-full transform cursor-pointer items-center justify-center rounded-[12px] border px-6 py-3.5 text-sm font-medium transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
