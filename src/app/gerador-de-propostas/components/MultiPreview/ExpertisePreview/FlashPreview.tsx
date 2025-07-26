import type { CompleteProjectData } from "#/app/project/types/project";
import DiamondIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/DiamondIcon";
import CircleIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CircleIcon";
import BubblesIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BubblesIcon";
import ClockIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/ClockIcon";
import GearIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/GearIcon";
import HexagonalIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/HexagonalIcon";
import SwitchIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/SwitchIcon";
import ThunderIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/ThunderIcon";
import GlobeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/GlobeIcon";
import BellIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BellIcon";
import BulbIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/BulbIcon";
import StarIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/StarIcon";
import HeartIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/HeartIcon";
import AwardIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/AwardIcon";
import CrownIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CrownIcon";
import KeyIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/KeyIcon";
import EyeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/EyeIcon";
import FolderIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/FolderIcon";
import PlayIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/PlayIcon";
import CubeIcon from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm/iconsList/CubeIcon";

const iconMap = {
  DiamondIcon: <DiamondIcon fill="#ffffff" width="20" height="20" />,
  CircleIcon: <CircleIcon fill="#ffffff" width="20" height="20" />,
  BubblesIcon: <BubblesIcon fill="#ffffff" width="20" height="20" />,
  ClockIcon: <ClockIcon fill="#ffffff" width="20" height="20" />,
  GearIcon: <GearIcon fill="#ffffff" width="20" height="20" />,
  HexagonalIcon: <HexagonalIcon fill="#ffffff" width="20" height="20" />,
  SwitchIcon: <SwitchIcon fill="#ffffff" width="20" height="20" />,
  ThunderIcon: <ThunderIcon fill="#ffffff" width="20" height="20" />,
  GlobeIcon: <GlobeIcon fill="#ffffff" width="20" height="20" />,
  BellIcon: <BellIcon fill="#ffffff" width="20" height="20" />,
  BulbIcon: <BulbIcon fill="#ffffff" width="20" height="20" />,
  StarIcon: <StarIcon fill="#ffffff" width="20" height="20" />,
  HeartIcon: <HeartIcon fill="#ffffff" width="20" height="20" />,
  AwardIcon: <AwardIcon fill="#ffffff" width="20" height="20" />,
  CrownIcon: <CrownIcon fill="#ffffff" width="20" height="20" />,
  KeyIcon: <KeyIcon fill="#ffffff" width="20" height="20" />,
  EyeIcon: <EyeIcon fill="#ffffff" width="20" height="20" />,
  FolderIcon: <FolderIcon fill="#ffffff" width="20" height="20" />,
  PlayIcon: <PlayIcon fill="#ffffff" width="20" height="20" />,
  CubeIcon: <CubeIcon fill="#ffffff" width="20" height="20" />,
};

interface ExpertiseSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function ExpertiseSectionPreview({
  data,
}: ExpertiseSectionPreviewProps) {
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
      {!data?.hideExpertiseSection && sortedExpertise.length > 0 && (
        <div
          className="w-full lg:max-w-[828px] 2xl:max-w-[1000px] flex flex-col justify-center items-start p-20"
          style={{
            background: `linear-gradient(192deg, ${data?.mainColor} 0%, #000000 27.11%, #000000 50.59%, #000000 85.36%)`,
          }}
        >
          <p className="text-3xl text-[#DFD5E1] min-h-[220px] border-l-[0.5px] border-l-[#A0A0A0] pl-11 min-w-[500px] max-w-[550px] leading-8">
            <span className="text-[#A0A0A0] font-bold">
              Nossa especialização.{" "}
            </span>
            {data?.expertiseSubtitle}
          </p>

          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[800px] flex flex-wrap justify-start items-start gap-4 mt-20">
              {sortedExpertise.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-start items-start mb-20 w-full lg:max-w-[200px] 2xl:max-w-[250px]"
                >
                  <div className="flex flex-col items-start justify-start">
                    {(item.icon || !item.hideExpertiseIcon) && (
                      <div className="text-white mb-2">
                        {typeof item.icon === "string"
                          ? renderIcon(item.icon)
                          : item.icon}
                      </div>
                    )}
                    <h3 className="text-[10px] font-semibold text-[#DFD5E1] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[#DFD5E1]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
