import Image from "next/image";
import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function TestimonialsPreview() {
  const { formData } = useProjectGenerator();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        {!formData?.step9?.hideTestimonialsSection && (
          <>
            <div className="w-full space-y-8">
              <div className="w-full">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {formData?.step9?.testimonials?.map((testimonial) => (
                    <div key={testimonial.id} className="rounded-lg p-4">
                      <p className="text-xl font-semibold text-white-neutral-light-100 text-center mb-2">
                        {testimonial.testimonial}
                      </p>

                      <p className="text-sm font-semibold text-white-neutral-light-100 text-center mb-2">
                        {testimonial.name}
                      </p>

                      <p className="text-white-neutral-light-100 text-center">
                        {testimonial.role}
                      </p>

                      {testimonial.photo && !testimonial.hidePhoto && (
                        <div className="w-24 h-24 mx-auto mt-4 rounded-2xl overflow-hidden relative">
                          <Image
                            src={testimonial.photo}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {(!formData?.step9?.testimonials ||
                  formData.step9.testimonials.length === 0) && (
                  <div className="text-center text-white opacity-75">
                    <p>Nenhum depoimento adicionado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {formData?.step9?.hideTestimonialsSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Depoimentos&quot; está atualmente oculta da proposta.
        </div>
      )}

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
