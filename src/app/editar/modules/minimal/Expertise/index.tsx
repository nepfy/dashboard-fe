import { useState } from "react";
import { ExpertiseSection } from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import DiamondIcon from "../flash/Expertise/iconsList/DiamondIcon";
import CircleIcon from "../flash/Expertise/iconsList/CircleIcon";
import BubblesIcon from "../flash/Expertise/iconsList/BubblesIcon";
import ClockIcon from "../flash/Expertise/iconsList/ClockIcon";
import GearIcon from "../flash/Expertise/iconsList/GearIcon";
import HexagonalIcon from "../flash/Expertise/iconsList/HexagonalIcon";
import SwitchIcon from "../flash/Expertise/iconsList/SwitchIcon";
import ThunderIcon from "../flash/Expertise/iconsList/ThunderIcon";
import GlobeIcon from "../flash/Expertise/iconsList/GlobeIcon";
import BellIcon from "../flash/Expertise/iconsList/BellIcon";
import BulbIcon from "../flash/Expertise/iconsList/BulbIcon";
import StarIcon from "../flash/Expertise/iconsList/StarIcon";
import HeartIcon from "../flash/Expertise/iconsList/HeartIcon";
import AwardIcon from "../flash/Expertise/iconsList/AwardIcon";
import CrownIcon from "../flash/Expertise/iconsList/CrownIcon";
import KeyIcon from "../flash/Expertise/iconsList/KeyIcon";
import EyeIcon from "../flash/Expertise/iconsList/EyeIcon";
import FolderIcon from "../flash/Expertise/iconsList/FolderIcon";
import PlayIcon from "../flash/Expertise/iconsList/PlayIcon";
import CubeIcon from "../flash/Expertise/iconsList/CubeIcon";

const iconMap = {
  DiamondIcon: <DiamondIcon fill="#121212" />,
  CircleIcon: <CircleIcon fill="#121212" />,
  BubblesIcon: <BubblesIcon fill="#121212" />,
  ClockIcon: <ClockIcon fill="#121212" />,
  GearIcon: <GearIcon fill="#121212" />,
  HexagonalIcon: <HexagonalIcon fill="#121212" />,
  SwitchIcon: <SwitchIcon fill="#121212" />,
  ThunderIcon: <ThunderIcon fill="#121212" />,
  GlobeIcon: <GlobeIcon fill="#121212" />,
  BellIcon: <BellIcon fill="#121212" />,
  BulbIcon: <BulbIcon fill="#121212" />,
  StarIcon: <StarIcon fill="#121212" />,
  HeartIcon: <HeartIcon fill="#121212" />,
  AwardIcon: <AwardIcon fill="#121212" />,
  CrownIcon: <CrownIcon fill="#121212" />,
  KeyIcon: <KeyIcon fill="#121212" />,
  EyeIcon: <EyeIcon fill="#121212" />,
  FolderIcon: <FolderIcon fill="#121212" />,
  PlayIcon: <PlayIcon fill="#121212" />,
  CubeIcon: <CubeIcon fill="#121212" />,
};

export default function MinimalExpertise({
  hideSection,
  title,
  topics,
  hideIcon: propHideIcon = false,
}: ExpertiseSection) {
  const {
    updateExpertise,
    updateExpertiseTopic,
    reorderExpertiseTopics,
    projectData,
  } = useEditor();

  const hideIcon =
    projectData?.proposalData?.expertise?.hideIcon ?? propHideIcon;
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <section className="section_expertise">
      {!hideSection && (
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="expertise-component">
              <div className="expertise-heading">
                <div className="text-style-allcaps text-size-small">
                  What Lives Here
                </div>
                <h1 className="heading-style-h2 text-weight-normal">
                  <EditableText
                    value={title || ""}
                    onChange={(newTitle: string) =>
                      updateExpertise({ title: newTitle })
                    }
                    className="heading-style-h2 text-weight-normal"
                  />
                </h1>
              </div>

              <div className="w-layout-grid expertise-grid">
                {topics?.map((topic) => (
                  <div
                    key={topic.id}
                    className="relative cursor-pointer expertise-card"
                    onClick={() => setOpenModalId(topic?.id ?? null)}
                  >
                    {!hideIcon && (
                      <div className="expertise-icon_wrapper">
                        {typeof topic.icon === "string"
                          ? renderIcon(topic.icon)
                          : topic.icon}
                      </div>
                    )}
                    {!topic.hideTitleField && (
                      <div className="text-size-medium text-weight-medium">
                        {topic.title}
                      </div>
                    )}
                    {!topic.hideDescription && (
                      <div className="expertise-paragraph">
                        <div className="text-size-regular">{topic.description}</div>
                      </div>
                    )}

                    <EditableImage
                      isModalOpen={openModalId === topic.id}
                      setIsModalOpen={(isOpen) =>
                        setOpenModalId(isOpen ? (topic?.id ?? null) : null)
                      }
                      itemType="expertise"
                      items={topics || []}
                      currentItemId={topic?.id ?? null}
                      onUpdateItem={updateExpertiseTopic}
                      onReorderItems={reorderExpertiseTopics}
                      onUpdateSection={(data) => updateExpertise(data)}
                      hideIcon={hideIcon}
                    />
                    <div
                      className={`absolute top-0 left-0 z-10 h-full w-full rounded-[4px] border border-transparent hover:border-[#0170D6] hover:bg-[#0170D666] ${openModalId === topic.id ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

