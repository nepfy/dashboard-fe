import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function TermsPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step13?.hideTermsSection && (
          <div className="w-full space-y-8">
            <div className="space-y-6">
              {formData?.step13?.termsConditions?.map((term) => (
                <div
                  key={term.id}
                  className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
                >
                  {/* Term Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white-neutral-light-800 mb-2">
                        {term.title}
                      </h3>
                      <div className="text-white/90 leading-relaxed">
                        <div className="whitespace-pre-wrap text-white-neutral-light-800">
                          {term.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {formData?.step13?.hideTermsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Termos e Condições&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
