interface EditSaveBottomBarProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditSaveBottomBar({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isLoading = false,
}: EditSaveBottomBarProps) {
  return (
    <div className="fixed bottom-0 h-[60px] sm:h-[100px] bg-white-neutral-light-100 w-full border-t border-t-white-neutral-light-300 flex justify-center sm:justify-start items-center px-2 sm:px-4">
      {!isEditing ? (
        <button
          type="button"
          onClick={onEdit}
          disabled={isLoading}
          className={`w-[148px] h-[44px] text-white rounded-[var(--radius-s)] font-medium transition-colors cursor-pointer bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] button-inner-inverse mr-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Editar dados
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={isLoading}
            className={`w-[148px] h-[44px] text-white rounded-[var(--radius-s)] font-medium transition-colors cursor-pointer bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] button-inner-inverse mr-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Salvar alterações
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`w-[95px] h-[44px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs flex items-center justify-center cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
