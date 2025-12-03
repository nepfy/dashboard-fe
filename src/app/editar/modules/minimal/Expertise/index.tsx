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
  subtitle,
  hideSubtitle,
  topics,
  hideSection,
}: MinimalExpertiseProps) {
  const {
    updateExpertise,
    updateExpertiseTopic,
    reorderExpertiseTopics,
  } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

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
          background-color: #f8f8f8;
          color: #040404;
          padding-top: 0;
          padding-bottom: 0;
        }

        .padding-global {
          padding-left: 2rem;
          padding-right: 2rem;
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
          gap: 4rem;
          margin-bottom: 8rem;
          padding-top: 4rem;
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
          color: #040404;
          margin: 0.75rem 0 0;
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.25;
          max-width: 48ch;
        }

        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 1.5rem;
          grid-row-gap: 1.5rem;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
        }

        .expertise-card {
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
          background-color: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 0.5rem;
          padding: 2.5rem 2rem;
          transition: all 0.2s ease;
        }

        .expertise-card:hover {
          border-color: #d0d0d0;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        .expertise-icon_wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          width: 3rem;
          height: 3rem;
          background: #f8f8f8;
          border-radius: 0.5rem;
        }

        .expertise-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .text-weight-medium {
          font-weight: 500;
        }

        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.35;
          margin-bottom: 0.625rem;
          font-weight: 500;
          color: #040404;
        }

        .expertise-paragraph {
          opacity: 0.7;
          max-width: 100%;
        }

        .text-size-regular {
          font-size: 0.9375rem;
          line-height: 1.5;
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
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 1.25rem;
            grid-row-gap: 1.25rem;
          }
          
          .expertise-card {
            padding: 2rem 1.5rem;
          }
        }

        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .expertise-component {
            margin-bottom: 4rem;
          }
          .expertise-grid {
            grid-template-columns: 1fr;
            grid-column-gap: 1rem;
            grid-row-gap: 1rem;
          }
          .expertise-card {
            width: 100%;
            padding: 2rem 1.5rem;
          }
          .expertise-icon_wrapper {
            width: 2.5rem;
            height: 2.5rem;
          }
          .expertise-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      `}</style>

      <section id="expertise" className="section_expertise">
        <div className="padding-global">
          <div className="container-large">
            <div className="expertise-component">
              <div className="expertise-heading">
                {!hideSubtitle && (
                  <EditableText
                    value={subtitle || "TRANSFORME IDEIA EM RESULTADO"}
                    onChange={(newSubtitle: string) =>
                      updateExpertise({ subtitle: newSubtitle })
                    }
                    className="text-style-allcaps text-size-small"
                    editingId="expertise-subtitle"
                  />
                )}
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
                    className={`expertise-card relative cursor-pointer ${
                      openModalId === topic.id
                        ? "border-[#0170D6] bg-[#0170D666]"
                        : "hover:border-[#0170D6] hover:bg-[#0170D666]"
                    }`}
                    onClick={() => setOpenModalId(topic?.id ?? null)}
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
