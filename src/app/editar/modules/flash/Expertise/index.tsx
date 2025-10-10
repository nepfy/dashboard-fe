interface FlashExpertiseProps {
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

export default function FlashExpertise({
  id,
  projectId,
  hideSection,
  title,
  topics,
}: FlashExpertiseProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {topics?.map((topic) => (
            <div key={topic.id}>
              <h1>{topic.title}</h1>
              <h1>{topic.description}</h1>
              <h1>{topic.hideTitleField.toString()}</h1>
              <h1>{topic.hideDescription.toString()}</h1>
              <h1>{topic.sortOrder}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
