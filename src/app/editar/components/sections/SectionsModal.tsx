import { Plus, Minus } from "lucide-react";

import Modal from "../Modal";
import { SectionsModalProps } from "./types";
import { useState, useEffect, useRef, useMemo } from "react";
import { useEditor } from "../../contexts/EditorContext";

const FLASH_SECTIONS = [
  { id: "introduction", name: "Introdução", hidden: false },
  { id: "aboutUs", name: "Sobre Nós", hidden: false },
  { id: "team", name: "Time", hidden: false },
  { id: "expertise", name: "Especialidades", hidden: false },
  { id: "steps", name: "Etapas", hidden: false },
  { id: "results", name: "Resultados", hidden: false },
  { id: "testimonials", name: "Depoimentos", hidden: false },
  { id: "plans", name: "Planos", hidden: false },
  { id: "investment", name: "Investimento", hidden: false },
  { id: "escope", name: "Escopo", hidden: false },
  { id: "faq", name: "FAQ", hidden: false },
  { id: "footer", name: "Rodapé", hidden: false },
];

const MINIMAL_SECTIONS = [
  { id: "introduction", name: "Introdução", hidden: false },
  { id: "aboutUs", name: "Sobre Nós", hidden: false },
  { id: "clients", name: "Clientes", hidden: false },
  { id: "expertise", name: "Especialidades", hidden: false },
  { id: "escope", name: "Escopo", hidden: false },
  { id: "plans", name: "Planos", hidden: false },
  { id: "termsConditions", name: "Termos", hidden: false },
  { id: "faq", name: "FAQ", hidden: false },
  { id: "footer", name: "Rodapé", hidden: false },
];

export default function SectionsModal({
  isOpen,
  onClose,
  handleSave,
}: SectionsModalProps) {
  const { getSectionVisibility, updateSectionVisibility, projectData } = useEditor();
  
  // Determine which sections to use based on template type
  const templateSections = projectData?.templateType === 'minimal' ? MINIMAL_SECTIONS : FLASH_SECTIONS;
  
  const [sections, setSections] = useState(templateSections);
  const initialVisibilityRef = useRef<Record<string, boolean> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update sections when template changes
  useEffect(() => {
    setSections(templateSections);
  }, [projectData?.templateType, templateSections]);

  // Load section visibility from context and track initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      const visibility = getSectionVisibility();
      // Store initial visibility state when modal opens
      initialVisibilityRef.current = { ...visibility };

      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          hidden: visibility[section.id] || false,
          hideProjectScope: visibility[section.id] || false,
        }))
      );
      setIsInitialized(true);
    } else {
      // Reset initial state when modal closes
      initialVisibilityRef.current = null;
      setIsInitialized(false);
    }
  }, [isOpen, getSectionVisibility]);

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

    // Reset initial state
    initialVisibilityRef.current = null;

    // Close the modal
    onClose();
  };

  // Calculate if there are changes by comparing current state with initial state
  // Use useMemo to recalculate when sections change
  const hasChanges = useMemo(() => {
    if (!initialVisibilityRef.current || !isOpen || !isInitialized)
      return false;

    return sections.some((section) => {
      const initialHidden = initialVisibilityRef.current?.[section.id] || false;
      return section.hidden !== initialHidden;
    });
  }, [sections, isOpen, isInitialized]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      handleSave={handleSaveWithChanges}
      disabled={!hasChanges}
    >
      <div className="max-w-[476px]">
        <p className="text-primary-light-400 text-[32px]">
          Monte a estrutura da sua proposta
        </p>
        <p className="text-white-neutral-light-500 pt-2 pb-6 text-sm">
          Adicione ou oculte seções conforme a necessidade do seu projeto.
        </p>

        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`group flex w-full items-center justify-between rounded-[10px] border px-6 pt-4 pb-4 transition-all duration-200 sm:w-[210px] ${
                section.hidden
                  ? "bg-white-neutral-light-200 border-white-neutral-light-200 cursor-pointer"
                  : ""
              } ${
                section.id === "introduction" || section.id === "footer"
                  ? "bg-white-neutral-light-100 hover:bg-white-neutral-light-100 cursor-not-allowed border-[#E0E3E9]"
                  : "bg-white-neutral-light-100 hover:bg-white-neutral-light-200 border-[#E0E3E9]"
              } `}
            >
              <p className="text-primary-light-500 text-sm font-medium">
                {section.name}
              </p>

              {section.id === "introduction" || section.id === "footer" ? (
                <div className="h-4 w-4" />
              ) : section.hidden ? (
                <Plus className="text-white-neutral-light-600 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              ) : (
                <Minus className="text-white-neutral-light-600 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
