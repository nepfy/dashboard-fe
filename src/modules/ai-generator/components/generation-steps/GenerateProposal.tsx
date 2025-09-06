import { useState } from "react";

export function GenerateProposal({
  isGenerating,
  generatedProposal,
}: {
  isGenerating: boolean;
  generatedProposal: Record<string, unknown> | null | undefined;
}) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  console.log("Debug - Generated Proposal:", { generatedProposal });
  console.log(
    "Debug - Final Proposal:",
    (generatedProposal as Record<string, unknown>)?.finalProposal
  );

  const safeString = (value: unknown, defaultValue = ""): string => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value.toString();
    return String(value);
  };

  if (isGenerating) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Gerando sua proposta...
          </h2>
          <p className="text-gray-600">
            Nossa IA está criando uma proposta personalizada para você
          </p>
        </div>
      </div>
    );
  }

  if (!generatedProposal) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Nenhuma proposta gerada
          </h2>
          <p className="text-gray-600">Volte e gere uma proposta primeiro</p>
        </div>
      </div>
    );
  }

  const getSectionData = (sectionName: string) => {
    if (!generatedProposal || typeof generatedProposal !== "object")
      return null;

    const finalProposal = (generatedProposal as Record<string, unknown>)
      .finalProposal;
    if (finalProposal && typeof finalProposal === "object") {
      const data = (finalProposal as Record<string, unknown>)[sectionName];
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return data;
    }

    const data = (generatedProposal as Record<string, unknown>)[sectionName];
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return data;
    return null;
  };

  const introduction = getSectionData("introduction");
  const aboutUs = getSectionData("aboutUs");
  const specialties = getSectionData("specialties");
  const steps = getSectionData("steps");
  const investment = getSectionData("investment");
  const plans = getSectionData("plans");
  const terms = getSectionData("terms");
  const faq = getSectionData("faq");

  return (
    <div className="min-h-[calc(100vh-100px)] p-6">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Proposta Gerada com IA
          </h1>
          <p className="text-gray-600">
            Sua proposta foi criada com sucesso! Revise o conteúdo abaixo.
          </p>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Visualização
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "raw"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dados Brutos
          </button>
        </div>

        {activeTab === "preview" ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            {introduction && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {safeString(
                    (introduction as Record<string, unknown>).title,
                    "Introdução"
                  )}
                </h2>
                {Boolean(
                  (introduction as Record<string, unknown>).subtitle
                ) && (
                  <p className="text-gray-600 mb-3">
                    {safeString(
                      (introduction as Record<string, unknown>).subtitle
                    )}
                  </p>
                )}
                {Boolean((introduction as Record<string, unknown>).services) &&
                  Array.isArray(
                    (introduction as Record<string, unknown>).services
                  ) && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        (introduction as Record<string, unknown>)
                          .services as unknown[]
                      ).map((service: unknown, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {safeString(service)}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {Boolean(aboutUs) && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {safeString(
                    (aboutUs as Record<string, unknown>).title,
                    "Sobre Nós"
                  )}
                </h2>
                {Boolean((aboutUs as Record<string, unknown>).subtitle) && (
                  <p className="text-gray-600">
                    {safeString((aboutUs as Record<string, unknown>).subtitle)}
                  </p>
                )}
              </div>
            )}

            {Boolean(specialties) &&
              (specialties as Record<string, React.ReactNode>).topics &&
              Array.isArray(
                (specialties as Record<string, unknown>).topics
              ) && (
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {safeString(
                      (specialties as Record<string, unknown>).title,
                      "Especialidades"
                    )}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      (specialties as Record<string, unknown>)
                        .topics as unknown[]
                    ).map((topic: unknown, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {safeString((topic as Record<string, unknown>).title)}
                        </h3>
                        {Boolean(
                          (topic as Record<string, unknown>).description
                        ) && (
                          <p className="text-sm text-gray-600">
                            {safeString(
                              (topic as Record<string, unknown>).description
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {steps &&
              (steps as Record<string, React.ReactNode>).topics &&
              Array.isArray((steps as Record<string, unknown>).topics) && (
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {safeString(
                      (steps as Record<string, unknown>).title,
                      "Processo"
                    )}
                  </h2>
                  <div className="space-y-3">
                    {(
                      (steps as Record<string, unknown>).topics as unknown[]
                    ).map((step: unknown, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {safeString(
                              (step as Record<string, unknown>).title
                            )}
                          </h3>
                          {Boolean(
                            (step as Record<string, unknown>).description
                          ) && (
                            <p className="text-sm text-gray-600">
                              {safeString(
                                (step as Record<string, unknown>).description
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {investment && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {safeString(
                    (investment as Record<string, unknown>).title,
                    "Investimento"
                  )}
                </h2>
                {plans && Array.isArray(plans) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(plans as unknown[]).map(
                      (plan: unknown, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg border"
                        >
                          <h3 className="font-medium text-gray-800 mb-2">
                            {safeString(
                              (plan as Record<string, unknown>).title
                            )}
                          </h3>
                          {Boolean(
                            (plan as Record<string, unknown>).description
                          ) && (
                            <p className="text-sm text-gray-600 mb-2">
                              {safeString(
                                (plan as Record<string, unknown>).description
                              )}
                            </p>
                          )}
                          {Boolean((plan as Record<string, unknown>).value) && (
                            <p className="text-lg font-bold text-blue-600">
                              {safeString(
                                (plan as Record<string, unknown>).value
                              )}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {terms && Array.isArray(terms) && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Termos e Condições
                </h2>
                <div className="space-y-3">
                  {(terms as unknown[]).map((term: unknown, index: number) => (
                    <div key={index}>
                      {Boolean((term as Record<string, unknown>).title) && (
                        <h3 className="font-medium text-gray-800 mb-1">
                          {safeString((term as Record<string, unknown>).title)}
                        </h3>
                      )}
                      <p className="text-sm text-gray-600">
                        {safeString(
                          (term as Record<string, unknown>).description
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {faq && Array.isArray(faq) && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-3">
                  {(faq as unknown[]).map((item: unknown, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-1">
                        {safeString((item as Record<string, unknown>).question)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {safeString((item as Record<string, unknown>).answer)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Dados da Proposta (JSON)
            </h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-hidden break-words whitespace-pre-wrap">
              {JSON.stringify(generatedProposal, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
