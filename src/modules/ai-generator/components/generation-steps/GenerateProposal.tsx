import AccessForm from "#/app/gerador-de-propostas/components/MultiStep/AccessForm";

export function GenerateProposal({
  isGenerating,
  generatedProposal,
}: {
  isGenerating: boolean;
  generatedProposal: any;
  setCurrentStep: (step: string) => void;
}) {
  console.log({ generatedProposal });

  if (isGenerating) {
    return <div>Gerando proposta...</div>;
  }

  if (!generatedProposal) {
    return <div>Nenhuma proposta gerada</div>;
  }

  if (generatedProposal.error) {
    return <div>Erro ao gerar proposta: {generatedProposal.error}</div>;
  }

  if (generatedProposal) {
    return (
      <div className="flex min-h-screen items-center justify-center relative">
        <AccessForm />
      </div>
    );
  }
}
