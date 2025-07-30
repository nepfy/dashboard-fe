import type { CompleteProjectData } from "#/app/project/types/project";

interface DeliverySectionProps {
  data?: CompleteProjectData;
}

export default function DeliverySection({ data }: DeliverySectionProps) {
  return (
    <div id="deliveries">
      {!data?.hideIncludedServicesSection && (
        <div className="w-[90%] p-3 text-white flex flex-col lg:flex-row lg:mx-auto">
          <p className="w-[100px] font-semibold text-lg text-[#DFD5E1] h-[162px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end justify-start pl-4 lg:pl-8 mb-8 xl:mr-60">
            Entrega
          </p>
          <div className="border-l-[0.5px] border-l-[#A0A0A0] flex flex-col justify-center lg:items-center pl-4 lg:pl-8">
            {data?.includedServices?.map((service) => (
              <div
                key={service?.id}
                className="max-w-[450px] flex flex-col justify-center py-10"
              >
                <h2 className="text-[20px] font-bold text-white-neutral-light-100 mb-3">
                  {service?.title}
                </h2>
                <p className="text-white-neutral-light-100 text-base">
                  {service?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
