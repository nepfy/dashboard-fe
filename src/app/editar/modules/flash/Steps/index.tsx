interface FlashStepsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  topics: Array<{
    id: string;
    stepsId: string;
    stepName: string;
    stepDescription: string;
    hideStepName: boolean;
    hideStepDescription: boolean;
    sortOrder: number;
  }>;
  marquee: Array<{
    id: string;
    stepsId: string;
    stepName: string;
    hideStepName: boolean;
    sortOrder: number;
  }>;
}

export default function FlashSteps({
  id,
  projectId,
  hideSection,
  title,
  topics,
  marquee,
}: FlashStepsProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
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
          {marquee?.map((item) => (
            <div key={item.id}>
              {!item.hideStepName && (
                <>
                  <h1>{item.stepName}</h1>
                </>
              )}
              <h1>{item.sortOrder}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
