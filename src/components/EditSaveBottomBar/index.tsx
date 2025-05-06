export default function EditSaveBottomBar() {
  return (
    <div className="fixed bottom-0 h-[60px] sm:h-[100px] bg-white-neutral-light-100 w-full border-t border-t-white-neutral-light-300 flex justify-center sm:justify-start items-center px-2 sm:px-4">
      <button
        type="submit"
        className="w-[148px] h-[44px] text-white rounded-[var(--radius-s)] font-medium transition-colors cursor-pointer bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] button-inner-inverse mr-2"
      >
        Editar dados
      </button>

      <button
        type="submit"
        className="w-[95px] h-[44px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs flex items-center justify-center"
      >
        Cancelar
      </button>
    </div>
  );
}
