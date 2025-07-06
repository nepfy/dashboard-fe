import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function ProcessPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step7?.hideProcessSection && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                {formData?.step7?.processSubtitle}
              </h2>
            </div>
            <div className="w-full space-y-8">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData?.step7?.processSteps?.map((process) => (
                    <div key={process.id}>
                      <h3 className="text-xl font-semibold text-white-neutral-light-100 text-center mb-3">
                        {process.stepName}
                      </h3>

                      <p className="text-sm font-semibold text-white-neutral-light-100 text-center mb-3">
                        {process.description}
                      </p>
                    </div>
                  ))}
                </div>

                {(!formData?.step7?.processSteps ||
                  formData.step7.processSteps.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum processo adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step7?.hideProcessSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Seus processos&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
