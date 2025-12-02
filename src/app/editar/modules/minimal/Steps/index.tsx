"use client";

import { useState } from "react";
import { StepsSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalStepsProps extends StepsSection {
  mainColor?: string;
}

export default function MinimalSteps({
  title,
  hideSection,
  topics,
  mainColor = "#000000",
}: MinimalStepsProps) {
  const { updateSteps, updateStepTopic, reorderStepTopics } =
    useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const items = topics || [];

  if (hideSection || !items || items.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_steps {
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
        
        .steps-heading {
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
        
        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .step-item {
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          cursor: pointer;
          transition: all .3s;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: flex-start;
        }
        
        .step-item:hover {
          border-color: rgba(255, 255, 255, .3);
          background: rgba(255, 255, 255, .02);
        }
        
        .step-number {
          font-size: 2rem;
          font-weight: 300;
          color: rgba(255, 255, 255, .4);
          min-width: 4rem;
        }
        
        .step-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .step-title {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--white);
        }
        
        .step-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .7);
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
        
        .section_steps:hover .edit-button {
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
          .section_steps {
            padding: 5rem 0;
          }
          .step-item {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      <section className="section_steps">
        <div className="padding-global">
          <div className="container-large">
            <div className="steps-heading">
              <div className="text-style-allcaps text-size-small">The Process</div>
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) => updateSteps({ title: newTitle })}
                className="heading-style-h2"
                editingId="steps-title"
              />
            </div>
            <div className="steps-list">
              {items.map((step, index) => (
                <div
                  key={step.id}
                  className={`step-item relative cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666] ${
                    openModalId === step.id
                      ? "border-[#0170D6] bg-[#0170D666]"
                      : ""
                  }`}
                  onClick={() => setOpenModalId(step?.id ?? null)}
                >
                  <div className="step-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                  <EditableImage
                    isModalOpen={openModalId === step.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (step?.id ?? null) : null)
                    }
                    editingId={`steps-${step.id}`}
                    itemType="steps"
                    items={items || []}
                    currentItemId={step?.id ?? null}
                    onUpdateItem={updateStepTopic}
                    onReorderItems={reorderStepTopics}
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
