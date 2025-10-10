interface PrimeTermsAndConditionsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  list: Array<{
    id: string;
    termsSectionId: string;
    title: string;
    description: string;
    hideTitleField: boolean;
    hideDescription: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeTermsAndConditions({
  id,
  projectId,
  hideSection,
  title,
  list,
}: PrimeTermsAndConditionsProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {list?.map((item) => (
            <div key={item.id}>
              {!item.hideTitleField && (
                <>
                  <h1>{item.title}</h1>
                </>
              )}
              {!item.hideDescription && (
                <>
                  <h1>{item.description}</h1>
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
