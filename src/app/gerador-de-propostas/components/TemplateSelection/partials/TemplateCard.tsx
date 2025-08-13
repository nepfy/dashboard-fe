import { TemplateType } from "#/types/project";
import Image from "next/image";
import { ColorPicker } from "./ColorPicker";

export interface Template {
  title: string;
  description: string;
  colorsList: string[];
}

interface TemplateCardProps {
  template: Template;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onSelectTemplate: () => void;
  onPreviewTemplate: () => void;
  isSelected: boolean;
}

export const colorToImageName: Record<string, string> = {
  // Flash
  "#4F21A1": "roxo",
  "#BE8406": "amarelo",
  "#9B3218": "vermelho",
  "#05722C": "verde",
  "#182E9B": "azul",
  "#212121": "cinza",

  // Prime
  "#010101": "preto",
  "#E9E9E9": "cinza",
  "#F0E5E0": "marrom",
  "#223630": "verde",
  "#621D1E": "vermelho",
  "#08306C": "azul",

  // Essencial
  "#F0CCE6": "rosa",
  "#EBEBEB": "cinza",
  "#EEE0BA": "amarelo",
  "#BCFBD5": "verde",
  "#741E20": "vermelho",
  "#0A3EF4": "azul",

  // Grid
  "#2C2C2C": "preto",
  "#146EF4": "azul",
  "#78838E": "cinza",
  "#294D41": "verde",
  "#5E4D35": "marrom",
  "#7C4257": "rosa",
};

export const getImagePath = (templateName: string, color: string): string => {
  const imageName = colorToImageName[color] || "azul"; // fallback para azul
  return `/images/templates/${templateName.toLowerCase()}/${imageName}.jpg`;
};

export const TemplateCard = ({
  template,
  selectedColor,
  onColorSelect,
  onSelectTemplate,
  onPreviewTemplate,
  isSelected,
}: TemplateCardProps) => (
  <div
    className={`h-[500px] w-[340px] max-w-full border-1 rounded-2xs bg-white-neutral-light-100 px-1 cursor-pointer ${
      isSelected ? "border-primary-light-300" : "border-white-neutral-light-300"
    }`}
    onClick={onSelectTemplate}
    role="button"
    tabIndex={0}
  >
    {/* Header */}
    <div className="px-7 py-4">
      <h4 className="font-medium text-white-neutral-light-800 text-lg">
        {template.title}
      </h4>
      <p className="text-white-neutral-light-500 text-sm mt-2">
        {template.description}
      </p>
    </div>

    {/* Preview - Agora com imagem */}
    <div className="rounded-2xs h-[190px] m-2 overflow-hidden">
      <Image
        src={getImagePath(template.title, selectedColor)}
        alt={`Preview do template ${template.title}`}
        width={324}
        height={190}
        className="w-full h-full object-cover rounded-2xs"
      />
    </div>

    {/* Color Selection */}
    <div className="px-7 py-4">
      <p className="text-white-neutral-light-500 text-sm mb-2">
        Escolha a cor principal que será usada em toda a proposta
      </p>
      <ColorPicker
        colors={template.colorsList}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />
    </div>

    {/* Actions */}
    <div className="border-t border-white-neutral-light-300 flex items-center gap-4 p-5">
      <button
        type="button"
        className="w-[105px] h-9 border border-white-neutral-light-300 bg-white-neutral-light-100 rounded-xs flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200 transition-colors"
        onClick={onSelectTemplate}
      >
        Selecionar
      </button>
      <button
        type="button"
        className="w-[105px] h-9 cursor-pointer text-white-neutral-light-800 hover:text-white-neutral-light-600 transition-colors"
        onClick={onPreviewTemplate}
      >
        Visualizar
      </button>
    </div>
  </div>
);
