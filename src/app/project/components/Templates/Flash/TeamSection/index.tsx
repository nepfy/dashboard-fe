import Image from "next/image";
import { useRef, useState, useEffect } from "react";
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
      className="w-40 h-40 absolute right-20 top-1/2 -translate-y-1/2 text-black z-40 bg-white-neutral-light-100 rounded-full flex items-center justify-center p-6 cursor-pointer"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      <ArrowRight size={42} />
    </button>
  );
}

export default function TeamSection({ data }: TeamSectionProps) {
  const sliderRef = useRef<Slider>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleMembers, setVisibleMembers] = useState(2);

  const teamMembers = data?.teamMembers || [];
  const memberCount = teamMembers.length;

  useEffect(() => {
    const checkViewport = () => {
      const isMobileView = window.innerWidth < 1280;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setVisibleMembers(2);
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const handleShowMore = () => {
    setVisibleMembers((prev) => Math.min(prev + 2, memberCount));
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: Math.min(3, memberCount),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrowRight />,
    prevArrow: <CustomArrowLeft />,
  };

  const renderMember = (member: ProjectTeamMember, index: number) => (
    <div
      key={member?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform opacity-0 animate-fade-in"
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
            <div
              className="absolute inset-0"
              style={{
                backgroundBlendMode: "screen",
                background:
                  "linear-gradient(135deg, rgba(66, 0, 255, 0) 30%, rgba(66, 0, 255, 0.3) 50%, rgba(97, 0, 255, 0) 80%)",
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-4 text-white">
        <h3 className="text-lg font-semibold">{member?.name}</h3>
        <p className="text-lg font-medium text-[#A0A0A0]">{member?.role}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (memberCount === 0) {
      return <div className="w-full flex justify-center" />;
    }

    if (memberCount === 1) {
      return (
        <div className="w-full flex justify-start">
          <div className="max-w-[670px] w-full">
            {teamMembers[0] && renderMember(teamMembers[0], 0)}
          </div>
        </div>
      );
    }

    if (isMobile) {
      const visibleTeamMembers = teamMembers.slice(0, visibleMembers);
      const hasMoreMembers = visibleMembers < memberCount;

      return (
        <div className="w-full">
          <div className="w-full flex flex-wrap gap-6 justify-center p-0">
            {visibleTeamMembers.map((member, index) => (
              <div key={member?.id || index} className="w-full max-w-[600px]">
                {renderMember(member, index)}
              </div>
            ))}
          </div>

          {hasMoreMembers && (
            <div className="w-full flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="w-[112px] h-[56px] flex items-center justify-center text-white-neutral-light-100 rounded-full font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, ${data?.mainColor} 64.9%, #A46EDB 81.78%)`,
                }}
              >
                Mostrar mais
              </button>
            </div>
          )}
        </div>
      );
    }

    if (memberCount === 2) {
      return (
        <div className="w-full grid grid-cols-2 gap-6">
          {teamMembers.map((member, index) => renderMember(member, index))}
        </div>
      );
    }

    return (
      <div className="w-full team-slider">
        <Slider ref={sliderRef} {...sliderSettings} className="relative">
          {teamMembers.map((member, index) => (
            <div key={member?.id || index} className="px-2">
              {renderMember(member, index)}
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      {!data?.hideAboutUsSection && (
        <div className="w-full bg-black pt-50 lg:pt-100 px-6">
          {data?.ourTeamSubtitle && (
            <div className="w-full flex items-center justify-center mb-50">
              <h2 className="h-[162px] lg:h-[360px] border-l border-l-[#A0A0A0] pl-10 text-white text-3xl lg:text-7xl max-w-[690px] flex items-end">
                {data?.ourTeamSubtitle}
              </h2>
            </div>
          )}

          {memberCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
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
