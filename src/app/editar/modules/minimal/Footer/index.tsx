import { useState } from "react";
import { FooterSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableButton from "#/app/editar/components/EditableButton";

export default function MinimalFooter({
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
    <footer className="footer">
      {!hideSection && (
        <div className="footer-component">
          <div className="padding-global">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="footer-heading">
                <p className="heading-style-h1 text-weight-normal">
                  <EditableText
                    value={callToAction || ""}
                    onChange={(newCallToAction: string) =>
                      updateFooter({ callToAction: newCallToAction })
                    }
                    className="heading-style-h1 text-weight-normal"
                  />
                </p>

                {projectData?.projectValidUntil && (
                  <div
                    className="footer-proposal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDateModalOpen(true);
                    }}
                  >
                    <div
                      className={`text-size-regular ${isDateModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border border-transparent bg-transparent"}`}
                    >
                      Proposta válida até —{" "}
                      <span>
                        {formatDateToDDDeMonthDeYYYY(
                          projectData.projectValidUntil.toString()
                        )}
                      </span>
                    </div>
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
                  <button className="mx-auto block w-full rounded-full bg-[#121212] py-4 text-sm font-semibold text-white lg:w-[326px]">
                    {projectData?.buttonConfig?.buttonTitle || "Iniciar Projeto"}
                  </button>
                  <EditableButton
                    isModalOpen={isButtonModalOpen}
                    setIsModalOpen={setIsButtonModalOpen}
                  />
                </div>
              </div>

              {!hideDisclaimer && (
                <div className="footer_subtitle">
                  <p>
                    <EditableText
                      value={disclaimer || ""}
                      onChange={(newDisclaimer: string) =>
                        updateFooter({ disclaimer: newDisclaimer })
                      }
                      className="text-size-regular"
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

