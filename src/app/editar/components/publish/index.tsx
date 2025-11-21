import { useEditor } from "../../contexts/EditorContext";
import { useState } from "react";
import { trackProposalPublished } from "#/lib/analytics/track";

export default function Publish() {
  const { saveProject, isDirty, isSaving, projectData } = useEditor();
  const [showSuccess, setShowSuccess] = useState(false);
  const isAlreadyPublished = projectData?.isPublished ?? false;

  const handlePublish = async () => {
    if (isSaving || (!isDirty && isAlreadyPublished)) {
      return;
    }

    try {
      await saveProject({
        projectStatus: "active",
        isPublished: true,
      });
      
      // Track proposal published
      if (projectData?.id) {
        trackProposalPublished({
          proposal_id: projectData.id,
          publish_method: "button",
          template_type: projectData.templateType,
        });
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isSaving || (!isDirty && isAlreadyPublished)}
      className={`flex w-full transform items-center justify-center rounded-[12px] px-5 py-3 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl sm:w-auto ${
        isSaving || (!isDirty && isAlreadyPublished)
          ? "cursor-not-allowed bg-gray-400 text-gray-200"
          : "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
      }`}
    >
      {isSaving ? "Salvando..." : showSuccess ? "Salvo!" : "Publicar"}
    </button>
  );
}
