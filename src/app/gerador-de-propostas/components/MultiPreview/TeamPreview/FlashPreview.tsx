import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TeamSection.css";
import type {
  CompleteProjectData,
  ProjectTeamMember,
} from "#/app/project/types/project";

interface TeamSectionProps {
  data?: CompleteProjectData;
}

interface CustomArrowProps {
  onClick?: () => void;
}

function CustomArrowLeft(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="w-40 h-40 absolute left-20 top-1/2 -translate-y-1/2 text-black -z-10 bg-white-neutral-light-100 rounded-full flex items-center justify-center p-6 cursor-pointer"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      <ArrowLeft size={42} />
    </button>
  );
}

function CustomArrowRight(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="w-12 h-12 absolute right-0 top-1/2 -translate-y-1/2 text-black -z-10 bg-white-neutral-light-100 rounded-full flex items-center justify-center p-2 cursor-pointer"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      <ArrowRight size={18} />
    </button>
  );
}

export default function TeamSection({ data }: TeamSectionProps) {
  const sliderRef = useRef<Slider>(null);

  const teamMembers = data?.teamMembers || [];
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedTeamMembers.length;

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000,
    speed: 3000,
    slidesToShow: Math.min(3, memberCount),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrowRight />,
    prevArrow: <CustomArrowLeft />,
  };

  const renderMember = (member: ProjectTeamMember, index: number) => (
    <div
      key={member?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform opacity-0 animate-fade-in mr-3"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="relative w-full aspect-[670/735] overflow-hidden">
        {member?.photo && (
          <div className="relative w-full h-full">
            <Image
              src={member.photo || ""}
              alt={member.name || ""}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              quality={95}
              priority={index < 3}
            />
          </div>
        )}
      </div>
      <div className="mt-4 text-white">
        <h3 className="text-[10px] font-semibold text-[#DFD5E1]">
          {member?.name}
        </h3>
        <p className="text-[10px] font-medium text-[#A0A0A0]">{member?.role}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (memberCount === 0) {
      return <div className="w-full flex justify-center" />;
    }

    if (memberCount === 1) {
      return (
        <div className="w-full flex justify-start pb-6">
          <div className="max-w-[370px] h-[435px] w-full">
            {sortedTeamMembers[0] && renderMember(sortedTeamMembers[0], 0)}
          </div>
        </div>
      );
    }

    if (memberCount === 3) {
      return (
        <div className="w-full grid grid-cols-3 pb-6">
          {sortedTeamMembers.map((member, index) =>
            renderMember(member, index)
          )}
        </div>
      );
    }

    return (
      <div className="w-full team-slider pb-6">
        <Slider ref={sliderRef} {...sliderSettings} className="relative">
          {sortedTeamMembers.map((member, index) => (
            <div key={member?.id || index}>{renderMember(member, index)}</div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      {!data?.hideAboutYourTeamSection && (
        <div
          className="w-full px-6"
          style={{
            background: `linear-gradient(200deg, #000000 0%, #000000 27.11%, #000000 50.59%, ${data?.mainColor} 75.36%)`,
          }}
        >
          {data?.ourTeamSubtitle && (
            <div className="w-full flex items-center justify-center min-h-[200px] max-h-[400px]">
              <h2 className="min-h-[200px] max-h-[400px] border-l border-l-[#A0A0A0] pl-6 text-white max-w-[390px] lg:text-[41px] flex leading-4xl font-light pt-20">
                {data?.ourTeamSubtitle}
              </h2>
            </div>
          )}

          {memberCount > 0 && (
            <div className="flex items-center gap-2 mt-24 mb-4">
              <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
              <p className="text-white text-sm font-semibold">Time</p>
            </div>
          )}

          {renderContent()}
        </div>
      )}
    </>
  );
}
