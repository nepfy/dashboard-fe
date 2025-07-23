import type { CompleteProjectData } from "#/app/project/types/project";

interface FAQSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function FAQSectionPreview({ data }: FAQSectionPreviewProps) {
  return (
    <>
      {!data?.hideFaqSection && data?.faq && data?.faq.length > 0 && (
        <div
          className="w-full px-10 lg:px-30 py-20"
          style={{
            background: `linear-gradient(
            190deg, 
            #000000 0%,
            #000000 10%,
            #000000 20%,
            #000000 30%,
            ${data?.mainColor} 40%, 
            ${data?.mainColor} 50%, 
            #000000 65%, 
            #000000 80%, 
            #000000 90%, 
            #000000 100%
            )`,
          }}
        >
          <p className="text-[#DFD5E1] text-4xl lg:text-7xl">
            Perguntas <br /> Frequentes
          </p>
          <div className="w-full mt-30">
            {data.faq.map((faq, index) => (
              <div
                key={faq.id}
                className="border-b border-gray-300 last:border-b-0 w-full"
              >
                <div className="w-full py-4 px-6">
                  {/* Desktop Layout */}
                  <div className="hidden lg:flex flex-col items-stretch justify-between mt-5">
                    <div className="flex items-start mb-4">
                      <span className="text-lg font-medium text-[#DFD5E1] w-[30%]">
                        {index + 1}.
                      </span>

                      <div className="flex-1 flex justify-start px-4">
                        <div className="w-full mx-auto">
                          <p className="text-lg font-medium text-[#DFD5E1] text-left">
                            {faq.question}
                          </p>

                          {faq.answer && (
                            <div className="w-full pb-2">
                              <p className="text-[#DFD5E1] leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-left transition-all duration-600 ease-in-out min-w-[4rem] flex justify-end">
                        <span className="text-sm font-semibold text-[#DFD5E1]">
                          LEIA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-[#DFD5E1]">
                          {index + 1}.
                        </span>
                        <span className="text-lg font-medium text-white">
                          {faq.question}
                        </span>
                      </div>

                      <div className="text-left transition-all duration-600 ease-in-out">
                        <span className="text-sm font-semibold text-[#DFD5E1]">
                          LEIA
                        </span>
                      </div>
                    </div>

                    {/* Mobile Answer */}
                    {faq.answer && (
                      <div className="pb-2">
                        <p className="text-[#A0A0A0] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
