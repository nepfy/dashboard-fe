import Image from "next/image";
import type {
  CompleteProjectData,
  ProjectTeamMember,
} from "#/app/project/types/project";

interface TeamSectionProps {
  data?: CompleteProjectData;
}

export default function TeamSection({ data }: TeamSectionProps) {
  const teamMembers = data?.teamMembers || [];
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedTeamMembers.length;

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
      <div
        className="w-full grid gap-6 pb-10"
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
          className="w-full min-h-full px-6 flex flex-col justify-center"
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
