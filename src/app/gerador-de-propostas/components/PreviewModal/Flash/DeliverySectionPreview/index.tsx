import type { CompleteProjectData } from "#/app/project/types/project";

interface DeliverySectionPreviewProps {
  data?: CompleteProjectData;
}

export default function DeliverySectionPreview({
  data,
}: DeliverySectionPreviewProps) {
  return (
    <>
      {!data?.hideIncludedServicesSection &&
        data?.includedServices &&
        data.includedServices.length > 0 && (
          <div className="w-[90%] p-6 text-white flex flex-col lg:flex-row lg:mx-auto">
            <p className="lg:w-2/5 w-[100px] font-semibold text-lg text-white h-[162px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end justify-start pl-4 lg:pl-8 mb-8">
              Entrega
            </p>
            <div className="border-l-[0.5px] border-l-[#A0A0A0] flex flex-col justify-center items-center pl-4 lg:pl-8">
              {data.includedServices.map((service) => (
                <div
                  key={service?.id}
                  className="max-w-[450px] flex flex-col justify-center py-10"
                >
                  <h2 className="text-sm text-[#CBDED4] mb-3">
                    {service?.title}
                  </h2>
                  <p className="text-[#CBDED4] text-xs">
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
