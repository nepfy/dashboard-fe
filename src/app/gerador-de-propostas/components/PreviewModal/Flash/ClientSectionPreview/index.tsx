import type { CompleteProjectData } from "#/app/project/types/project";
import Image from "next/image";

interface ClientSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function ClientSectionPreview({
  data,
}: ClientSectionPreviewProps) {
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
          <div className="flex items-center justify-center space-x-8">
            {visibleClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-center border border-white rounded-full w-[240px] h-[140px] lg:w-[300px] lg:h-[174px] px-24"
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
        </div>
      )}
    </>
  );
}
