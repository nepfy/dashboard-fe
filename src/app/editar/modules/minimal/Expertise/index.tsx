"use client";

import { useState } from "react";
import { ExpertiseSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalExpertiseProps extends ExpertiseSection {
  mainColor?: string;
}

export default function MinimalExpertise({
  title,
  topics,
  hideSection,
  mainColor = "#000000",
}: MinimalExpertiseProps) {
  const {
    updateExpertise,
    updateExpertiseTopic,
    reorderExpertiseTopics,
    activeEditingId,
  } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  if (hideSection || !topics || topics.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_expertise {
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
        
        .expertise-heading {
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
        
        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .expertise-card {
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          cursor: pointer;
          transition: all .3s;
        }
        
        .expertise-card:hover {
          border-color: rgba(255, 255, 255, .3);
          background: rgba(255, 255, 255, .02);
        }
        
        .expertise-icon_wrapper {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, .05);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .expertise-icon {
          width: 24px;
          height: 24px;
        }
        
        .text-weight-medium {
          font-weight: 500;
        }
        
        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        
        .expertise-paragraph {
          margin-top: 0.75rem;
        }
        
        .text-size-regular {
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
        
        .section_expertise:hover .edit-button {
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
          .section_expertise {
            padding: 5rem 0;
          }
          .expertise-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section id="expertise" className="section_expertise">
        <div className="padding-global">
          <div className="container-large">
            <div className="expertise-heading">
              <div className="text-style-allcaps text-size-small">What Lives Here</div>
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) =>
                  updateExpertise({ title: newTitle })
                }
                className="heading-style-h2"
                editingId="expertise-title"
              />
            </div>
            <div className="expertise-grid">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`expertise-card relative ${
                    openModalId === topic.id
                      ? "cursor-default border-[#0170D6] bg-[#0170D666]"
                      : canEdit
                        ? "cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666]"
                        : "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (canEdit || openModalId === topic.id) {
                      setOpenModalId(topic?.id ?? null);
                    }
                  }}
                >
                  <div className="expertise-icon_wrapper">
                    {topic.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={topic.icon} alt="" className="expertise-icon" />
                    )}
                  </div>
                  <div className="text-size-medium text-weight-medium">
                    {topic.title}
                  </div>
                  <div className="expertise-paragraph">
                    <div className="text-size-regular">{topic.description}</div>
                  </div>
                  <EditableImage
                    isModalOpen={openModalId === topic.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (topic?.id ?? null) : null)
                    }
                    editingId={`expertise-${topic.id}`}
                    itemType="expertise"
                    items={topics || []}
                    currentItemId={topic?.id ?? null}
                    onUpdateItem={updateExpertiseTopic}
                    onReorderItems={reorderExpertiseTopics}
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
