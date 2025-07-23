import type { CompleteProjectData } from "#/app/project/types/project";

interface InvestmentSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function InvestmentSectionPreview({
  data,
}: InvestmentSectionPreviewProps) {
  return (
    <>
      {!data?.hideInvestmentSection && data?.investmentTitle && (
        <div className="w-full p-6 lg:w-[90%] lg:mx-auto py-30 lg:py-60">
          <p className="font-medium text-4xl lg:text-7xl leading-3xl lg:leading-8xl text-[#DFD5E1] max-w-[1200px]">
            <span className="text-[#A0A0A0] lg:font-bold">Investimento. </span>
            {data.investmentTitle}
          </p>
        </div>
      )}
    </>
  );
}
