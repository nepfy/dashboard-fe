import AccessForm from "#/app/gerador-de-propostas/components/MultiStep/AccessForm";

export function GenerateProposal({
  isGenerating,
  generatedProposal,
}: {
  isGenerating: boolean;
  generatedProposal: Record<string, unknown> | null | undefined;
  setCurrentStep: (step: string) => void;
}) {
  console.log({ generatedProposal });

  if (isGenerating) {
    return <div>Gerando proposta...</div>;
  }

  if (!generatedProposal) {
    return <div>Nenhuma proposta gerada</div>;
  }

  if (generatedProposal) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center relative">
        <AccessForm />
      </div>
    );
  }
}
