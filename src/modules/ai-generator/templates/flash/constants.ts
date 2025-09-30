export const FLASH_SERVICE_TYPES = {
  ARCHITECT: "Flash - Arquiteto",
  DEVELOPER: "Flash - Desenvolvedor",
  DESIGNER: "Flash - Designer",
  PHOTOGRAPHER: "Flash - Fotógrafo",
  MARKETING: "Flash - Marketing Digital",
  AGENCIES: "Flash - Agências / Consultoria",
} as const;

export type FlashServiceType =
  (typeof FLASH_SERVICE_TYPES)[keyof typeof FLASH_SERVICE_TYPES];

export const FLASH_SERVICE_DESCRIPTIONS = {
  [FLASH_SERVICE_TYPES.ARCHITECT]:
    "Projetos arquitetônicos rápidos e eficientes com qualidade superior",
  [FLASH_SERVICE_TYPES.DEVELOPER]:
    "Desenvolvimento de software ágil com foco em MVP e entrega rápida",
  [FLASH_SERVICE_TYPES.DESIGNER]:
    "Design criativo e impactante com entrega expressa de alta qualidade",
  [FLASH_SERVICE_TYPES.PHOTOGRAPHER]:
    "Fotografia profissional com entrega expressa e qualidade superior",
  [FLASH_SERVICE_TYPES.MARKETING]:
    "Marketing digital com resultados rápidos e ROI imediato",
  [FLASH_SERVICE_TYPES.AGENCIES]:
    "Consultoria integrada que combina marketing, design e tecnologia com foco em resultados consistentes",
} as const;

export const FLASH_SERVICE_ICONS = {
  [FLASH_SERVICE_TYPES.ARCHITECT]: "🏗️",
  [FLASH_SERVICE_TYPES.DEVELOPER]: "💻",
  [FLASH_SERVICE_TYPES.DESIGNER]: "🎨",
  [FLASH_SERVICE_TYPES.PHOTOGRAPHER]: "📸",
  [FLASH_SERVICE_TYPES.MARKETING]: "📈",
  [FLASH_SERVICE_TYPES.AGENCIES]: "🤝",
} as const;
