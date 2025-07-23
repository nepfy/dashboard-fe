import Image from "next/image";
import type { CompleteProjectData } from "#/app/project/types/project";

interface TestimonialsSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function TestimonialsSectionPreview({
  data,
}: TestimonialsSectionPreviewProps) {
  const testimonials = data?.testimonials || [];
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });

  if (sortedTestimonials.length === 0) {
    return null;
  }

  return (
    <>
      {!data?.hideTestimonialsSection && sortedTestimonials.length > 0 && (
        <div className="w-full pt-50 lg:pt-100 p-6 mb-50 lg:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
            <p className="text-white text-sm font-semibold">Depoimentos</p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial?.id || index}
                className="flex flex-col transition-all duration-500 ease-in-out transform"
              >
                <div className="relative w-full aspect-[453/321] overflow-hidden">
                  {(testimonial?.photo || !testimonial.hidePhoto) && (
                    <div className="relative w-full h-full">
                      <Image
                        src={testimonial.photo || ""}
                        alt={testimonial.name || ""}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        quality={95}
                        priority={index < 3}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(80.39% 90.37% at 54.56% 1.78%, rgba(0, 0, 0, 0) 20%, #000000 120%)",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 lg:ml-10 text-white">
                  <p className="text-lg font-medium mb-4">
                    &ldquo;{testimonial?.testimonial}&rdquo;
                  </p>
                  <h3 className="text-lg font-medium">{testimonial?.name}</h3>
                  <p className="text-lg font-medium text-[#A0A0A0]">
                    {testimonial?.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
