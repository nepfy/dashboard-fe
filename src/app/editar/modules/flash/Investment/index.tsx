import { InvestmentSection } from "#/types/template-data";

export default function FlashInvestment({
  hideSection,
  title,
  projectScope,
  hideProjectScope,
}: InvestmentSection) {
  return (
    <div className="bg-black relative overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
          <p className="text-[24px] lg:text-[48px] text-[#E6E6E6] max-w-[1055px] pb-21 font-normal">
            <span className="text-[#A0A0A0] font-semibold">Investimento. </span>
            {title ||
              "Planos estratégicos que conectam design e retorno financeiro para sua clínica crescer."}
          </p>

          <div className="max-w-[700px] border-l border-l-[#A0A0A0]/30 pl-5 lg:pl-10">
            <div className="flex items-center gap-2 mb-23 lg:mb-42">
              <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
              <p className="text-white text-sm font-semibold">
                Escopo do projeto
              </p>
            </div>

            {!hideProjectScope && (
              <p className="text-[#E6E6E6]">
                {projectScope ||
                  "Criação de identidade visual médica completa, alinhada ao branding estratégico, fortalecendo a presença da marca e sua conexão com o público. Desenvolvimento de conteúdos para redes sociais e aplicação de direção de arte em todos os materiais, garantindo comunicação visual consistente e impactante."}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        className="hidden lg:block"
        style={{
          width: 746,
          height: 746,
          background:
            "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",
          filter: "blur(80px)",
          position: "absolute",
          bottom: 0,
          right: -500,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />
    </div>
  );
}
