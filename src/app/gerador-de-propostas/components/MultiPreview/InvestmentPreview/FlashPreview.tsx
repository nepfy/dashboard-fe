import type { CompleteProjectData } from "#/app/project/types/project";

interface InvestmentPreviewProps {
  data?: CompleteProjectData;
}

export default function InvestmentPreview({ data }: InvestmentPreviewProps) {
  return (
    <>
      {!data?.hideInvestmentSection && (
        <div
          className="w-full min-h-[500px] flex items-center justify-center p-6"
          style={{
            background: `linear-gradient(345deg, #000000 0%, #000000 10%, #000000 55%, ${data?.mainColor} 90%)`,
          }}
        >
          <h1 className="text-white-neutral-light-100 font-normal text-[41px] leading-[1.1] mb-8 max-w-[630px]">
            <span className="font-medium">Investimento. </span>
            {data?.investmentTitle}
          </h1>
        </div>
      )}
    </>
  );
}
