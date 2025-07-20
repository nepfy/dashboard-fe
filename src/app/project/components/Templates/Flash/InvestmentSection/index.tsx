import type { CompleteProjectData } from "#/app/project/types/project";

interface InvestmentSectionProps {
  data?: CompleteProjectData;
}

export default function InvestmentSection({ data }: InvestmentSectionProps) {
  return (
    <>
      {!data?.hideInvestmentSection && (
        <div className="w-full p-6 lg:w-[90%] lg:mx-auto py-30 lg:py-60">
          <p className="font-medium text-4xl lg:text-7xl leading-3xl lg:leading-7xl text-[#DFD5E1]">
            <span className="text-[#A0A0A0] lg:font-bold">Investimento. </span>
            {data?.investmentTitle}
          </p>
        </div>
      )}
    </>
  );
}
