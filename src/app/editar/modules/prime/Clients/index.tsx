interface PrimeClientsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  list: Array<{
    id: string;
    clientsSectionId: string;
    logo: string | null;
    hideLogo: boolean;
    name: string;
    hideClientName: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeClients({
  id,
  projectId,
  hideSection,
  list,
}: PrimeClientsProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{hideSection.toString()}</h1>
          {list?.map((item) => (
            <div key={item.id}>
              {!item.hideLogo && (
                <>
                  <h1>{item.logo}</h1>
                </>
              )}
              {!item.hideClientName && (
                <>
                  <h1>{item.name}</h1>
                </>
              )}
              <h1>{item.sortOrder}</h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
