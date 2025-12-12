"use client";

import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { InvestmentSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import { useState } from "react";

export default function FlashScope({
  projectScope,
  subtitle,
}: InvestmentSection) {
  const { updateInvestment, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;

  return (
    <>
      <style jsx global>{`
        .container-large {
          width: 100%;
          max-width: 90rem;
          margin-left: auto;
          margin-right: auto;
        }

        .scope-heading {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4rem;
        }

        .scope-component {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4rem;
        }

        .invest_left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 40ch;
        }

        .invest_title {
          max-width: 87ch;
          justify-self: flex-start;
        }

        .text-size-small {
          font-size: 0.875rem;
          color: #ffffff;
        }

        .text-weight-light {
          font-weight: 300;
        }

        .text-color-grey {
          color: #b3b3b3;
        }

        .heading-style-h1 {
          font-size: 3rem !important;
          font-weight: 300;
          line-height: 1.4;
          margin: 0;
        }

        .invest-scope p {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        @media screen and (max-width: 991px) {
          .scope-heading {
            flex-direction: column;
            gap: 2rem;
          }

          .invest_left {
            max-width: 100%;
          }

          .invest_title {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="bg-black">
        <div className="padding-global pt-80 pb-60">
          <div className="container-large">
            <div id="investment" className="scope-component">
              <div className="scope-heading">
                <div className="invest_left pt-4">
                  <div
                    className={`relative m-0 h-auto w-fit border p-0 hover:border-[#0170D6] hover:bg-[#0170D666] ${isDateModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                  >
                    <div
                      className={`text-size-small text-weight-light ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canEdit) {
                          setIsDateModalOpen(true);
                        }
                      }}
                    >
                      Proposta —{" "}
                      <span className="text-color-grey">
                        {formatDateToDDDeMonthDeYYYY(
                          projectData?.projectValidUntil?.toString() || ""
                        )}
                      </span>
                      <EditableDate
                        isModalOpen={isDateModalOpen}
                        setIsModalOpen={setIsDateModalOpen}
                        editingId="investment-date"
                      />
                    </div>
                  </div>

                  <div className="invest_subtitle">
                    <EditableText
                      value={subtitle || ""}
                      onChange={(newSubtitle: string) =>
                        updateInvestment({ subtitle: newSubtitle })
                      }
                      className="text-size-medium"
                      editingId="investment-subtitle"
                    />
                  </div>
                </div>

                <div className="invest_title">
                  <EditableText
                    value={projectScope || ""}
                    onChange={(newProjectScope: string) =>
                      updateInvestment({ projectScope: newProjectScope })
                    }
                    className="heading-style-h1 text-weight-light m-0 p-0"
                    editingId="investment-projectScope"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
