import type { CompleteProjectData } from "#/app/project/types/project";

interface FinalMessageSectionProps {
  data?: CompleteProjectData;
}

export default function FinalMessageSection({
  data,
}: FinalMessageSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>FinalMessageSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.endMessageTitle}</h1>
      </div>
    </div>
  );
}
