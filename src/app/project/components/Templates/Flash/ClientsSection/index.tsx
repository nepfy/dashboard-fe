import Marquee from "react-fast-marquee";
import Image from "next/image";
import type { CompleteProjectData } from "#/app/project/types/project";

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
      {!data?.hideClientsSection && (
        <div id="clients" className="bg-black w-full h-[500px] pb-34">
          <div className="py-8 border-t-1 border-t-[#A0A0A0] mt-10 mb-34" />
          <Marquee speed={100} gradientWidth={0} autoFill>
            {visibleClients?.map((client) => (
              <div
                className="flex items-center justify-center border border-white rounded-full w-[300px] h-[174px] px-24 mr-8"
                key={client.id}
              >
                {client?.logo && !client?.name && !client?.hideLogo ? (
                  <>
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={120}
                      height={80}
                      className="object-contain max-h-36 max-w-24"
                    />
                  </>
                ) : null}

                {client?.name && !client?.logo && !client?.hideClientName ? (
                  <p className="text-white font-bold text-3xl">{client.name}</p>
                ) : null}
              </div>
            ))}
          </Marquee>
        </div>
      )}
    </>
  );
}
