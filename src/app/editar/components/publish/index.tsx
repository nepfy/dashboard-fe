import { useEditor } from "../../contexts/EditorContext";
import { useState } from "react";

export default function Publish() {
  const { saveProject, isDirty, isSaving } = useEditor();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = async () => {
    if (!isDirty) {
      return;
    }

    try {
      await saveProject();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <button
      onClick={handlePublish}
      disabled={!isDirty || isSaving}
      className={`w-full sm:w-auto text-sm font-medium 
        rounded-[12px] flex justify-center items-center 
        transition-all duration-200 cursor-pointer 
        shadow-lg hover:shadow-xl transform px-5 py-3
        ${
          !isDirty || isSaving
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
        }`}
    >
      {isSaving ? "Salvando..." : showSuccess ? "Salvo!" : "Publicar"}
    </button>
  );
}
