import type { CompleteProjectData } from "#/app/project/types/project";

interface ClientsSectionProps {
  data?: CompleteProjectData;
}

export default function ClientsSection({ data }: ClientsSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>ClientsSection</h1>
      </div>

      <div className="w-full bg-green-500">
        <h1>{data?.clients.map((client) => client.name)}</h1>
      </div>
    </div>
  );
}
