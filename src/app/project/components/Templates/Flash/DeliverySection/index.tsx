import type { CompleteProjectData } from "#/app/project/types/project";

interface DeliverySectionProps {
  data?: CompleteProjectData;
}

export default function DeliverySection({ data }: DeliverySectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>DeliverySection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.includedServices.map((service) => service.description)}</h1>
      </div>
    </div>
  );
}
