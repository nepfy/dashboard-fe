import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import { Calendar } from "lucide-react";

export default function FinalMessagePreview() {
  const { formData } = useProjectGenerator();

  const formatDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return "";

    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-start items-start h-full p-8 overflow-y-scroll">
        {!formData?.step15?.hideFinalMessage && (
          <div className="w-full space-y-8">
            {/* Main Content */}
            <div className="text-center space-y-6">
              {/* First Title */}
              {formData?.step15?.endMessageTitle && (
                <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  {formData.step15.endMessageTitle}
                </h2>
              )}

              {/* Second Title */}
              {formData?.step15?.endMessageTitle2 && (
                <h3 className="text-white text-2xl font-semibold mb-6 drop-shadow-lg">
                  {formData.step15.endMessageTitle2}
                </h3>
              )}

              {/* Description */}
              {!formData?.step15?.hideFinalMessageSubtitle &&
                formData?.step15?.endMessageDescription && (
                  <div className="bg-white/80 backdrop-blur-md rounded-xl border border-white/20 p-6 mx-auto">
                    <p className="text-white-neutral-light-800 leading-relaxed text-lg">
                      {formData.step15.endMessageDescription}
                    </p>
                  </div>
                )}

              {/* Validity Date */}
              {formData?.step15?.projectValidUntil && (
                <div className="bg-white/80 rounded-lg p-4 border border-white/20 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-3">
                    <Calendar size={20} className="text-white/70" />
                    <div className="text-white-neutral-light-800">
                      <span className="text-sm">Proposta válida até:</span>
                      <div className="font-semibold text-lg">
                        {formatDate(formData.step15.projectValidUntil)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {formData?.step15?.hideFinalMessage && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Mensagem Final&quot; está atualmente oculta da proposta.
        </div>
      )}

      {/* Expand Button */}
      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
