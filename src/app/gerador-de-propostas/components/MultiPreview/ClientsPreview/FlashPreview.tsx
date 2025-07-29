import Marquee from "react-fast-marquee";
import type { CompleteProjectData } from "#/app/project/types/project";
import Image from "next/image";

interface ClientsPreviewProps {
  data: CompleteProjectData;
}

export default function ClientsPreview({ data }: ClientsPreviewProps) {
  return (
    <>
      {!data?.hideClientsSection && (
        <div className="bg-black w-full h-[500px]">
          <div className="py-8 border-t-[0.5px] border-t-[#A0A0A0] mt-10" />
          <Marquee speed={100} gradientWidth={0}>
            {data?.clients?.map((client) => (
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
                  <p className="text-white opacity-50 font-bold text-3xl">
                    {client.name}
                  </p>
                ) : null}
              </div>
            ))}
          </Marquee>
        </div>
      )}
    </>
  );
}
