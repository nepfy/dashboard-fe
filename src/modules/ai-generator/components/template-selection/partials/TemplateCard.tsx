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

  // Minimal (compartilha cores com Flash, exceto preto)
  "#000000": "preto",
};

export const getImagePath = (templateName: string, color: string): string => {
  const lower = templateName.toLowerCase();
  // Minimal: sempre mostra preview preto, independentemente da cor selecionada
  if (lower === "minimal") {
    return `/images/templates/minimal/preto.jpg`;
  }
  const imageName = colorToImageName[color] || "azul"; // fallback para azul
  return `/images/templates/${lower}/${imageName}.jpg`;
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
    className="rounded-2xs bg-white-neutral-light-100 border-white-neutral-light-300 h-auto w-[350px] max-w-full border-1 px-1 shadow-md"
    tabIndex={0}
    data-testid={`template-card-${template.title.toLowerCase()}`}
  >
    {/* Header */}
    <div className="px-7 py-4">
      <h4 className="text-white-neutral-light-800 text-lg font-medium">
        {template.title}
      </h4>
      <p className="text-white-neutral-light-500 mt-2 text-sm">
        {template.description}
      </p>
    </div>

    {/* Preview - Agora com imagem */}
    <div className="rounded-2xs m-2 h-[190px] overflow-hidden">
      <Image
        key={`${template.title}-${selectedColor}`}
        src={getImagePath(template.title, selectedColor)}
        alt={`Preview do template ${template.title}`}
        width={324}
        height={190}
        className="rounded-2xs h-full w-full object-cover"
        unoptimized
      />
    </div>

    {/* Color Selection */}
    <div className="px-7 py-4">
      <p className="text-white-neutral-light-500 mb-2 text-sm">
        Escolha a cor principal que será usada em toda a proposta
      </p>
      <ColorPicker
        colors={template.colorsList}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />
    </div>

    {/* Actions */}
    <div className="border-white-neutral-light-300 flex items-center gap-4 border-t p-5">
      <button
        type="button"
        className={`border-white-neutral-light-300 hover:bg-white-neutral-light-200 flex h-9 w-[105px] cursor-pointer items-center justify-center rounded-xs border transition-colors ${
          isSelected
            ? "bg-white-neutral-light-200"
            : "bg-white-neutral-light-100"
        } `}
        onClick={onSelectTemplate}
        data-testid={`template-select-${template.title.toLowerCase()}`}
      >
        Selecionar
      </button>
      <button
        type="button"
        className="text-white-neutral-light-800 hover:text-white-neutral-light-600 h-9 w-[105px] cursor-pointer transition-colors"
        onClick={onPreviewTemplate}
      >
        Visualizar
      </button>
    </div>
  </div>
);
