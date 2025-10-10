interface PrimeDelivererablesProps {
  id: string;
  projectId: string;
  title: string;
  list: Array<{
    id: string;
    deliverablesSectionId: string;
    deliveryName: string;
    deliveryContent: string;
    hideDeliveryName: boolean;
    hideDeliveryContent: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeDelivererables({
  id,
  projectId,
  title,
  list,
}: PrimeDelivererablesProps) {
  return (
    <div>
      <>
        <h1>{id}</h1>
        <h1>{projectId}</h1>
        <h1>{title}</h1>
        {list?.map((item) => (
          <div key={item.id}>
            <h1>{item.deliveryName}</h1>
            <h1>{item.deliveryContent}</h1>
            <h1>{item.hideDeliveryName.toString()}</h1>
            <h1>{item.hideDeliveryContent.toString()}</h1>
            <h1>{item.sortOrder}</h1>
          </div>
        ))}
      </>
    </div>
  );
}
