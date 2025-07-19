import type { CompleteProjectData } from "#/app/project/types/project";

interface BusinessSectionPropsComplement {
  data?: CompleteProjectData;
}

export default function BusinessSectionComplement({
  data,
}: BusinessSectionPropsComplement) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-6">
      <div className="px-6 h-[600px] flex flex-col lg:flex-row justify-between items-start mb-6">
        <p className="max-w-[200px] text-white-neutral-light-100 lg:font-semibold lg:text-sm mb-12 lg:mb-0 mr-0 sm:mr-6 lg:mr-0">
          {data?.aboutUsSubtitle1}
        </p>
        <div className="h-[400px] border-l border-l-[#A0A0A0] pl-6 flex items-end">
          <p className="max-w-[750px] text-white-neutral-light-100 font-medium text-lg">
            {data?.aboutUsSubtitle2}
          </p>
        </div>
      </div>
    </div>
  );
}
