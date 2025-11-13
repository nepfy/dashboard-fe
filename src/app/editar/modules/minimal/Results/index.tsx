"use client";

import { useState } from "react";
import { Result, ResultSection, TeamMember } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalResultsProps extends ResultSection {
  mainColor?: string;
}

export default function MinimalResults({
  title,
  items,
  hideSection,
  mainColor = "#000000",
}: MinimalResultsProps) {
  const { updateResults, updateResultItem, reorderResultItems, activeEditingId } =
    useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  if (hideSection || !items || items.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_results {
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
        
        .results-heading {
          margin-bottom: 4rem;
        }
        
        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .text-size-small {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
        }
        
        .heading-style-h2 {
          color: var(--white);
          margin: 1rem 0 0;
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.3;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .result-card {
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          cursor: pointer;
          transition: all .3s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .result-card:hover {
          border-color: rgba(255, 255, 255, .3);
          background: rgba(255, 255, 255, .02);
        }
        
        .result-client {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--white);
        }
        
        .result-metrics {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }
        
        .result-metric {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
        }
        
        .result-instagram {
          margin-top: auto;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .5);
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
        
        .section_results:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .section_results {
            padding: 5rem 0;
          }
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section_results">
        <div className="padding-global">
          <div className="container-large">
            <div className="results-heading">
              <div className="text-style-allcaps text-size-small">Proven Results</div>
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) => updateResults({ title: newTitle })}
                className="heading-style-h2"
                editingId="results-title"
              />
            </div>
            <div className="results-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`result-card relative ${
                    openModalId === item.id
                      ? "cursor-default border-[#0170D6] bg-[#0170D666]"
                      : canEdit
                        ? "cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666]"
                        : "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (canEdit || openModalId === item.id) {
                      setOpenModalId(item?.id ?? null);
                    }
                  }}
                >
                  <div className="result-client">{item.client}</div>
                  <div className="result-metrics">
                    <div className="result-metric">
                      <div className="metric-label">Investment</div>
                      <div className="metric-value">{item.investment}</div>
                    </div>
                    <div className="result-metric">
                      <div className="metric-label">ROI</div>
                      <div className="metric-value">{item.roi}</div>
                    </div>
                  </div>
                  {item.instagram && (
                    <div className="result-instagram">{item.instagram}</div>
                  )}
                  <EditableImage
                    isModalOpen={openModalId === item.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (item?.id ?? null) : null)
                    }
                    editingId={`results-${item.id}`}
                    itemType="results"
                    items={items || []}
                    currentItemId={item?.id ?? null}
                    onUpdateItem={updateResultItem}
                    onReorderItems={
                      reorderResultItems as (items: TeamMember[] | Result[]) => void
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
