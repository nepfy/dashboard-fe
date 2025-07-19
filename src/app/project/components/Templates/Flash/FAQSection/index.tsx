import type { CompleteProjectData } from "#/app/project/types/project";

interface FAQSectionProps {
  data?: CompleteProjectData;
}

export default function FAQSection({ data }: FAQSectionProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-red-500">
        <h1>FAQSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>{data?.faq.map((faq) => faq.question)}</h1>
      </div>
    </div>
  );
}
