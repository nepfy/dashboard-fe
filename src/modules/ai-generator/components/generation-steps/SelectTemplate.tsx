import { ArrowLeft } from "lucide-react";
import TemplateSelection from "#/app/gerador-de-propostas/components/TemplateSelection";
import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useEffect } from "react";

interface TemplateModel {
  id: string;
  title: string;
  description: string;
  colorsList: string[];
  preview: string;
}

const templates: TemplateModel[] = [
  {
    id: "flash",
    title: "Flash",
    description:
      "Design vibrante e energético, ideal para quem quer se destacar.",
    colorsList: [
      "#4F21A1",
      "#BE8406",
      "#9B3218",
      "#05722C",
      "#182E9B",
      "#212121",
    ],
    preview: "flash",
  },
  {
    id: "prime",
    title: "Prime",
    description: "Design sofisticado, perfeito para ambientes corporativos.",
    colorsList: [
      "#010101",
      "#E9E9E9",
      "#F0E5E0",
      "#223630",
      "#621D1E",
      "#08306C",
    ],
    preview: "prime",
  },
  {
    id: "grid",
    title: "Grid",
    description:
      "Design limpo e funcional, com estrutura compacta e navegação direta ao ponto.",
    colorsList: [
      "#2C2C2C",
      "#146EF4",
      "#78838E",
      "#294D41",
      "#5E4D35",
      "#7C4257",
    ],
    preview: "grid",
  },
  // {
  //   id: "grid-2",
  //   title: "Grid",
  //   description:
  //     "Design limpo e funcional, com estrutura compacta e navegação direta ao ponto.",
  //   colorsList: [
  //     "#2C2C2C",
  //     "#146EF4",
  //     "#78838E",
  //     "#294D41",
  //     "#5E4D35",
  //     "#7C4257",
  //   ],
  //   preview: "grid-2",
  // },
  // {
  //   id: "essencial",
  //   title: "Essencial",
  //   description: "Design minimalista e elegante, com simplicidade impactante.",
  //   colorsList: [
  //     "#F0CCE6",
  //     "#EBEBEB",
  //     "#EEE0BA",
  //     "#BCFBD5",
  //     "#741E20",
  //     "#0A3EF4",
  //   ],
  //   preview: "essencial",
  // },
];

export function SelectTemplate({
  handleNextStep,
  handleBack,
}: {
  handleNextStep: () => void;
  handleBack?: () => void;
}) {
  const { updateFormData, setTemplateType, templateType } =
    useProjectGenerator();

  useEffect(() => {
    if (!templateType) {
      setTemplateType("flash");
      updateFormData("step1", {
        templateType: "flash",
        mainColor: templates[0].colorsList[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTemplateSelect = (template: TemplateType, color: string) => {
    setTemplateType(template);
    updateFormData("step1", {
      templateType: template,
      mainColor: color,
    });
  };

  return (
    <>
      <div className="h-full w-full md:flex flex-col justify-center overflow-y-scroll pb-6">
        <h2 className="text-neutral-light-600 text-[24px] text-center font-medium py-4 px-6 sm:px-0 lg:pt-10 pb-0">
          Escolha o modelo da sua proposta
        </h2>
        <TemplateSelection
          templates={templates}
          onSelectTemplate={handleTemplateSelect}
          hideBanner
        />
      </div>

      {/* Continue Button */}
      {templateType && (
        <div className="fixed w-full bottom-0 flex justify-center items-center gap-4 sm:justify-start mt-8 px-6 py-3 sm:py-6 border-t border-white-neutral-light-300 bg-white-neutral-light-200">
          <button
            onClick={handleBack}
            className="cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <button
            onClick={() => handleNextStep()}
            className="px-6 py-3.5 bg-gradient-to-br from-primary-light-300 to-primary-light-500 via-primary-light-500 hover:from-primary-light-600 hover:to-primary-light-400 text-white text-sm font-medium rounded-[10px] flex justify-center items-center gap-1 transition-all duration-200 transform shadow-lg hover:shadow-xl cursor-pointer"
          >
            Continuar com {templates.find((t) => t.id === templateType)?.title}
          </button>
        </div>
      )}
    </>
  );
}
