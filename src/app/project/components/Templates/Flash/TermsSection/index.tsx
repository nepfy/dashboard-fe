import type { CompleteProjectData } from "#/app/project/types/project";

interface TermsSectionProps {
  data?: CompleteProjectData;
}

export default function TermsSection({ data }: TermsSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>TermsSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.termsConditions.map((term) => term.description)}</h1>
      </div>
    </div>
  );
}
