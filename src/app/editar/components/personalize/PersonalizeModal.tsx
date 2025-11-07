import { Label } from "#/components/Label";
import { ColorPicker } from "#/modules/ai-generator/components/template-selection/partials/ColorPicker";
import { PageURLSection } from "#/modules/ai-generator/components/final-steps-section/PageURLSection";
import { PasswordSection } from "#/modules/ai-generator/components/final-steps-section/PasswordSection";
import Modal from "../Modal";
import { FormErrors } from "./types";
import { TEMPLATES } from "./constants";

interface UrlValidationState {
  isChecking: boolean;
  isDuplicate: boolean;
  message?: string;
}

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  disabled: boolean;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  userName: string;
  originalPageUrl: string;
  setOriginalPageUrl: (url: string) => void;
  pagePassword: string;
  setPagePassword: (password: string) => void;
  clearError: (field: keyof FormErrors) => void;
  isPublished: boolean;
  errorMessage?: string;
  onUrlValidationStateChange?: (state: UrlValidationState) => void;
}

export const PersonalizeModal = ({
  isOpen,
  onClose,
  handleSave,
  disabled,
  selectedColor,
  onColorSelect,
  userName,
  originalPageUrl,
  setOriginalPageUrl,
  pagePassword,
  setPagePassword,
  clearError,
  isPublished,
  errorMessage,
  onUrlValidationStateChange,
}: PersonalizeModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      handleSave={() => {
        handleSave();
        onClose();
      }}
      disabled={disabled}
    >
      <div className="mb-8">
        <Label>Escolha a cor principal que será usada em toda a proposta</Label>
        <ColorPicker
          colors={TEMPLATES[0].colorsList}
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
        />
      </div>

      <PageURLSection
        isPublished={isPublished}
        userName={userName || ""}
        originalPageUrl={originalPageUrl}
        setOriginalPageUrl={setOriginalPageUrl}
        clearError={(field: string) => clearError(field as keyof FormErrors)}
        errorMessage={errorMessage}
        onValidationStateChange={onUrlValidationStateChange}
      />

      <PasswordSection
        pagePassword={pagePassword}
        setPagePassword={setPagePassword}
        clearError={(field: string) => clearError(field as keyof FormErrors)}
      />
    </Modal>
  );
};
