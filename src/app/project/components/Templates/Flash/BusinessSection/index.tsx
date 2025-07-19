import type { CompleteProjectData } from "#/app/project/types/project";

interface BusinessSectionProps {
  data?: CompleteProjectData;
}

export default function BusinessSection({ data }: BusinessSectionProps) {
  return (
    <div className="w-full flex flex-col justify-around px-6">
      <div className="flex justify-center items-center mb-8">
        <div className="font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-[#DFD5E1] pl-6 lg:pl-15 max-w-[1100px] h-[415px] lg:h-[360px] border-l lg:border-l-2 border-l-[#A0A0A0] flex items-end">
          <p className="lg:mb-3">
            <span className="text-[#A0A0A0]">Sobre nós. </span>
            {data?.aboutUsTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
