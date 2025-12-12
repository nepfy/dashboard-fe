"use client";

interface SaveButtonProps {
  onSave: () => void;
  hasChanges: boolean;
  isLoading?: boolean;
}

// Separate components to force complete remount
function EnabledSaveButton({
  onSave,
  isLoading = false,
}: {
  onSave: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isLoading) {
            onSave();
          }
        }}
        type="button"
        disabled={isLoading}
        className={`flex w-full transform items-center justify-center gap-1 rounded-[12px] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 ${
          isLoading
            ? "cursor-not-allowed bg-gray-400 opacity-50"
            : "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Salvando...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </button>
    </div>
  );
}

function DisabledSaveButton() {
  return (
    <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
      <button
        type="button"
        disabled
        className="flex w-full transform cursor-not-allowed items-center justify-center gap-1 rounded-[12px] bg-gray-400 px-6 py-3.5 text-sm font-medium text-white opacity-50 transition-all duration-200"
      >
        Salvar Alterações
      </button>
    </div>
  );
}

export default function SaveButton({
  onSave,
  hasChanges,
  isLoading = false,
}: SaveButtonProps) {
  // Render completely different components based on hasChanges
  // No keys needed on children since parent has key that changes
  // This forces React to unmount/remount completely when parent key changes
  if (hasChanges) {
    return <EnabledSaveButton onSave={onSave} isLoading={isLoading} />;
  }

  return <DisabledSaveButton />;
}
