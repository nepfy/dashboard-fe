import Sparkle from "#/components/icons/Sparkle";
import { usePersonalizeForm } from "./usePersonalization";
import { PersonalizeModal } from "./PersonalizeModal";
import { useUserStore } from "#/store/user.slice";

interface PersonalizeProps {
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
}

export default function Personalize({
  setIsModalOpen,
  isModalOpen,
}: PersonalizeProps) {
  const { userData } = useUserStore();

  const {
    projectData,
    originalPageUrl,
    setOriginalPageUrl,
    pagePassword,
    setPagePassword,
    selectedColor,
    setSelectedColor,
    clearError,
    handleSave,
    handleClose,
    isFormValid,
    hasChanges,
  } = usePersonalizeForm(isModalOpen);

  return (
    <div className="relative">
      <button
        className={`hover:button-inner hover:border-white-neutral-light-300 hover:text-primary-light-500 hover:bg-white-neutral-light-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-4 py-3 transition-all duration-200 sm:w-auto ${
          isModalOpen
            ? "text-primary-light-500 border-white-neutral-light-300 bg-white-neutral-light-100"
            : "text-white-neutral-light-900 bg-white-neutral-light-200 border-white-neutral-light-200"
        } `}
        onClick={() => setIsModalOpen(true)}
      >
        <Sparkle width="16" height="16" fill="currentColor" />
        <p className="text-sm font-medium">Personalize</p>
      </button>

      <PersonalizeModal
        isOpen={isModalOpen}
        onClose={() => {
          handleClose();
          setIsModalOpen(false);
        }}
        handleSave={() => {
          handleSave();
          setIsModalOpen(false);
        }}
        disabled={!isFormValid || !hasChanges}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        userName={userData?.userName || ""}
        originalPageUrl={originalPageUrl}
        setOriginalPageUrl={setOriginalPageUrl}
        pagePassword={pagePassword}
        setPagePassword={setPagePassword}
        clearError={clearError}
        isPublished={projectData?.isPublished || false}
      />
    </div>
  );
}
