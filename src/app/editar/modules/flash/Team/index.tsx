import Image from "next/image";

interface FlashTeamProps {
  hideSection: boolean;
  title: string;
  members: Array<{
    id: string;
    teamSectionId: string;
    name: string;
    role: string;
    photo: string | null;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

const teamMembers = [
  {
    id: "1",
    name: "Luan Varela",
    role: "Diretor de Criação",
    hidePhoto: false,
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 1,
  },
  {
    id: "2",
    name: "Isadora Luz",
    hidePhoto: false,
    role: "Head de Design Estratégico",
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 2,
  },
  {
    id: "3",
    name: "Adriano Mota",
    role: "Designer",
    hidePhoto: false,
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 3,
  },
  {
    id: "4",
    name: "João Victor",
    hidePhoto: false,
    role: "Desenvolvedor",
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 4,
  },
  {
    id: "5",
    name: "Gabriel Nunes",
    role: "Atendimento",
    hidePhoto: false,
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 5,
  },
  {
    id: "6",
    name: "Daniel Nunes",
    role: "Suporte ao Cliente",
    hidePhoto: false,
    photo: "/images/templates/flash/placeholder.png",
    sortOrder: 6,
  },
];

export default function FlashTeam({
  hideSection,
  title,
  members,
}: FlashTeamProps) {
  console.log(members);
  const visibleMembers = (members || teamMembers).filter(
    (member) => !member.hidePhoto && member.photo
  );
  const memberCount = visibleMembers.length;

  const getPhotoDimensions = () => {
    // Desktop/Tablet dimensions
    const desktopDimensions = {
      2: { width: 500, height: 410 },
      3: { width: 430, height: 340 },
      4: { width: 500, height: 410 },
      5: { width: 430, height: 340 },
      6: { width: 430, height: 340 },
    }[memberCount] || { width: 430, height: 340 }; // default

    return {
      desktop: desktopDimensions,
      mobile: { width: 300, height: 435 },
    };
  };

  const dimensions = getPhotoDimensions();
  return (
    <div className="bg-black relative pb-10 lg:pb-70 overflow-hidden">
      {!hideSection && (
        <div className="pt-31 max-w-[1440px] mx-auto relative z-10">
          {teamMembers?.length > 1 && (
            <div className="px-6 lg:px-12 xl:px-40">
              <p className="text-[32px] lg:text-[72px] text-[#E6E6E6] max-w-[1050px] pb-21">
                {title ||
                  "Especialistas em design estratégico para área da saúde"}
              </p>
            </div>
          )}
          <div className="px-6 lg:px-12 xl:px-8">
            {teamMembers?.length > 1 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
                <p className="text-white text-sm font-semibold">Time</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-between max-w-[1500px] mx-auto gap-3">
              {teamMembers?.length < 2 && (
                <p className="text-[18px] xl:text-[72px] text-[#E6E6E6] max-w-[688px]">
                  {title ||
                    "Especialistas em design estratégico para área da saúde"}
                </p>
              )}
              {(members || teamMembers)?.map((member) => (
                <div
                  key={member.id}
                  className={`flex flex-col items-start ${
                    teamMembers?.length > 2 ? "mb-20" : ""
                  }`}
                >
                  {!member.hidePhoto && member?.photo && (
                    <div
                      className="relative overflow-hidden rounded-[4px]"
                      style={{
                        width: `${dimensions.mobile.width}px`,
                        height: `${dimensions.mobile.height}px`,
                      }}
                    >
                      <style jsx>{`
                        @media (min-width: 640px) {
                          div {
                            width: ${dimensions.desktop.width}px !important;
                            height: ${dimensions.desktop.height}px !important;
                          }
                        }
                      `}</style>
                      <div className="relative w-full h-full">
                        <Image
                          src={member.photo || ""}
                          alt={member.name || ""}
                          fill
                          className="object-cover"
                          style={{ aspectRatio: "auto" }}
                          quality={95}
                          priority={member.sortOrder < 3}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-lg font-semibold text-[#E6E6E6] mt-3 p-0">
                    {member.name}
                  </p>
                  <p className="font-medium text-[#A0A0A0] text-lg">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div
        className="hidden lg:block"
        style={{
          width: "100%",
          height: 1100,
          background:
            "linear-gradient(180deg, rgba(15, 15, 15, 0) 0%, #200D42 27.11%, #4F21A1 50.59%, #C085FD 85.36%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      />
      <div
        className="hidden lg:block"
        style={{
          width: "180%",
          height: "80%",
          background:
            "radial-gradient(51.38% 51.38% at 50% 50%, #000000 82.2%, #9560EB 100%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: "-50%",
          left: "-150%",
          transform: "translateX(50%)",
          right: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      />
      <div
        className="lg:hidden"
        style={{
          width: "180%",
          height: "80%",
          background:
            "linear-gradient(180deg, rgba(15, 15, 15, 0) 0%, #200D42 27.11%, #4F21A1 50.59%, #C085FD 85.36%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: "-50%",
          left: "-150%",
          transform: "translateX(50%)",
          right: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
