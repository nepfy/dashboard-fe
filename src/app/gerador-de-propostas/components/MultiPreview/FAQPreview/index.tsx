import { useState } from "react";

import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";
import { ChevronDown, MessageCircle } from "lucide-react";

export default function FAQPreview() {
  const { formData } = useProjectGenerator();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-start items-start h-full p-8 overflow-y-scroll">
        {!formData?.step14?.hideFaqSection && (
          <div className="w-full space-y-8">
            {/* FAQ List */}
            <div className="space-y-4">
              {formData?.step14?.faq?.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white/80 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
                >
                  {/* FAQ Question Header */}
                  <button
                    onClick={() => toggleFaq(faq.id!)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white-neutral-light-800 pr-4">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ChevronDown
                        size={20}
                        className={`text-white/70 transition-transform duration-200 ${
                          openFaq === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* FAQ Answer */}
                  {openFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="pl-2">
                        <div className="bg-white/5 rounded-lg p-4 border-l-4 border-white/30">
                          <div className="leading-relaxed whitespace-pre-wrap text-white-neutral-light-800">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {(!formData?.step14?.faq || formData.step14.faq.length === 0) && (
              <div className="text-center py-12">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Nenhuma pergunta adicionada
                </h3>
                <p className="text-white/70 text-sm">
                  Adicione perguntas frequentes para esclarecer dúvidas dos seus
                  clientes
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Notification (only when hidden) */}
      {formData?.step14?.hideFaqSection && (
        <div className="absolute bottom-10 left-6 z-50 hidden p-2 text-sm bg-yellow-light-25 text-white-neutral-light-100 w-[460px] h-[50px] xl:flex items-center justify-center rounded-[10px] border border-yellow-light-50 shadow-lg">
          A seção &quot;Perguntas Frequentes&quot; está atualmente oculta da
          proposta.
        </div>
      )}

      {/* Expand Button */}
      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
