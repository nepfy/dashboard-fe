import {
  CompleteProjectData,
  ProjectProcessStep,
} from "#/app/project/types/project";

interface ProcessListSectionProps {
  data?: CompleteProjectData;
}

export default function ProcessListSection({ data }: ProcessListSectionProps) {
  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <h1>
            {data?.processSteps?.map(
              (process: ProjectProcessStep) => process.description
            )}
          </h1>
        </div>
      </div>
    </div>
  );
}
