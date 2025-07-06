import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function InvestmentPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex justify-center items-center h-full p-8">
        {!formData?.step10?.hideInvestmentSection && (
          <div className="text-center mb-12">
            <div className="w-96 h-96 mx-auto mb-4 rounded-lg overflow-hidden relative">
              <p className="text-2xl font-semibold text-white-neutral-light-100 text-center mb-3">
                {formData?.step10?.investmentTitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {formData?.step10?.hideInvestmentSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Investimento&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
