import type { CompleteProjectData } from "#/app/project/types/project";

interface DeliverySectionProps {
  data?: CompleteProjectData;
}

export default function DeliverySectionPreview({ data }: DeliverySectionProps) {
  return (
    <>
      {!data?.hideIncludedServicesSection && (
        <div className="w-full max-w-[1200px] p-6 flex bg-black pl-16">
          <p className="w-1/4 2xl:w-1/3 font-semibold text-[10px] text-white-neutral-light-100 h-[120px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end justify-start pl-4 mb-8">
            Entregas
          </p>
          <div className="border-l-[0.5px] border-l-[#A0A0A0] flex flex-col justify-center items-center pl-6">
            {data?.includedServices
              ?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              ?.map((service) => (
                <div
                  key={service?.id}
                  className="max-w-[250px] flex flex-col justify-center py-10"
                >
                  <h2 className="text-sm text-white-neutral-light-100 mb-3">
                    {service?.title}
                  </h2>
                  <p className="text-white-neutral-light-100 text-[10px]">
                    {service?.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
