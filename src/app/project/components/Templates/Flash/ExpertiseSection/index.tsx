import type { CompleteProjectData } from "#/app/project/types/project";

interface ExpertiseSectionProps {
  data?: CompleteProjectData;
}

export default function ExpertiseSection({ data }: ExpertiseSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>ExpertiseSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.expertise.map((expertise) => expertise.description)}</h1>
      </div>
    </div>
  );
}
