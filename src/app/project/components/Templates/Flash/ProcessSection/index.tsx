import type { CompleteProjectData } from "#/app/project/types/project";

interface ProcessSectionProps {
  data?: CompleteProjectData;
}

export default function ProcessSection({ data }: ProcessSectionProps) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-red-500">
        <h1>{data?.processSubtitle}</h1>
      </div>
    </div>
  );
}
