"use client";

import { TermsConditionsSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";

export default function MinimalTermsAndConditions({
  title,
  items,
  hideSection,
}: TermsConditionsSection) {
  const { updateTermsConditions } = useEditor();

  if (hideSection) return null;

  // Parse term: if it contains ":", split into title and description
  const parseTerm = (term: string) => {
    if (term.includes(":")) {
      const [termTitle, ...descriptionParts] = term.split(":");
      return {
        title: termTitle.trim(),
        description: descriptionParts.join(":").trim(),
      };
    }
    return {
      title: "",
      description: term,
    };
  };

  return (
    <>
      <style jsx global>{`
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

        .invest-terms {
          padding-top: 4rem;
        }

        .invest-terms > :first-child {
          font-size: 1.5rem;
          font-weight: 500;
          color: #fbfbfb;
          margin-bottom: 0;
        }

        .terms-divider {
          opacity: 0.1;
          background-color: #d9d9d9;
          width: 100%;
          height: 1px;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .w-layout-grid {
          display: grid;
          grid-row-gap: 16px;
          grid-column-gap: 16px;
          grid-template-rows: auto auto;
        }

        .terms-grid {
          grid-template-rows: auto;
          grid-template-columns: 1fr 1fr 1fr;
          place-items: start stretch;
        }

        .terms-card {
          grid-column-gap: 0.5rem;
          grid-row-gap: 1.5rem;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          max-width: 46ch;
          display: flex;
        }

        .terms-card > div:first-child {
          font-size: 1rem;
          font-weight: 500;
          color: #fbfbfb;
          margin-bottom: 0.5rem;
        }

        .opacity-70 {
          opacity: 0.7;
        }

        .opacity-70 p {
          margin: 0;
          color: #fbfbfb;
          font-size: 1rem;
          line-height: 1.6;
        }

        @media screen and (max-width: 991px) {
          .terms-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media screen and (max-width: 767px) {
          .terms-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="padding-global bg-black pb-20">
        <div className="container-large">
          <div className="invest-terms">
            <EditableText
              value={title || "Termos & Condições"}
              onChange={(newTitle: string) =>
                updateTermsConditions({ title: newTitle })
              }
              className=""
              editingId="terms-title"
            />
            <div className="terms-divider"></div>
            <div className="w-layout-grid terms-grid">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const { title: termTitle, description } = parseTerm(
                    item.term
                  );
                  return (
                    <div key={index} className="terms-card">
                      {termTitle && <div>{termTitle}</div>}
                      <div className="opacity-70">
                        <EditableText
                          value={description || item.term}
                          onChange={(newTerm: string) => {
                            const updatedItems = [...(items || [])];
                            updatedItems[index] = {
                              ...item,
                              term: termTitle
                                ? `${termTitle}: ${newTerm}`
                                : newTerm,
                            };
                            updateTermsConditions({ items: updatedItems });
                          }}
                          className=""
                          editingId={`terms-item-${index}`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="terms-card">
                  <div>Gestão de Projetos</div>
                  <div className="opacity-70">
                    <p>
                      Um gerente dedicado coordena cada fase, garantindo uma
                      comunicação fluida, eficiente e a continuidade no projeto.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
