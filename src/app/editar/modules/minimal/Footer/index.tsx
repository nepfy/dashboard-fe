import { useState } from "react";
import { FooterSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashFooter({
  hideSection,
  callToAction,
  email,
  phone,
  buttonConfig,
}: FooterSection) {
  const { updateFooter, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;
  return (
    <>
      <style jsx>{`
        .footer {
          background-color: #ffffff;
          color: #000000;
          overflow: hidden;
        }

        .padding-global {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }

        .container-large {
          width: 100%;
          max-width: 90rem;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-component {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          padding-top: 8rem;
          padding-bottom: 7rem;
          grid-column-gap: 6rem;
          grid-row-gap: 4rem;
        }

        .footer-heading {
          display: flex;
          flex-flow: column;
          max-width: 107ch;
          grid-column-gap: 1.5rem;
          grid-row-gap: 1.5rem;
        }

        .heading-style-h1 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .text-weight-normal {
          font-weight: 400;
        }

        .footer-proposal {
          opacity: 0.6;
        }

        .text-size-regular {
          font-size: 1rem;
        }

        .footer_subtitle {
          margin-top: 0;
          margin-bottom: 0;
        }

        @media screen and (max-width: 991px) {
          .footer-component {
            flex-flow: column;
            padding-top: 6rem;
            padding-bottom: 6rem;
          }
        }

        @media screen and (max-width: 767px) {
          .heading-style-h1 {
            font-size: 2.5rem;
          }

          .padding-global {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }

        @media screen and (max-width: 479px) {
          .footer-component {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
      <div className="footer">
        {!hideSection && (
          <>
            <div className="padding-global">
              <div className="container-large">
                <div className="footer-component">
                  <div className="footer-heading">
                    <EditableText
                      value={callToAction || ""}
                      onChange={(newCallToAction: string) =>
                        updateFooter({ callToAction: newCallToAction })
                      }
                      className="text-weight-normal text-[3rem] leading-[1.4] font-light text-[#000000]"
                      editingId="footer-callToAction"
                    />

                    {projectData?.projectValidUntil && (
                      <div className="footer-proposal">
                        <div
                          className="m-0 h-auto w-auto border p-0"
                          style={{
                            border: isDateModalOpen
                              ? "1px solid #0170D6"
                              : "1px solid transparent",
                            background: isDateModalOpen
                              ? "#0170D666"
                              : "transparent",
                          }}
                        >
                          <div
                            className={`text-[1rem] leading-[1.5] font-normal text-[#000000] ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canEdit) {
                                setIsDateModalOpen(true);
                              }
                            }}
                            style={{
                              border: isDateModalOpen
                                ? "1px solid #0170D6"
                                : "1px solid transparent",
                              background: isDateModalOpen
                                ? "#0170D666"
                                : "transparent",
                              padding: "4px",
                            }}
                            onMouseEnter={(e) => {
                              if (canEdit && !isDateModalOpen) {
                                e.currentTarget.style.border =
                                  "1px solid #0170D6";
                                e.currentTarget.style.background = "#0170D666";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isDateModalOpen) {
                                e.currentTarget.style.border =
                                  "1px solid transparent";
                                e.currentTarget.style.background =
                                  "transparent";
                              }
                            }}
                          >
                            Proposta válida até —{" "}
                            <span>
                              {formatDateToDDDeMonthDeYYYY(
                                projectData.projectValidUntil.toString()
                              )}
                            </span>
                            <EditableDate
                              isModalOpen={isDateModalOpen}
                              setIsModalOpen={setIsDateModalOpen}
                              editingId="footer-date"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-8">
                    {email && (
                      <div className="flex flex-col gap-6">
                        <div className="text-uppercase text-[1.25rem] leading-[1.5] font-normal text-[#000000]">
                          Email
                        </div>
                        <div>
                          <EditableText
                            value={email}
                            onChange={(newEmail) =>
                              updateFooter({ email: newEmail })
                            }
                            editingId="footer-email"
                            className="text-[1.5rem] leading-[1.5] font-light text-[#000000]"
                            canEdit={canEdit}
                          />
                        </div>
                      </div>
                    )}

                    {phone && (
                      <div className="flex flex-col gap-6">
                        <div className="text-uppercase text-[1.25rem] leading-[1.5] font-normal text-[#000000]">
                          Whatsapp
                        </div>
                        <div>
                          <EditableText
                            value={phone}
                            onChange={(newPhone) =>
                              updateFooter({ phone: newPhone })
                            }
                            editingId="footer-phone"
                            className="text-[1.5rem] leading-[1.5] font-light text-[#000000]"
                            canEdit={canEdit}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex max-h-[10rem] items-center justify-center overflow-hidden">
              <div className="is-footer pt-[3rem] text-[15vw] font-light text-[#000000]">
                {buttonConfig?.buttonTitle}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
