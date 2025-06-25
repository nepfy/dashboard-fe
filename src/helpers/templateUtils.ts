export interface TemplateConfig {
  name: string;
  displayName: string;
  description: string;
  gradientType: "radial" | "linear";
  colorStops: {
    position: number;
    colorModification: "darken" | "lighten" | "original";
    intensity: number;
  }[];
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  flash: {
    name: "flash",
    displayName: "Flash",
    description: "Design vibrante e energético",
    gradientType: "radial",
    colorStops: [
      { position: 0, colorModification: "darken", intensity: 80 },
      { position: 34.22, colorModification: "darken", intensity: 60 },
      { position: 64.9, colorModification: "original", intensity: 0 },
      { position: 81.78, colorModification: "lighten", intensity: 30 },
    ],
  },
  prime: {
    name: "prime",
    displayName: "Prime",
    description: "Design sofisticado e corporativo",
    gradientType: "linear",
    colorStops: [
      { position: 0, colorModification: "darken", intensity: 40 },
      { position: 50, colorModification: "original", intensity: 0 },
      { position: 100, colorModification: "lighten", intensity: 20 },
    ],
  },
  essencial: {
    name: "essencial",
    displayName: "Essencial",
    description: "Design minimalista e elegante",
    gradientType: "linear",
    colorStops: [
      { position: 0, colorModification: "lighten", intensity: 40 },
      { position: 70, colorModification: "original", intensity: 0 },
      { position: 100, colorModification: "darken", intensity: 20 },
    ],
  },
  grid: {
    name: "grid",
    displayName: "Grid",
    description: "Design limpo e funcional",
    gradientType: "linear",
    colorStops: [
      { position: 0, colorModification: "darken", intensity: 30 },
      { position: 40, colorModification: "original", intensity: 0 },
      { position: 100, colorModification: "lighten", intensity: 10 },
    ],
  },
};

export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = (100 - percent) / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const lightenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const modifyColor = (
  hex: string,
  modification: "darken" | "lighten" | "original",
  intensity: number
): string => {
  switch (modification) {
    case "darken":
      return darkenColor(hex, intensity);
    case "lighten":
      return lightenColor(hex, intensity);
    case "original":
    default:
      return hex;
  }
};

export const generateTemplateGradient = (
  templateType: string,
  mainColor: string
): string => {
  const config = TEMPLATE_CONFIGS[templateType?.toLowerCase()];

  if (!config) {
    // Fallback para o template Flash se não encontrar
    return generateTemplateGradient("flash", mainColor);
  }

  const colorStops = config.colorStops
    .map((stop) => {
      const color = modifyColor(
        mainColor,
        stop.colorModification,
        stop.intensity
      );
      return `${color} ${stop.position}%`;
    })
    .join(", ");

  if (config.gradientType === "radial") {
    return `radial-gradient(104.7% 303.34% at 7.84% 26.05%, ${colorStops})`;
  } else {
    return `linear-gradient(135deg, ${colorStops})`;
  }
};

export const getTemplateInfo = (
  templateType: string
): TemplateConfig | null => {
  return TEMPLATE_CONFIGS[templateType?.toLowerCase()] || null;
};

export const getTemplateDisplayName = (templateType: string): string => {
  const config = getTemplateInfo(templateType);
  return config?.displayName || templateType || "Template";
};

export const generateTemplateColors = (
  templateType: string,
  mainColor: string
) => {
  const config = getTemplateInfo(templateType);

  if (!config) {
    return {
      primary: mainColor,
      secondary: lightenColor(mainColor, 20),
      accent: darkenColor(mainColor, 30),
      background: lightenColor(mainColor, 50),
    };
  }

  return {
    primary: mainColor,
    secondary: modifyColor(mainColor, "lighten", 20),
    accent: modifyColor(mainColor, "darken", 30),
    background: modifyColor(mainColor, "lighten", 50),
    text: darkenColor(mainColor, 70),
    textLight: lightenColor(mainColor, 40),
  };
};
