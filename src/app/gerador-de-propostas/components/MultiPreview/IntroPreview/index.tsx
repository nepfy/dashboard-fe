import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper, {
  useTemplateColors,
} from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function IntroPreview() {
  const { formData } = useProjectGenerator();
  const { templateColors, mainColor } = useTemplateColors();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-center text-center relative z-10 overflow-y-scroll h-full">
        <div className="max-w-lg mx-auto space-y-6">
          <h1 className="text-white text-4xl font-bold leading-tight drop-shadow-lg">
            {formData?.step1?.pageTitle}
          </h1>

          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            {formData?.step1?.pageSubtitle}
          </p>

          {formData?.step1?.companyName && (
            <div className="text-white/80 text-lg font-medium">
              {formData.step1.companyName}
            </div>
          )}

          {formData?.step1?.companyEmail && (
            <div className="text-white/80 text-lg font-medium">
              {formData.step1.companyEmail}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            {(formData?.step1?.services ?? []).length > 0
              ? (formData?.step1?.services ?? []).map(
                  (service: string, index: number) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
                    >
                      {service}
                    </span>
                  )
                )
              : null}
          </div>

          <div className="pt-4">
            {formData?.step1?.ctaButtonTitle && (
              <button
                className="bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                style={{
                  color: templateColors.text,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px ${mainColor}20`,
                }}
              >
                {formData?.step1?.ctaButtonTitle}
              </button>
            )}
          </div>
        </div>
      </div>

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
