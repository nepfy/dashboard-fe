import type { CompleteProjectData } from "#/app/project/types/project";
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

interface ExpertiseSectionProps {
  data?: CompleteProjectData;
}

export default function ExpertiseSection({ data }: ExpertiseSectionProps) {
  const expertise = data?.expertise || [];
  const sortedExpertise = [...expertise].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });

  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };
  return (
    <>
      {!data?.hideExpertiseSection && (
        <>
          <div
            id="expertise"
            className="w-full flex flex-col justify-start items-start mt-90 px-6"
          >
            <div className="w-full max-w-[1240px] mx-auto">
              <div className="flex justify-center items-start mb-8 max-w-[600px] lg:max-w-[824px]">
                <div className="h-[450px] md:h-[400px] lg:h-[600px] flex items-center">
                  <div className="border-l-[0.5px] border-l-[#A0A0A0] pl-4 lg:pl-15 h-full" />
                </div>
                <p className="font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-white-neutral-light-100">
                  <span className="opacity-50">Nossa especialização. </span>
                  {data?.expertiseSubtitle}
                </p>
              </div>
            </div>

            <div className="w-full flex justify-center items-center px-4 lg:px-0">
              <div className="w-full max-w-[1100px] flex flex-wrap justify-start items-start gap-20 lg:mt-44">
                {sortedExpertise.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row justify-start items-start mb-6 w-full max-w-[250px] xl:max-w-[280px]"
                  >
                    <div className="flex flex-col items-start justify-start">
                      {(item.icon || !item.hideExpertiseIcon) && (
                        <div className="text-white mb-2">
                          {typeof item.icon === "string"
                            ? renderIcon(item.icon)
                            : item.icon}
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-base text-[#DFD5E1]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
