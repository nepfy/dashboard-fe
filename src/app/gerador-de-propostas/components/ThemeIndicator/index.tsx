import React from "react";
import { Palette, Eye, Settings } from "lucide-react";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { TemplateType } from "#/types/project";
import {
  getTemplateDisplayName,
  generateTemplateColors,
} from "#/helpers/templateUtils";

interface ThemeIndicatorProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showDetails?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function ThemeIndicator({
  position = "top-right",
  showDetails = true,
  showControls = false,
  className = "",
}: ThemeIndicatorProps) {
  const { templateType, formData, setTemplateType } = useProjectGenerator();

  const mainColor = formData?.step1?.mainColor || "#4F21A1";
  const templateColors = generateTemplateColors(
    templateType || "flash",
    mainColor
  );

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const templates = ["Flash", "Prime", "Essencial", "Grid"];

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-xl min-w-[200px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-800">
            Tema Atual
          </span>
        </div>

        {/* Template e Cor */}
        <div className="space-y-3">
          {/* Template selecionado */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Template:</span>
            <span className="text-sm font-medium text-gray-800">
              {getTemplateDisplayName(templateType || "")}
            </span>
          </div>

          {/* Cor principal */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Cor:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg border-2 border-white shadow-md"
                style={{ backgroundColor: mainColor }}
              />
              <span className="text-xs font-mono text-gray-700 uppercase">
                {mainColor}
              </span>
            </div>
          </div>

          {/* Paleta de cores do template (se showDetails estiver ativo) */}
          {showDetails && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-600 block mb-2">Paleta:</span>
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded border border-white shadow-sm"
                  style={{ backgroundColor: templateColors.primary }}
                  title="Primária"
                />
                <div
                  className="w-4 h-4 rounded border border-white shadow-sm"
                  style={{ backgroundColor: templateColors.secondary }}
                  title="Secundária"
                />
                <div
                  className="w-4 h-4 rounded border border-white shadow-sm"
                  style={{ backgroundColor: templateColors.accent }}
                  title="Destaque"
                />
                <div
                  className="w-4 h-4 rounded border border-white shadow-sm"
                  style={{ backgroundColor: templateColors.background }}
                  title="Fundo"
                />
              </div>
            </div>
          )}

          {/* Controles (se showControls estiver ativo) */}
          {showControls && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              {/* Seletor de template */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Mudar Template:
                </label>
                <select
                  value={templateType || "flash"}
                  onChange={(e) =>
                    setTemplateType(e.target.value as TemplateType)
                  }
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  {templates.map((template) => (
                    <option key={template} value={template.toLowerCase()}>
                      {template}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  title="Visualizar proposta"
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Ver
                </button>
                <button
                  className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  title="Configurações do tema"
                  onClick={() => {
                    const templateId = templateType?.toLowerCase() || "flash";
                    window.open(
                      `/admin/templates/config/${templateId}`,
                      "_blank"
                    );
                  }}
                >
                  <Settings className="w-3 h-3 inline mr-1" />
                  Config
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook para usar o indicador de tema em qualquer lugar
export const useThemeIndicator = () => {
  const { templateType, formData } = useProjectGenerator();

  const mainColor = formData?.step1?.mainColor || "#4F21A1";
  const templateName = getTemplateDisplayName(templateType || "");
  const templateColors = generateTemplateColors(
    templateType || "flash",
    mainColor
  );

  return {
    templateType,
    templateName,
    mainColor,
    templateColors,
    isConfigured: Boolean(templateType && mainColor),
  };
};

// Componente compacto para mostrar apenas o tema atual
export const CompactThemeIndicator = ({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const { templateName, mainColor, isConfigured } = useThemeIndicator();

  if (!isConfigured) return null;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white transition-all duration-200 ${className}`}
    >
      <div
        className="w-3 h-3 rounded-full border border-white shadow-sm"
        style={{ backgroundColor: mainColor }}
      />
      <span className="text-sm font-medium text-gray-800">{templateName}</span>
    </button>
  );
};

// Componente para mostrar as cores do template em linha
export const TemplateColorPalette = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const { templateColors, isConfigured } = useThemeIndicator();

  if (!isConfigured) return null;

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const colorSize = sizeClasses[size];

  return (
    <div className={`flex gap-1 ${className}`}>
      <div
        className={`${colorSize} rounded border border-white shadow-sm`}
        style={{ backgroundColor: templateColors.primary }}
        title="Cor primária"
      />
      <div
        className={`${colorSize} rounded border border-white shadow-sm`}
        style={{ backgroundColor: templateColors.secondary }}
        title="Cor secundária"
      />
      <div
        className={`${colorSize} rounded border border-white shadow-sm`}
        style={{ backgroundColor: templateColors.accent }}
        title="Cor de destaque"
      />
      <div
        className={`${colorSize} rounded border border-white shadow-sm`}
        style={{ backgroundColor: templateColors.background }}
        title="Cor de fundo"
      />
    </div>
  );
};
