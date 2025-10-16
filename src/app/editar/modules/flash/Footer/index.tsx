import { FooterSection } from "#/types/template-data";

export default function FlashFooter({
  hideSection,
  callToAction,
  disclaimer,
  hideDisclaimer,
  validity,
  buttonTitle,
}: FooterSection) {
  return (
    <div className="bg-[#4F21A1] relative overflow-hidden">
      {!hideSection && (
        <>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-43">
            <div className="lg:pl-10 lg:pt-11 lg:border-l lg:border-l-[#A0A0A0] max-w-[1100px] mb-15">
              <p className="text-[32px] lg:text-[88px] text-[#E6E6E6] font-normal">
                {callToAction || "Vamos iniciar sua transformação visual!"}
              </p>
              <p className="font-bold text-sm text-[#E6E6E6] pb-10 pt-6 lg:pt-0">
                Proposta válida até -{" "}
                <span className="font-normal text-[#E6E6E6]/40">
                  {validity instanceof Date
                    ? validity.toDateString()
                    : validity || "30 de Outubro de 2025"}
                </span>
              </p>
              <button className="rounded-full bg-[#FBFBFB] w-full lg:w-[326px] py-4 text-[#121212] font-semibold text-sm">
                {buttonTitle || "Iniciar Projeto"}
              </button>
            </div>

            {!hideDisclaimer && (
              <div className="w-full flex justify-end mb-16">
                <p className="text-[#E6E6E6] text-[15px] max-w-[430px]">
                  {disclaimer ||
                    "Estou à disposição para esclarecer dúvidas e ajustar qualquer detalhe desta proposta. Meu compromisso é oferecer atendimento exclusivo e estratégico, para que sua clínica alcance o posicionamento desejado e maximize resultados com um design que vende e fideliza."}
                </p>
              </div>
            )}
          </div>
          <p className="text-[61px] lg:text-[226px] text-[#E6E6E6] p-0 m-0 absolute bottom-[-40px] lg:bottom-[-140px] left-1/2 -translate-x-1/2 text-nowrap">
            {buttonTitle || "Iniciar Projeto"}
          </p>
        </>
      )}
    </div>
  );
}
