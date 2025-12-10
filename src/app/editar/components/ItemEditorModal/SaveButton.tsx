"use client";

interface SaveButtonProps {
  onSave: () => void;
  hasChanges: boolean;
}

// Separate components to force complete remount
function EnabledSaveButton({ onSave }: { onSave: () => void }) {
  return (
    <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
      <button
        onClick={onSave}
        type="button"
        className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
      >
        Salvar Alterações
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

export default function SaveButton({ onSave, hasChanges }: SaveButtonProps) {
  // Render completely different components based on hasChanges
  // No keys needed on children since parent has key that changes
  // This forces React to unmount/remount completely when parent key changes
  if (hasChanges) {
    return <EnabledSaveButton onSave={onSave} />;
  }

  return <DisabledSaveButton />;
}
