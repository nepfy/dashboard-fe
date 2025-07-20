import type { CompleteProjectData } from "#/app/project/types/project";
import Image from "next/image";

interface ClientsSectionProps {
  data?: CompleteProjectData;
}

export default function ClientsSection({ data }: ClientsSectionProps) {
  const sortedClients =
    data?.clients?.sort((a, b) => {
      if (a.sortOrder === null && b.sortOrder === null) return 0;
      if (a.sortOrder === null) return 1;
      if (b.sortOrder === null) return -1;
      return a.sortOrder - b.sortOrder;
    }) || [];

  const visibleClients = sortedClients
    .filter((client) => client.logo && !client.hideLogo)
    .map((client) => ({
      ...client,
      logo: client.logo!,
    }));

  return (
    <>
      {!data?.hideClientsSection && visibleClients.length > 0 && (
        <div className="w-full overflow-hidden py-8 border-t-[0.5px] border-t-[#A0A0A0] mt-60">
          {visibleClients.length >= 3 ? (
            <div className="relative my-20">
              <div className="flex animate-scroll">
                <div className="flex items-center gap-4 mx-2">
                  {visibleClients.map((client) => (
                    <div
                      key={`first-${client.id}`}
                      className="flex-shrink-0 flex items-center justify-center border border-white rounded-full w-[240px] h-[140px] lg:w-[300px] lg:h-[174px]"
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={120}
                        height={80}
                        className="object-contain max-h-36 max-w-24"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mx-2">
                  {visibleClients.map((client) => (
                    <div
                      key={`second-${client.id}`}
                      className="flex-shrink-0 flex items-center justify-center border border-white rounded-full w-[240px] h-[140px] lg:w-[300px] lg:h-[174px]"
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={120}
                        height={80}
                        className="object-contain max-h-36 max-w-24"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mx-2">
                  {visibleClients.map((client) => (
                    <div
                      key={`second-${client.id}`}
                      className="flex-shrink-0 flex items-center justify-center border border-white rounded-full w-[240px] h-[140px] lg:w-[300px] lg:h-[174px]"
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={120}
                        height={80}
                        className="object-contain max-h-36 max-w-24"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mx-2">
                  {visibleClients.map((client) => (
                    <div
                      key={`second-${client.id}`}
                      className="flex-shrink-0 flex items-center justify-center border border-white rounded-full w-[240px] h-[140px] lg:w-[300px] lg:h-[174px]"
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={140}
                        height={30}
                        className="object-contain max-h-36 max-w-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-8">
              {visibleClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={80}
                    className="object-contain max-h-16 max-w-32"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
