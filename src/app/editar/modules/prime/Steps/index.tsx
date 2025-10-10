interface PrimeStepsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  hideTitle: boolean;
  topics: Array<{
    id: string;
    stepsId: string;
    stepName: string;
    stepDescription: string;
    hideStepName: boolean;
    hideStepDescription: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeSteps({
  id,
  projectId,
  hideSection,
  title,
  hideTitle,
  topics,
}: PrimeStepsProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {!hideTitle && (
            <>
              <h1>{title}</h1>
            </>
          )}
          {topics?.map((topic) => (
            <div key={topic.id}>
              {!topic.hideStepName && (
                <>
                  <h1>{topic.stepName}</h1>
                </>
              )}
              {!topic.hideStepDescription && (
                <>
                  <h1>{topic.stepDescription}</h1>
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
