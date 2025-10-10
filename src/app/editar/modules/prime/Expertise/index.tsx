interface PrimeExpertiseProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  topics: Array<{
    id: string;
    expertiseId: string;
    title: string;
    description: string;
    hideTitleField: boolean;
    hideDescription: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeExpertise({
  id,
  projectId,
  hideSection,
  title,
  topics,
}: PrimeExpertiseProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {topics?.map((topic) => (
            <div key={topic.id}>
              {!topic.hideTitleField && (
                <>
                  <h1>{topic.title}</h1>
                </>
              )}
              {!topic.hideDescription && (
                <>
                  <h1>{topic.description}</h1>
                </>
              )}
              <h1>{topic.sortOrder}</h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
