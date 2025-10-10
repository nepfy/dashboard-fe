interface PrimeMarqueeProps {
  marquee: Array<{
    id: string;
    introductionId: string;
    serviceName: string;
    hideService: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeMarquee({ marquee }: PrimeMarqueeProps) {
  return (
    <div>
      {marquee.map((item) => (
        <div key={item.id}>
          {!item.hideService && (
            <>
              <h1>{item.serviceName}</h1>
            </>
          )}
          <h1>{item.sortOrder}</h1>
        </div>
      ))}
    </div>
  );
}
