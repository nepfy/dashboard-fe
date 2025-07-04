import Image from "next/image";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function ResultsPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step5?.hideYourResultsSection && (
          <>
            <div className="w-full space-y-8">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData?.step5?.results?.map((result) => (
                    <div key={result.id}>
                      {!result.hidePhoto && result.photo && (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden relative">
                          <Image
                            src={result.photo}
                            alt={result.client || "Resultado"}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}

                      <h3 className="text-xl font-semibold text-white-neutral-light-100 text-center mb-3">
                        {result.client}
                      </h3>

                      {result.subtitle && (
                        <p className="text-white-neutral-light-100 text-center mb-2">
                          <span className="text-sm">Instagram:</span>{" "}
                          <span className="font-medium">
                            @{result.subtitle}
                          </span>
                        </p>
                      )}

                      <div className="space-y-2 mt-4">
                        {result.investment && (
                          <div className="flex flex-col justify-between items-center">
                            <span className="text-sm text-white-neutral-light-100">
                              Investimento:
                            </span>
                            <span className="font-semibold text-white-neutral-light-200">
                              R$ {result.investment}
                            </span>
                          </div>
                        )}

                        {result.roi && (
                          <div className="flex flex-col justify-between items-center">
                            <span className="text-sm text-white-neutral-light-100">
                              ROI:
                            </span>
                            <span className="font-semibold text-white-neutral-light-200">
                              R$ {result.roi}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {(!formData?.step5?.results ||
                  formData.step5.results.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum resultado adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step5?.hideYourResultsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Seus resultados&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
