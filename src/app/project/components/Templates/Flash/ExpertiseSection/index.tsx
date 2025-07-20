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
          <div className="w-full flex flex-col justify-center items-center mt-90 px-6">
            <div className="flex justify-center items-start mb-8 max-w-[600px] lg:max-w-[824px]">
              <div className="h-[620px] md:h-[400px] lg:h-[600px] flex items-center">
                <div className="border-l lg:border-l-2 border-l-[#A0A0A0] pl-6 lg:pl-15 h-[415px] md:h-[300px] lg:h-[360px] pt-10" />
              </div>
              <p className="lg:mb-3 font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-[#DFD5E1]">
                <span className="text-[#A0A0A0]">Nossa especialização. </span>
                {data?.expertiseSubtitle}
              </p>
            </div>

            <div className="w-full max-w-[1100px] flex flex-wrap justify-center items-start gap-20 lg:mt-44">
              {sortedExpertise.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row justify-start items-start mb-6 w-full lg:max-w-[280px]"
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
        </>
      )}
    </>
  );
}
