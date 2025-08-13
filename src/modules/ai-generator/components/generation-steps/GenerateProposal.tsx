export function GenerateProposal({
  isGenerating,
  generatedProposal,
}: {
  isGenerating: boolean;
  generatedProposal: any;
  setCurrentStep: (step: string) => void;
}) {
  if (isGenerating) {
    return <div>Gerando proposta...</div>;
  }

  return (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full">{JSON.stringify(generatedProposal)}</div>
    </section>
  );
}
