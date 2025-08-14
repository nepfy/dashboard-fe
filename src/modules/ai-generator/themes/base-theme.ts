import { ServiceType, TemplateType } from "../agents/base/types";
import { BaseTemplateData } from "../templates/base/base-template";

export interface BaseThemeData {
  selectedService: ServiceType;
  companyInfo: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  selectedPlans: string[];
  planDetails: string;
  includeTerms: boolean;
  includeFAQ: boolean;
  templateType: TemplateType;
  mainColor?: string;
}

export interface BaseThemeConfig {
  name: string;
  description: string;
  version: string;
  features: string[];
  colorPalette: string[];
  typography: {
    primary: string;
    secondary: string;
    accent: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export const baseThemeConfig: BaseThemeConfig = {
  name: "Base Theme",
  description:
    "Tema base com funcionalidades essenciais para propostas comerciais",
  version: "1.0.0",
  features: [
    "Design responsivo",
    "Paleta de cores personalizável",
    "Tipografia legível",
    "Layout limpo e profissional",
    "Compatibilidade com navegadores",
    "Acessibilidade básica",
  ],
  colorPalette: [
    "#FFFFFF", // White
    "#F8F9FA", // Light Gray
    "#6C757D", // Gray
    "#495057", // Dark Gray
    "#212529", // Black
    "#007BFF", // Blue
    "#28A745", // Green
    "#FFC107", // Yellow
    "#DC3545", // Red
    "#6F42C1", // Purple
  ],
  typography: {
    primary: "Inter, system-ui, sans-serif",
    secondary: "Georgia, serif",
    accent: "Inter, system-ui, sans-serif",
  },
  spacing: {
    small: "0.5rem",
    medium: "1rem",
    large: "2rem",
  },
};

// Common theme utility functions
export function generateThemeCSS(
  config: BaseThemeConfig,
  customColors?: Record<string, string>
): string {
  const colors = { ...config.colorPalette, ...customColors };

  return `
    :root {
      --primary-color: ${colors.primary || colors[5]};
      --secondary-color: ${colors.secondary || colors[6]};
      --accent-color: ${colors.accent || colors[7]};
      --text-color: ${colors.text || colors[3]};
      --background-color: ${colors.background || colors[0]};
      --border-color: ${colors.border || colors[1]};
      
      --font-family-primary: ${config.typography.primary};
      --font-family-secondary: ${config.typography.secondary};
      --font-family-accent: ${config.typography.accent};
      
      --spacing-small: ${config.spacing.small};
      --spacing-medium: ${config.spacing.medium};
      --spacing-large: ${config.spacing.large};
    }
    
    body {
      font-family: var(--font-family-primary);
      color: var(--text-color);
      background-color: var(--background-color);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-medium);
    }
    
    .section {
      margin-bottom: var(--spacing-large);
    }
    
    .button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: var(--spacing-small) var(--spacing-medium);
      border-radius: 4px;
      cursor: pointer;
      font-family: var(--font-family-primary);
      transition: background-color 0.3s ease;
    }
    
    .button:hover {
      background-color: var(--secondary-color);
    }
  `;
}

export function validateThemeData(data: BaseThemeData): boolean {
  return !!(
    data.selectedService &&
    data.companyInfo &&
    data.clientName &&
    data.projectName &&
    data.projectDescription &&
    data.templateType
  );
}

export function getThemeDefaults(): Partial<BaseThemeData> {
  return {
    selectedService: "marketing",
    companyInfo: "",
    clientName: "",
    projectName: "",
    projectDescription: "",
    selectedPlans: [],
    planDetails: "",
    includeTerms: false,
    includeFAQ: false,
    templateType: "flash",
    mainColor: "#007BFF",
  };
}
