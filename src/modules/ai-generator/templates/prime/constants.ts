export const PRIME_SERVICE_TYPES = {
  ARCHITECT: "Prime - Arquiteto",
  DEVELOPER: "Prime - Desenvolvedor",
  DESIGNER: "Prime - Designer",
  PHOTOGRAPHER: "Prime - Fotógrafo",
  MARKETING: "Prime - Marketing Digital",
  AGENCIES: "Prime - Agências / Consultoria",
} as const;

export type PrimeServiceType =
  (typeof PRIME_SERVICE_TYPES)[keyof typeof PRIME_SERVICE_TYPES];

export const PRIME_SERVICE_DESCRIPTIONS = {
  [PRIME_SERVICE_TYPES.ARCHITECT]:
    "Projetos arquitetônicos premium com atenção aos detalhes e qualidade excepcional",
  [PRIME_SERVICE_TYPES.DEVELOPER]:
    "Desenvolvimento de software premium com arquitetura robusta e escalabilidade",
  [PRIME_SERVICE_TYPES.DESIGNER]:
    "Design criativo e estratégico com foco em experiências visuais memoráveis",
  [PRIME_SERVICE_TYPES.PHOTOGRAPHER]:
    "Fotografia profissional premium com direção artística e qualidade superior",
  [PRIME_SERVICE_TYPES.MARKETING]:
    "Marketing digital estratégico com foco em crescimento sustentável e ROI",
  [PRIME_SERVICE_TYPES.AGENCIES]:
    "Consultoria sênior que integra estratégia, criatividade e tecnologia para gerar crescimento previsível",
} as const;

export const PRIME_SERVICE_ICONS = {
  [PRIME_SERVICE_TYPES.ARCHITECT]: "🏗️",
  [PRIME_SERVICE_TYPES.DEVELOPER]: "💻",
  [PRIME_SERVICE_TYPES.DESIGNER]: "🎨",
  [PRIME_SERVICE_TYPES.PHOTOGRAPHER]: "📸",
  [PRIME_SERVICE_TYPES.MARKETING]: "📈",
  [PRIME_SERVICE_TYPES.AGENCIES]: "🤝",
} as const;
