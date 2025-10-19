import { Plus, Minus } from "lucide-react";

import Modal from "../Modal";
import { SectionsModalProps } from "./types";
import { useState, useEffect } from "react";
import { useEditor } from "../../contexts/EditorContext";

const SECTIONS = [
  {
    id: "introduction",
    name: "Introdução",
    hidden: false,
  },
  {
    id: "aboutUs",
    name: "Sobre Nós",
    hidden: false,
  },
  {
    id: "team",
    name: "Time",
    hidden: false,
  },
  {
    id: "expertise",
    name: "Especialidades",
    hidden: false,
  },
  {
    id: "steps",
    name: "Etapas",
    hidden: false,
  },
  {
    id: "results",
    name: "Resultados",
    hidden: false,
  },
  {
    id: "testimonials",
    name: "Depoimentos",
    hidden: false,
  },
  {
    id: "plans",
    name: "Planos",
    hidden: false,
  },
  {
    id: "investment",
    name: "Investimento",
    hidden: false,
  },
  {
    id: "escope",
    name: "Escopo",
    hidden: false,
  },
  {
    id: "faq",
    name: "FAQ",
    hidden: false,
  },
  {
    id: "footer",
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
  const { getSectionVisibility, updateSectionVisibility } = useEditor();
  const [sections, setSections] = useState(SECTIONS);

  // Load section visibility from context
  useEffect(() => {
    const visibility = getSectionVisibility();
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        hidden: visibility[section.id] || false,
        hideProjectScope: visibility[section.id] || false,
      }))
    );
  }, [getSectionVisibility]);

  const toggleSection = (id: string) => {
    if (id === "introduction" || id === "footer") {
      return;
    }

    const section = sections.find((s) => s.id === id);
    if (section) {
      const newHidden = !section.hidden;

      setSections((prevSections) =>
        prevSections.map((s) => (s.id === id ? { ...s, hidden: newHidden } : s))
      );
    }
  };

  const handleSaveWithChanges = () => {
    sections.forEach((section) => {
      updateSectionVisibility(section.id, section.hidden);
    });

    handleSave();
    onClose();
  };

  const handleCancel = () => {
    // Reload the original visibility from context
    const visibility = getSectionVisibility();
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        hidden: visibility[section.id] || false,
      }))
    );

    // Close the modal
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      handleSave={handleSaveWithChanges}
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
              className={`group w-full sm:w-[210px] border rounded-[10px] pt-4 pb-4 px-6 transition-all duration-200 flex items-center justify-between 
                  ${
                    section.hidden
                      ? "bg-white-neutral-light-200 border-white-neutral-light-200 cursor-pointer"
                      : ""
                  }
                  ${
                    section.id === "introduction" || section.id === "footer"
                      ? "bg-white-neutral-light-100 hover:bg-white-neutral-light-100 border-[#E0E3E9] cursor-not-allowed"
                      : "bg-white-neutral-light-100 hover:bg-white-neutral-light-200 border-[#E0E3E9]"
                  }
                `}
            >
              <p className="text-sm text-primary-light-500 font-medium">
                {section.name}
              </p>

              {section.id === "introduction" || section.id === "footer" ? (
                <div className="w-4 h-4" />
              ) : section.hidden ? (
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
