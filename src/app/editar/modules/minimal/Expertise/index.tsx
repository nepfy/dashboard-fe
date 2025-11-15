"use client";

import { useState } from "react";
import { ExpertiseSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

import DiamondIcon from "./iconsList/DiamondIcon";
import CircleIcon from "./iconsList/CircleIcon";
import BubblesIcon from "./iconsList/BubblesIcon";
import ClockIcon from "./iconsList/ClockIcon";
import GearIcon from "./iconsList/GearIcon";
import HexagonalIcon from "./iconsList/HexagonalIcon";
import SwitchIcon from "./iconsList/SwitchIcon";
import ThunderIcon from "./iconsList/ThunderIcon";
import GlobeIcon from "./iconsList/GlobeIcon";
import BellIcon from "./iconsList/BellIcon";
import BulbIcon from "./iconsList/BulbIcon";
import StarIcon from "./iconsList/StarIcon";
import HeartIcon from "./iconsList/HeartIcon";
import AwardIcon from "./iconsList/AwardIcon";
import CrownIcon from "./iconsList/CrownIcon";
import KeyIcon from "./iconsList/KeyIcon";
import EyeIcon from "./iconsList/EyeIcon";
import FolderIcon from "./iconsList/FolderIcon";
import PlayIcon from "./iconsList/PlayIcon";
import CubeIcon from "./iconsList/CubeIcon";

const iconMap = {
  DiamondIcon: <DiamondIcon fill="#040404" />,
  CircleIcon: <CircleIcon fill="#040404" />,
  BubblesIcon: <BubblesIcon fill="#040404" />,
  ClockIcon: <ClockIcon fill="#040404" />,
  GearIcon: <GearIcon fill="#040404" />,
  HexagonalIcon: <HexagonalIcon fill="#040404" />,
  SwitchIcon: <SwitchIcon fill="#040404" />,
  ThunderIcon: <ThunderIcon fill="#040404" />,
  GlobeIcon: <GlobeIcon fill="#040404" />,
  BellIcon: <BellIcon fill="#040404" />,
  BulbIcon: <BulbIcon fill="#040404" />,
  StarIcon: <StarIcon fill="#040404" />,
  HeartIcon: <HeartIcon fill="#040404" />,
  AwardIcon: <AwardIcon fill="#040404" />,
  CrownIcon: <CrownIcon fill="#040404" />,
  KeyIcon: <KeyIcon fill="#040404" />,
  EyeIcon: <EyeIcon fill="#040404" />,
  FolderIcon: <FolderIcon fill="#040404" />,
  PlayIcon: <PlayIcon fill="#040404" />,
  CubeIcon: <CubeIcon fill="#040404" />,
};

interface MinimalExpertiseProps extends ExpertiseSection {
  mainColor?: string;
}

export default function MinimalExpertise({
  title,
  topics,
  hideSection,
}: MinimalExpertiseProps) {
  const {
    updateExpertise,
    updateExpertiseTopic,
    reorderExpertiseTopics,
    activeEditingId,
  } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;
  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  console.log(topics);

  if (hideSection || !topics || topics.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_expertise {
          position: relative;
          z-index: 3;
          background-color: var(--background-color--background-secondary);
          color: var(--text-color--text-primary);
          margin-top: -0.5rem;
          padding-top: 2rem;
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

        .expertise-component {
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: center;
          grid-column-gap: 7rem;
          grid-row-gap: 7rem;
          margin-bottom: 12rem;
        }

        .expertise-heading {
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          grid-column-gap: 1rem;
          grid-row-gap: 1rem;
          max-width: 100ch;
        }

        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
        }

        .text-size-small {
          font-size: 0.875rem;
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
          grid-template-columns: 1fr 1fr 1fr;
          grid-column-gap: 1rem;
          grid-row-gap: 1rem;
          width: 100%;
          margin-bottom: 3rem;
        }

        .expertise-card {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
          background-color: #fff;
          border: 1px solid #d1d1d1;
          padding: 5rem 2.5rem;
        }

        .expertise-icon_wrapper {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          padding: 2rem;
        }

        .expertise-icon {
          width: 1.3rem;
        }

        .text-weight-medium {
          font-weight: 500;
        }

        .text-size-medium {
          font-size: 1.25rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .expertise-paragraph {
          opacity: 0.7;
          max-width: 37ch;
        }

        .text-size-regular {
          font-size: 1rem;
          line-height: 1.6;
          color: #040404;
        }

        .edit-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          opacity: 0;
          transition:
            opacity 0.2s,
            background 0.2s;
          z-index: 100;
        }

        .section_expertise:hover .edit-button {
          opacity: 1;
        }

        .edit-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media screen and (max-width: 991px) {
          .expertise-component {
            grid-column-gap: 4rem;
            grid-row-gap: 4rem;
            margin-bottom: 6rem;
          }

          .expertise-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .expertise-component {
            margin-bottom: 4rem;
          }
          .expertise-card {
            width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>

      <section id="expertise" className="section_expertise">
        <div className="padding-global">
          <div className="container-large">
            <div className="expertise-component">
              <div className="expertise-heading">
                <div className="text-style-allcaps text-size-small">
                  Transforme ideia em resultado
                </div>
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
                      {renderIcon(topic.icon || "")}
                    </div>
                    <div className="text-size-medium text-weight-medium">
                      {topic.title}
                    </div>
                    <div className="expertise-paragraph">
                      <div className="text-size-regular">
                        {topic.description}
                      </div>
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
        </div>
      </section>
    </>
  );
}
