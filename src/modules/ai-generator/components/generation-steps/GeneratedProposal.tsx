export function GeneratedProposal({
  generatedProposal,
  setCurrentStep,
}: {
  generatedProposal: any;
  setCurrentStep: (step: string) => void;
}) {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50 justify-center items-center gap-10">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-purple-600 mb-2">
              Proposta Gerada com Sucesso!
            </h1>
            <p className="text-gray-600 text-lg">
              Sua proposta foi criada usando IA especializada.
            </p>
          </div>

          {generatedProposal && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {generatedProposal.finalProposal.title}
                </h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {generatedProposal.finalProposal.content}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Investimento
                  </h4>
                  <div className="text-blue-700">
                    {generatedProposal.finalProposal.pricing}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Cronograma
                  </h4>
                  <div className="text-green-700">
                    {generatedProposal.finalProposal.timeline}
                  </div>
                </div>
              </div>

              {generatedProposal.finalProposal.terms && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Termos e Condições
                  </h4>
                  <div className="text-yellow-700">
                    {generatedProposal.finalProposal.terms}
                  </div>
                </div>
              )}

              {generatedProposal.finalProposal.faq && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">FAQ</h4>
                  <div className="text-purple-700">
                    {generatedProposal.finalProposal.faq}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentStep("start")}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              Nova Proposta
            </button>
            <button
              onClick={() => {
                // Here you could save to the project generator or export
                console.log("Save proposal:", generatedProposal);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              Salvar Proposta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
