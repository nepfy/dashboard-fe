import Image from "next/image";
import type {
  CompleteProjectData,
  ProjectTeamMember,
} from "#/app/project/types/project";

interface TeamSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function TeamSectionPreview({ data }: TeamSectionPreviewProps) {
  const teamList = data?.teamMembers || [];
  const sortedTeamList = [...teamList].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedTeamList.length;

  const renderMember = (member: ProjectTeamMember, index: number) => (
    <div
      key={member?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform"
    >
      <div className="relative w-full aspect-[453/321] overflow-hidden">
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
                background:
                  "radial-gradient(80.39% 90.37% at 54.56% 1.78%, rgba(0, 0, 0, 0) 20%, #000000 120%)",
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-4 lg:ml-10 text-white">
        <h3 className="text-lg font-medium">{member?.name}</h3>
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
            {sortedTeamList[0] && renderMember(sortedTeamList[0], 0)}
          </div>
        </div>
      );
    }

    if (memberCount === 2) {
      return (
        <div className="w-full grid grid-cols-2 gap-6">
          {sortedTeamList.map((member, index) => renderMember(member, index))}
        </div>
      );
    }

    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeamList.map((member, index) => (
          <div key={member?.id || index}>{renderMember(member, index)}</div>
        ))}
      </div>
    );
  };

  return (
    <>
      {!data?.hideAboutYourTeamSection && memberCount > 0 && (
        <div className="w-full pt-50 px-6 mb-50 lg:mb-0">
          <div className="w-full flex items-center justify-center mb-50">
            <h2 className="h-[162px] lg:h-[360px] border-l border-l-[#A0A0A0] pl-10 text-white text-3xl lg:text-7xl max-w-[690px] flex items-end">
              {data?.ourTeamSubtitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
            <p className="text-white text-sm font-semibold">Time</p>
          </div>

          {renderContent()}
        </div>
      )}
    </>
  );
}
