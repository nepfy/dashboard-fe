import type { CompleteProjectData } from "#/app/project/types/project";

interface TestimonialsSectionProps {
  data?: CompleteProjectData;
}

export default function TestimonialsSection({
  data,
}: TestimonialsSectionProps) {
  return (
    <div className="w-full h-[1000px]">
      <div className="w-full bg-red-500">
        <h1>TestimonialsSection</h1>
      </div>
      <div className="w-full bg-green-500">
        <h1>
          {data?.testimonials.map((testimonial) => testimonial.testimonial)}
        </h1>
      </div>
    </div>
  );
}
