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
    <div className="bg-black overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-0 pt-7 xl:pt-0">
          <div className="flex items-end pt-24 pl-5 lg:pl-10 border-l border-l-[#A0A0A0] max-w-[1100px] mb-16 lg:mb-43 mx-auto">
            <p className="text-[18px] lg:text-[48px] text-[#E6E6E6] h-full">
              <span className="font-bold block sm:inline">
                Nossas Especializações.{" "}
              </span>
              <EditableText
                as="p"
                value={title || ""}
                onChange={(newTitle: string) =>
                  updateExpertise({ title: newTitle })
                }
                className="inline text-[18px] lg:text-[48px] text-[#E6E6E6] h-full"
              />
            </p>
          </div>

          <div className="flex flex-wrap justify-between gap-6 max-w-[1100px] mx-auto pb-32">
            {topics?.map((topic) => (
              <div
                key={topic.id}
                className="w-[260px]  text-white-neutral-light-100 text-[15px]"
              >
                <div className="text-white mb-2">
                  {typeof topic.icon === "string"
                    ? renderIcon(topic.icon)
                    : topic.icon}
                </div>
                {!topic.hideTitleField && (
                  <p className="font-semibold py-3">{topic.title}</p>
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
