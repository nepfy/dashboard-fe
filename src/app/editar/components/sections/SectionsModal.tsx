import { Plus, Minus } from "lucide-react";

import Modal from "../Modal";
import { SectionsModalProps } from "./types";
import { useState } from "react";

const SECTIONS = [
  {
    id: 1,
    name: "Introdução",
    hidden: false,
  },
  {
    id: 2,
    name: "Sobre Nós",
    hidden: false,
  },
  {
    id: 3,
    name: "Time",
    hidden: false,
  },
  {
    id: 4,
    name: "Especialidades",
    hidden: false,
  },
  {
    id: 5,
    name: "Etapas",
    hidden: false,
  },
  {
    id: 6,
    name: "Resultados",
    hidden: false,
  },
  {
    id: 7,
    name: "Depoimentos",
    hidden: false,
  },
  {
    id: 8,
    name: "Planos",
    hidden: false,
  },
  {
    id: 9,
    name: "Investimento",
    hidden: false,
  },
  {
    id: 10,
    name: "Escopo",
    hidden: false,
  },
  {
    id: 11,
    name: "FAQ",
    hidden: false,
  },
  {
    id: 12,
    name: "Rodapé",
    hidden: false,
  },
];

export default function SectionsModal({
  isOpen,
  onClose,
  handleSave,
  disabled,
}: SectionsModalProps) {
  const [sections, setSections] = useState(SECTIONS);

  const toggleSection = (id: number) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, hidden: !section.hidden } : section
      )
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      handleSave={handleSave}
      disabled={disabled}
    >
      <div className="max-w-[476px]">
        <p className="text-primary-light-400 text-[32px]">
          Monte a estrutura da sua proposta
        </p>
        <p className="text-white-neutral-light-500 text-sm pt-2 pb-6">
          Adicione ou oculte seções conforme a necessidade do seu projeto.
        </p>

        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`group w-full sm:w-[210px] 
                  border rounded-[10px] pt-4 pb-4 px-6 
                  hover:bg-white-neutral-light-200 transition-all duration-200 flex items-center justify-between cursor-pointer
                  ${
                    section.hidden
                      ? "bg-white-neutral-light-200 border-white-neutral-light-200"
                      : "bg-white-neutral-light-100 border-[#E0E3E9]"
                  }
                `}
            >
              <p className="text-sm text-primary-light-500 font-medium">
                {section.name}
              </p>

              {section.hidden ? (
                <Plus className="w-4 h-4 text-white-neutral-light-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              ) : (
                <Minus className="w-4 h-4 text-white-neutral-light-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
