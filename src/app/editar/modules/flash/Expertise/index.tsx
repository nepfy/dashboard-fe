import { useState } from "react";
import { ExpertiseSection } from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
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
  DiamondIcon: <DiamondIcon fill="#ffffff" />,
  CircleIcon: <CircleIcon fill="#ffffff" />,
  BubblesIcon: <BubblesIcon fill="#ffffff" />,
  ClockIcon: <ClockIcon fill="#ffffff" />,
  GearIcon: <GearIcon fill="#ffffff" />,
  HexagonalIcon: <HexagonalIcon fill="#ffffff" />,
  SwitchIcon: <SwitchIcon fill="#ffffff" />,
  ThunderIcon: <ThunderIcon fill="#ffffff" />,
  GlobeIcon: <GlobeIcon fill="#ffffff" />,
  BellIcon: <BellIcon fill="#ffffff" />,
  BulbIcon: <BulbIcon fill="#ffffff" />,
  StarIcon: <StarIcon fill="#ffffff" />,
  HeartIcon: <HeartIcon fill="#ffffff" />,
  AwardIcon: <AwardIcon fill="#ffffff" />,
  CrownIcon: <CrownIcon fill="#ffffff" />,
  KeyIcon: <KeyIcon fill="#ffffff" />,
  EyeIcon: <EyeIcon fill="#ffffff" />,
  FolderIcon: <FolderIcon fill="#ffffff" />,
  PlayIcon: <PlayIcon fill="#ffffff" />,
  CubeIcon: <CubeIcon fill="#ffffff" />,
};

export default function FlashExpertise({
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

  // Get the current hideIcon value from the context to ensure real-time updates
  const hideIcon =
    projectData?.proposalData?.expertise?.hideIcon ?? propHideIcon;
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <div className="relative z-3 bg-black">
      {!hideSection && (
        <div className="mx-auto max-w-[1440px] px-6 pt-0 lg:px-12 xl:px-0 xl:pt-0">
          <div className="mx-auto mb-16 flex max-w-[1100px] items-end border-l border-l-[#ffffff]/50 pt-24 pl-5 lg:mb-43 lg:pl-10">
            <span className="h-full w-full text-[1.5rem] text-[#E6E6E6] lg:text-[48px]">
              <span className="block font-bold sm:inline">
                Nossas Especializações.{" "}
              </span>
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) =>
                  updateExpertise({ title: newTitle })
                }
                className="inline h-full w-full text-[1.5rem] text-[#E6E6E6] lg:text-[48px]"
                editingId="expertise-title"
              />
            </span>
          </div>

          <div className="mx-auto flex max-w-[1100px] flex-wrap justify-start gap-10 pb-32 sm:justify-center lg:justify-start lg:gap-35">
            {topics?.map((topic) => (
              <div
                key={topic.id}
                className="text-white-neutral-light-100 relative w-full cursor-pointer text-[15px] font-light lg:w-[260px]"
                onClick={() => setOpenModalId(topic?.id ?? null)}
              >
                <div className="mb-2 text-white">
                  {!hideIcon &&
                    (typeof topic.icon === "string"
                      ? renderIcon(topic.icon)
                      : topic.icon)}
                </div>
                {!topic.hideTitleField && (
                  <p className="py-3 font-semibold">{topic.title}</p>
                )}
                {!topic.hideDescription && <p>{topic.description}</p>}

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
                  onUpdateSection={(data) => updateExpertise(data)}
                  hideIcon={hideIcon}
                />
                <div
                  className={`absolute top-0 left-0 z-9 h-full w-full rounded-[4px] border border-transparent hover:border-[#0170D6] hover:bg-[#0170D666] ${openModalId === topic.id ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
