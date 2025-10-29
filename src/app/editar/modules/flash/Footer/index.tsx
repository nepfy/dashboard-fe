import { useState } from "react";
import { FooterSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableButton from "#/app/editar/components/EditableButton";

export default function FlashFooter({
  mainColor,
  hideSection,
  callToAction,
  disclaimer,
  hideDisclaimer,
}: FooterSection) {
  const { updateFooter, projectData } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);
  return (
    <div style={{ background: mainColor }} className="relative overflow-hidden">
      {!hideSection && (
        <>
          <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-43 lg:px-41 lg:pt-22">
            <div className="mb-15 max-w-[1100px] lg:border-l lg:border-l-[#A0A0A0] lg:pt-11 lg:pl-10">
              <EditableText
                value={callToAction || ""}
                onChange={(newCallToAction: string) =>
                  updateFooter({ callToAction: newCallToAction })
                }
                className="mb-7 w-full text-[32px] leading-[1.2] font-normal text-[#E6E6E6] lg:text-[88px]"
              />

              {projectData?.projectValidUntil && (
                <div
                  className="self-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDateModalOpen(true);
                  }}
                >
                  <p
                    className={`inline cursor-pointer text-sm font-bold text-[#E6E6E6] hover:border-[#0170D6] hover:bg-[#0170D666] lg:ml-[10px] lg:pt-0 ${isDateModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border border-transparent bg-transparent"}`}
                  >
                    Proposta válida até -{" "}
                    <span className="font-normal text-[#E6E6E6]/40">
                      {formatDateToDDDeMonthDeYYYY(
                        projectData.projectValidUntil.toString()
                      )}
                    </span>
                  </p>
                  <EditableDate
                    isModalOpen={isDateModalOpen}
                    setIsModalOpen={setIsDateModalOpen}
                  />
                </div>
              )}

              <div
                className="relative z-5 mt-10 h-auto w-auto cursor-pointer py-2 lg:w-[336px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsButtonModalOpen(true);
                }}
              >
                <div
                  className={`absolute inset-0 hover:border-[#0170D6] hover:bg-[#0170D666] ${isButtonModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                />
                <button className="mx-auto block w-full rounded-full bg-[#FBFBFB] py-4 text-sm font-semibold text-[#121212] lg:w-[326px]">
                  {projectData?.buttonConfig?.buttonTitle || "Iniciar Projeto"}
                </button>
                <EditableButton
                  isModalOpen={isButtonModalOpen}
                  setIsModalOpen={setIsButtonModalOpen}
                />
              </div>
            </div>

            {!hideDisclaimer && (
              <div className="mb-16 flex w-full justify-end">
                <EditableText
                  value={disclaimer || ""}
                  onChange={(newDisclaimer: string) =>
                    updateFooter({ disclaimer: newDisclaimer })
                  }
                  className="w-[430px] text-[15px] text-[#E6E6E6]"
                />
              </div>
            )}
          </div>

          <p className="absolute bottom-[-40px] left-1/2 m-0 -translate-x-1/2 p-0 text-[61px] text-nowrap text-[#E6E6E6] lg:bottom-[-140px] lg:text-[226px]">
            {projectData?.buttonConfig?.buttonTitle || "Iniciar Projeto"}
          </p>
        </>
      )}
    </div>
  );
}
