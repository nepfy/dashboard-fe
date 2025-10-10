interface FlashInvestmentProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
}

export default function FlashInvestment({
  id,
  projectId,
  hideSection,
  title,
}: FlashInvestmentProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
        </div>
      )}
    </div>
  );
}
