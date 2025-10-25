import { ExpertiseSection } from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableText from "#/app/editar/components/EditableText";
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
}: ExpertiseSection) {
  const { updateExpertise } = useEditor();
  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <div className="overflow-hidden bg-black">
      {!hideSection && (
        <div className="mx-auto max-w-[1440px] px-6 pt-7 lg:px-12 xl:px-0 xl:pt-0">
          <div className="mx-auto mb-16 flex max-w-[1100px] items-end border-l border-l-[#A0A0A0] pt-24 pl-5 lg:mb-43 lg:pl-10">
            <span className="h-full w-full text-[18px] text-[#E6E6E6] lg:text-[48px]">
              <span className="block font-bold sm:inline">
                Nossas Especializações.{" "}
              </span>
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) =>
                  updateExpertise({ title: newTitle })
                }
                className="inline h-full w-full text-[18px] text-[#E6E6E6] lg:text-[48px]"
              />
            </span>
          </div>

          <div className="mx-auto flex max-w-[1100px] flex-wrap justify-start gap-10 pb-32 sm:justify-center lg:justify-between lg:gap-25">
            {topics?.map((topic) => (
              <div
                key={topic.id}
                className="text-white-neutral-light-100 w-[260px] text-[15px]"
              >
                <div className="mb-2 text-white">
                  {typeof topic.icon === "string"
                    ? renderIcon(topic.icon)
                    : topic.icon}
                </div>
                {!topic.hideTitleField && (
                  <p className="py-3 font-semibold">{topic.title}</p>
                )}
                {!topic.hideDescription && <p>{topic.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
