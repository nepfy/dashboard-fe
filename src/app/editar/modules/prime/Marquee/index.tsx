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
    <>
      <style jsx>{`
        .marquee_component {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .marquee_content {
          display: flex;
          align-items: center;
          gap: 15vw;
          width: 100%;
        }

        .marquee_item {
          flex: none;
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }

        .marquee_text {
          white-space: nowrap;
          font-size: 15vw;
          font-weight: 300;
          line-height: 1.1;
          margin: 0;
        }

        .marquee_text.text-weight-medium {
          font-weight: 500;
        }
      `}</style>

      <div className="marquee_component">
        <div className="marquee_content">
          {marquee
            .filter((item) => !item.hideService)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <div key={item.id} className="marquee_item">
                <h1 className="marquee_text">{item.serviceName}</h1>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
