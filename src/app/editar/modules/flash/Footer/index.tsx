import { FooterSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashFooter({
  mainColor,
  hideSection,
  callToAction,
  disclaimer,
  hideDisclaimer,
  validity,
  buttonTitle,
}: FooterSection) {
  const { updateFooter } = useEditor();
  return (
    <div style={{ background: mainColor }} className="relative overflow-hidden">
      {!hideSection && (
        <>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-43">
            <div className="lg:pl-10 lg:pt-11 lg:border-l lg:border-l-[#A0A0A0] max-w-[1100px] mb-15">
              <EditableText
                as="p"
                value={callToAction || ""}
                onChange={(newCallToAction: string) =>
                  updateFooter({ callToAction: newCallToAction })
                }
                className="text-[32px] lg:text-[88px] text-[#E6E6E6] font-normal"
              />
              {validity && (
                <p className="font-bold text-sm text-[#E6E6E6] pb-10 pt-6 lg:pt-0">
                  Proposta válida até -{" "}
                  <span className="font-normal text-[#E6E6E6]/40">
                    {formatDateToDDDeMonthDeYYYY(validity.toString())}
                  </span>
                </p>
              )}
              <button className="rounded-full bg-[#FBFBFB] w-full lg:w-[326px] py-4 text-[#121212] font-semibold text-sm">
                {buttonTitle || "Iniciar Projeto"}
              </button>
            </div>

            {!hideDisclaimer && (
              <div className="w-full flex justify-end mb-16">
                <EditableText
                  as="p"
                  value={disclaimer || ""}
                  onChange={(newDisclaimer: string) =>
                    updateFooter({ disclaimer: newDisclaimer })
                  }
                  className="text-[#E6E6E6] text-[15px] w-[430px]"
                />
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
