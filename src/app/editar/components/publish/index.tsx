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
      await saveProject({
        projectStatus: "active",
        isPublished: true,
      });
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
      className={`flex w-full transform items-center justify-center rounded-[12px] px-5 py-3 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl sm:w-auto ${
        !isDirty || isSaving
          ? "cursor-not-allowed bg-gray-400 text-gray-200"
          : "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
      }`}
    >
      {isSaving ? "Salvando..." : showSuccess ? "Salvo!" : "Publicar"}
    </button>
  );
}
