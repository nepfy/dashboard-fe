import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import PasswordSection from "./FlashPreview";

export default function AccessPreview() {
  const { templateType, formData } = useProjectGenerator();

  return (
    <>
      {templateType === "flash" && (
        <TemplatePreviewWrapper>
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="w-full h-full flex justify-center items-center p-6">
              <PasswordSection mainColor={formData?.step1?.mainColor} />
            </div>
          </div>
        </TemplatePreviewWrapper>
      )}
    </>
  );
}
