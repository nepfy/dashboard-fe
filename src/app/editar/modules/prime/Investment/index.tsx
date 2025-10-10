interface PrimeInvestmentProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
}

export default function PrimeInvestment({
  id,
  projectId,
  hideSection,
  title,
}: PrimeInvestmentProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
        </>
      )}
    </div>
  );
}
