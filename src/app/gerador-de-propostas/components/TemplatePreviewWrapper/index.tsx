import React from "react";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import {
  generateTemplateGradient,
  getTemplateDisplayName,
  generateTemplateColors,
} from "#/helpers/templateUtils";

interface TemplatePreviewWrapperProps {
  children: React.ReactNode;
  showTemplateIndicator?: boolean;
  className?: string;
  style?: React.CSSProperties;
  gradientOverride?: string;
  colorOverride?: string;
}

export default function TemplatePreviewWrapper({
  children,
  className = "",
  style = {},
  gradientOverride,
  colorOverride,
}: TemplatePreviewWrapperProps) {
  const { templateType, formData } = useProjectGenerator();

  const mainColor = colorOverride || formData?.step1?.mainColor || "#4F21A1";

  const backgroundGradient =
    gradientOverride ||
    generateTemplateGradient(templateType || "flash", mainColor);
  const templateColors = generateTemplateColors(
    templateType || "flash",
    mainColor
  );

  return (
    <div
      className={`h-full relative ${className}`}
      style={{
        background: backgroundGradient,
        backdropFilter: "blur(105.34431457519531px)",
        ...style,
      }}
    >
      <div className="relative z-10 h-full">{children}</div>

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${mainColor}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${templateColors.accent}40 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}

export const useTemplateColors = () => {
  const { templateType, formData } = useProjectGenerator();
  const mainColor = formData?.step1?.mainColor || "#4F21A1";

  return {
    mainColor,
    templateType,
    templateColors: generateTemplateColors(templateType || "flash", mainColor),
    gradient: generateTemplateGradient(templateType || "flash", mainColor),
    templateName: getTemplateDisplayName(templateType || ""),
  };
};
