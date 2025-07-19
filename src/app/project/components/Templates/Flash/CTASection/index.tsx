import type { CompleteProjectData } from "#/app/project/types/project";

interface CTASectionProps {
  data?: CompleteProjectData;
}

export default function CTASection({ data }: CTASectionProps) {
  return (
    <div className="w-full h-[1000px]">
      <div className="w-full bg-red-500">
        <h1>CTASection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.ctaBackgroundImage}</h1>
      </div>
    </div>
  );
}
