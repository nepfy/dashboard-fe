import Image from "next/image";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function ClientsPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step6?.hideClientsSection && (
          <>
            <div className="w-full space-y-8">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData?.step6?.clients?.map((client) => (
                    <div key={client.id}>
                      {!client.hideLogo && client.logo && (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden relative">
                          <Image
                            src={client.logo}
                            alt={client.name || "Cliente"}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}

                      {!client.hideClientName && client.name && (
                        <h3 className="text-xl font-semibold text-white-neutral-light-100 text-center mb-3">
                          {client.name}
                        </h3>
                      )}
                    </div>
                  ))}
                </div>

                {(!formData?.step6?.clients ||
                  formData.step6.clients.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum cliente adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step6?.hideClientsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Seus clientes&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
