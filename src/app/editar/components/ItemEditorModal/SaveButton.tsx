"use client";

interface SaveButtonProps {
  onSave: () => void;
  hasChanges: boolean;
}

export default function SaveButton({ onSave, hasChanges }: SaveButtonProps) {
  return (
    <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
      <button
        onClick={onSave}
        disabled={!hasChanges}
        className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
      >
        Alterar
      </button>
    </div>
  );
}
