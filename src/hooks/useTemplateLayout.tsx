import React, { JSX } from "react";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { generateTemplateColors } from "#/helpers/templateUtils";

export interface LayoutConfig {
  containerClass: string;
  cardClass: string;
  titleClass: string;
  textClass: string;
  buttonClass: string;
  spacing: "compact" | "normal" | "spacious";
  borderRadius: "sharp" | "rounded" | "pill";
  shadow: "none" | "subtle" | "strong";
}

export const TEMPLATE_LAYOUTS: Record<string, LayoutConfig> = {
  flash: {
    containerClass: "space-y-8",
    cardClass:
      "bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8",
    titleClass: "text-4xl font-bold text-white drop-shadow-xl",
    textClass: "text-white/90 text-lg leading-relaxed",
    buttonClass:
      "bg-white text-gray-900 hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300",
    spacing: "spacious",
    borderRadius: "rounded",
    shadow: "strong",
  },
  prime: {
    containerClass: "space-y-6",
    cardClass:
      "bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg p-6",
    titleClass: "text-3xl font-semibold text-white drop-shadow-lg",
    textClass: "text-white/85 text-base leading-relaxed",
    buttonClass:
      "bg-white text-gray-800 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200",
    spacing: "normal",
    borderRadius: "rounded",
    shadow: "subtle",
  },
  essencial: {
    containerClass: "space-y-4",
    cardClass:
      "bg-white/10 backdrop-blur-sm border border-white/15 rounded-md p-4",
    titleClass: "text-2xl font-medium text-white drop-shadow-md",
    textClass: "text-white/80 text-sm leading-normal",
    buttonClass:
      "bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium shadow-md transition-all duration-150",
    spacing: "compact",
    borderRadius: "sharp",
    shadow: "subtle",
  },
  grid: {
    containerClass: "grid gap-6",
    cardClass:
      "bg-white/12 backdrop-blur-md border border-white/25 rounded-xl p-6",
    titleClass: "text-3xl font-bold text-white drop-shadow-lg",
    textClass: "text-white/90 text-base leading-normal",
    buttonClass:
      "bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200",
    spacing: "normal",
    borderRadius: "rounded",
    shadow: "subtle",
  },
};

export const useTemplateLayout = () => {
  const { templateType, formData } = useProjectGenerator();
  const mainColor = formData?.step1?.mainColor || "#4F21A1";

  const layout = TEMPLATE_LAYOUTS[templateType?.toLowerCase() || "flash"];
  const colors = generateTemplateColors(templateType || "flash", mainColor);

  const getButtonStyle = (
    variant: "primary" | "secondary" | "outline" = "primary"
  ) => {
    const baseStyle = {
      transition: "all 0.2s ease-in-out",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "white",
          color: colors.text,
          borderColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          color: "white",
          borderColor: colors.secondary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: "white",
          borderColor: "white",
          borderWidth: "2px",
        };
      default:
        return baseStyle;
    }
  };

  const getCardStyle = (opacity: number = 0.15) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: "blur(12px)",
    border: `1px solid rgba(255, 255, 255, ${opacity + 0.1})`,
  });

  const getAccentStyle = () => ({
    backgroundColor: mainColor,
    boxShadow: `0 0 20px ${mainColor}40`,
  });

  return {
    layout,
    colors,
    mainColor,
    templateType,
    getButtonStyle,
    getCardStyle,
    getAccentStyle,
  };
};

// Componente de card genérico que se adapta ao template
export const TemplateCard = ({
  children,
  className = "",
  opacity = 0.15,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  style?: React.CSSProperties;
}) => {
  const { layout, getCardStyle } = useTemplateLayout();

  return (
    <div
      className={`${layout.cardClass} ${className}`}
      style={{ ...getCardStyle(opacity), ...style }}
    >
      {children}
    </div>
  );
};

// Componente de botão que se adapta ao template
export const TemplateButton = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { layout, getButtonStyle } = useTemplateLayout();

  return (
    <button
      className={`${layout.buttonClass} ${className}`}
      style={getButtonStyle(variant)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente de título que se adapta ao template
export const TemplateTitle = ({
  children,
  level = 1,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { layout } = useTemplateLayout();

  // Mapear o level para o elemento HTML correto
  const Element = React.createElement(
    `h${level}` as keyof JSX.IntrinsicElements,
    {
      className: `${layout.titleClass} ${className}`,
      style,
    },
    children
  );

  return Element;
};

// Componente de texto que se adapta ao template
export const TemplateText = ({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { layout } = useTemplateLayout();

  return (
    <p className={`${layout.textClass} ${className}`} style={style}>
      {children}
    </p>
  );
};
