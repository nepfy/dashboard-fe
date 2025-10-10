interface PrimeTestimonialsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  list: Array<{
    id: string;
    testimonialsSectionId: string;
    testimonial: string;
    name: string;
    role: string | null;
    photo: string | null;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeTestimonials({
  id,
  projectId,
  hideSection,
  list,
}: PrimeTestimonialsProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          {list?.map((item) => (
            <div key={item.id}>
              <h1>{item.testimonial}</h1>
              <h1>{item.name}</h1>
              <h1>{item.role}</h1>
              {!item.hidePhoto && (
                <>
                  <h1>{item.photo}</h1>
                </>
              )}
              <h1>{item.sortOrder}</h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
