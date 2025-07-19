import type { CompleteProjectData } from "#/app/project/types/project";

interface ResultsSectionProps {
  data?: CompleteProjectData;
}

export default function ResultsSection({ data }: ResultsSectionProps) {
  return (
    <div className="w-full ">
      <div className="w-full bg-red-500">
        <h1>ResultsSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.results.map((result) => result.client)}</h1>
      </div>
    </div>
  );
}
