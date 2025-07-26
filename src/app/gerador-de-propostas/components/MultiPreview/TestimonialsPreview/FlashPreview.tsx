import type { CompleteProjectData } from "#/app/project/types/project";

interface TestimonialsPreviewProps {
  data?: CompleteProjectData;
}

export default function TestimonialsPreview({
  data,
}: TestimonialsPreviewProps) {
  return (
    <div>
      {data?.testimonials?.map((testimonial) => (
        <div key={testimonial.id}></div>
      ))}
    </div>
  );
}
