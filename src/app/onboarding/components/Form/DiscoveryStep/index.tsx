import StepHeader from "#/app/onboarding/components/StepHeader";
import SelectionGridContext from "#/app/onboarding/components/SelectionGrid";

const DiscoveryStep = () => {
  const discoveryOptions = [
    {
      id: "fornecedor-de-tecnologia",
      label: "Fornecedor de tecnologia",
    },
    {
      id: "noticias",
      label: "Notícias",
    },
    {
      id: "anuncios",
      label: "Anúncios",
    },
    {
      id: "eventos",
      label: "Eventos",
    },
    {
      id: "instagram",
      label: "Instagram",
    },
    {
      id: "outras-redes-sociais",
      label: "Outras redes sociais",
    },
    {
      id: "X",
      label: "X (Antigo Twitter)",
    },
    {
      id: "outro",
      label: "Outro...",
    },
  ];

  return (
    <div>
      <StepHeader
        title="Como você descobriu a Nepfy?"
        description="Escolha as alternativas que se aplicam a você."
      />

      <SelectionGridContext
        options={discoveryOptions}
        fieldName="discoverySource"
        isMultiSelect={true}
      />
    </div>
  );
};

export default DiscoveryStep;
