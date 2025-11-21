import { useState } from "react";
import { FooterSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function MinimalFooter({
  hideSection,
  callToAction,
  disclaimer,
  email = "contato@nepfy.com.br",
  phone = "+55 11 99999-9999",
  marqueeText = "Brand Design → Design Systems → UI Design → Webflow Development",
  hideMarquee,
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
          justify-content: space-between;
          align-items: flex-start;
          padding-top: 8rem;
          padding-bottom: 7rem;
          grid-column-gap: 6rem;
          grid-row-gap: 4rem;
        }

        .footer-heading {
          display: flex;
          flex-flow: column;
          max-width: 52ch;
          grid-column-gap: 1.5rem;
          grid-row-gap: 1.5rem;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          flex-shrink: 0;
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

        .footer-marquee {
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          max-height: 390px;
        }

        .footer-marquee_text {
          font-size: 15vw;
          font-weight: 300;
          color: rgba(0, 0, 0);
          white-space: nowrap;
          animation: marquee 200s linear infinite;
          margin-top: 3rem;
        }

        @media screen and (max-width: 991px) {
          .footer-component {
            flex-direction: column;
            gap: 4rem;
            padding-top: 6rem;
            padding-bottom: 6rem;
          }

          .footer-heading {
            max-width: 100%;
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
                      <div className="footer-proposal mt-6">
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
                        {disclaimer && (
                          <div className="mt-3 max-w-[500px]">
                            <EditableText
                              value={disclaimer}
                              onChange={(newDisclaimer: string) =>
                                updateFooter({ disclaimer: newDisclaimer })
                              }
                              className="text-size-regular opacity-60"
                              editingId="footer-disclaimer"
                              canEdit={canEdit}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="footer-contact">
                    {email && (
                      <div className="flex flex-col gap-2">
                        <div className="text-[0.875rem] font-medium tracking-wider text-[#000000] uppercase opacity-60">
                          EMAIL
                        </div>
                        <div>
                          <EditableText
                            value={email}
                            onChange={(newEmail) =>
                              updateFooter({ email: newEmail })
                            }
                            editingId="footer-email"
                            className="text-[1.25rem] leading-[1.5] font-normal text-[#000000]"
                            canEdit={canEdit}
                          />
                        </div>
                      </div>
                    )}

                    {phone && (
                      <div className="flex flex-col gap-2">
                        <div className="text-[0.875rem] font-medium tracking-wider text-[#000000] uppercase opacity-60">
                          WHATSAPP
                        </div>
                        <div>
                          <EditableText
                            value={phone}
                            onChange={(newPhone) =>
                              updateFooter({ phone: newPhone })
                            }
                            editingId="footer-phone"
                            className="text-[1.25rem] leading-[1.5] font-normal text-[#000000]"
                            canEdit={canEdit}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {!hideMarquee && (
              <div className="footer-marquee">
                <div className="marquee_content">
                  <div className="footer-marquee_text">
                    <EditableText
                      value={
                        marqueeText ||
                        "Brand Design → Design Systems → UI Design → Webflow Development"
                      }
                      onChange={(newMarqueeText) =>
                        updateFooter({ marqueeText: newMarqueeText })
                      }
                      className="footer-marquee_text"
                      editingId="footer-marquee"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
