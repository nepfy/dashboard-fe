import Image from "next/image";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function TeamPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step3?.hideAboutYourTeamSection && (
          <>
            <div className="w-full space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  {formData?.step3?.ourTeamSubtitle}
                </h2>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData?.step3?.teamMembers?.map((member) => (
                    <div key={member.id} className="rounded-lg p-6">
                      {member.photo && (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden relative">
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}

                      <h3 className="text-xl font-semibold text-white-neutral-light-100 text-center mb-2">
                        {member.name}
                      </h3>

                      <p className="text-white-neutral-light-100 text-center">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mensagem quando não há integrantes */}
                {(!formData?.step3?.teamMembers ||
                  formData.step3.teamMembers.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum integrante adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step3?.hideAboutYourTeamSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Sobre seu time&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
