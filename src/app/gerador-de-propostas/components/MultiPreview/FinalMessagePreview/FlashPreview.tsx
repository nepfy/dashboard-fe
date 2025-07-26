import type { CompleteProjectData } from "#/app/project/types/project";

interface FinalMessagePreviewProps {
  data?: CompleteProjectData;
}

export default function FinalMessagePreview({
  data,
}: FinalMessagePreviewProps) {
  return (
    <div>
      <div className="hidden w-[828px] h-[500px] 2xl:w-[1128px] 2xl:h-[600px] relative items-center justify-center">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 lg:px-0">
          <div className="border-l-[0.5px] border-l-[#A0A0A0] h-[220px] pl-8 flex flex-col items-start justify-center">
            <h1 className="text-[#DFD5E1] font-normal text-5xl max-w-[610px] leading-[1.1] mb-8">
              {data?.endMessageTitle}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
