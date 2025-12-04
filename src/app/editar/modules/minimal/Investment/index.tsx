"use client";

import { InvestmentSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalInvestmentProps extends InvestmentSection {
  mainColor?: string;
  hideProjectScope?: boolean;
}

export default function MinimalInvestment({
  title,
  projectScope,
  hideSection,
  mainColor = "#000000",
  hideProjectScope,
}: MinimalInvestmentProps) {
  const { updateInvestment } = useEditor();

  if (hideSection) return null;

  return (
    <>
      <style jsx>{`
        .section_invest {
          position: relative;
          background-color: ${mainColor};
          color: var(--white);
          padding: 8rem 0;
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
        
        .invest-component {
          display: flex !important;
          justify-content: space-between !important;
          gap: 4rem !important;
          align-items: flex-start !important;
        }
        
        .invest-heading {
          display: flex !important;
          flex-direction: column !important;
          gap: 2rem !important;
        }
        
        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .text-size-small {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
        }
        
        .heading-style-h1 {
          color: var(--white);
          margin: 0;
          font-size: 3.5rem;
          font-weight: 300;
          line-height: 1.2;
        }
        
        .invest-value-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .invest-value {
          font-size: 4rem;
          font-weight: 600;
          color: var(--white);
          line-height: 1;
        }
        
        .invest-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, .7);
          line-height: 1.6;
        }
        
        .invest-scope {
          margin-top: 2rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          background: rgba(255, 255, 255, .02);
        }
        
        .scope-title {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: var(--white);
        }
        
        .scope-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .7);
          white-space: pre-wrap;
        }
        
        .edit-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, .1);
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: .5rem;
          padding: .5rem .75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s, background .2s;
          z-index: 100;
        }
        
        .section_invest:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 991px) {
          .invest-component {
            flex-direction: column;
            gap: 3rem;
          }
        }
        
        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .section_invest {
            padding: 5rem 0;
          }
          .heading-style-h1 {
            font-size: 2.5rem;
          }
          .invest-value {
            font-size: 3rem;
          }
        }
      `}</style>

      <section id="investiment" className="section_invest">
        <div className="padding-global">
          <div className="container-large">
            <div className="invest-component">
              <div className="invest-heading">
                <div>
                  <div className="text-style-allcaps text-size-small">Investment</div>
                  <EditableText
                    value={title || ""}
                    onChange={(newTitle: string) =>
                      updateInvestment({ title: newTitle })
                    }
                    className="heading-style-h1"
                    editingId="investment-title"
                  />
                </div>
              </div>
              <div className="invest-value-wrapper">
                <div className="invest-value">R$ 0,00</div>
                <div className="invest-description">
                  Investment required to bring this project to life.
                </div>
                {!hideProjectScope && projectScope && (
                  <div className="invest-scope">
                    <div className="scope-title">Project Scope</div>
                    <EditableText
                      value={projectScope}
                      onChange={(newScope: string) =>
                        updateInvestment({ projectScope: newScope })
                      }
                      className="scope-description"
                      editingId="investment-projectScope"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
