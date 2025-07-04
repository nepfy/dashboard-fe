import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function AboutBusinessPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step2?.hideAboutUsSection && (
          <>
            <div className="w-full space-y-8">
              <div className="text-center mb-12">
                {!formData?.step2?.hideAboutUsTitle && (
                  <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                    {formData?.step2?.aboutUsTitle}
                  </h2>
                )}
              </div>

              <div className="w-full">
                <div className="space-y-6">
                  <div>
                    {!formData?.step2?.hideSubtitles1 && (
                      <p className="text-white/90 leading-relaxed">
                        {formData?.step2?.aboutUsSubtitle1}
                      </p>
                    )}
                  </div>

                  <div>
                    {!formData?.step2?.hideSubtitles2 && (
                      <p className="text-white/90 leading-relaxed">
                        {formData?.step2?.aboutUsSubtitle2}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step2?.hideAboutUsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Sobre seu negócio&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
