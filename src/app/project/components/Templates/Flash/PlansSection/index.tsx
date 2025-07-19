import type { CompleteProjectData } from "#/app/project/types/project";

interface PlansSectionProps {
  data?: CompleteProjectData;
}

export default function PlansSection({ data }: PlansSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>PlansSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.plans.map((plan) => plan.description)}</h1>
      </div>
    </div>
  );
}
