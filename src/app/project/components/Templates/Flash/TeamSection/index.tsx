import Image from "next/image";
import { useState, useEffect } from "react";
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

export default function TeamSection({ data }: TeamSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleMembers, setVisibleMembers] = useState(2);

  const teamMembers = data?.teamMembers || [];
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedTeamMembers.length;

  useEffect(() => {
    const checkViewport = () => {
      const isMobileView = window.innerWidth < 640;
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
          </div>
        )}
      </div>
      <div className="mt-4 text-white">
        <h3 className="text-lg font-semibold">{member?.name}</h3>
        <p className="text-lg font-medium text-white-neutral-light-100 opacity-50 ">
          {member?.role}
        </p>
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
            {sortedTeamMembers[0] && renderMember(sortedTeamMembers[0], 0)}
          </div>
        </div>
      );
    }

    if (isMobile) {
      const visibleTeamMembers = sortedTeamMembers.slice(0, visibleMembers);
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
                className="w-[112px] h-[56px] flex items-center justify-center text-white-neutral-light-100 rounded-full font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-black"
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
          {sortedTeamMembers.map((member, index) =>
            renderMember(member, index)
          )}
        </div>
      );
    }

    return (
      <div
        className="w-full grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${Math.min(memberCount, 3)}, 1fr)`,
        }}
      >
        {sortedTeamMembers.map((member, index) => renderMember(member, index))}
      </div>
    );
  };

  return (
    <>
      {!data?.hideAboutYourTeamSection && (
        <div
          id="team"
          className="w-full max-w-[1440px] mx-auto pt-50 lg:pt-100 px-6 lg:px-6 mb-50 lg:mb-0"
        >
          {data?.ourTeamSubtitle && (
            <div className="w-full flex items-center justify-center mb-50">
              <h2 className="h-[162px] lg:h-[360px] border-l-[0.5px] border-l-white-neutral-light-100 pl-10 text-white opacity-50 text-3xl lg:text-7xl max-w-[690px] flex items-end">
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
