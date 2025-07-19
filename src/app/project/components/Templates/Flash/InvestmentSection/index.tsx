import type { CompleteProjectData } from "#/app/project/types/project";

interface InvestmentSectionProps {
  data?: CompleteProjectData;
}

export default function InvestmentSection({ data }: InvestmentSectionProps) {
  return (
    <div className="w-full h-[1000px]">
      <div className="w-full bg-red-500">
        <h1>InvestmentSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.investmentTitle}</h1>
      </div>
    </div>
  );
}
