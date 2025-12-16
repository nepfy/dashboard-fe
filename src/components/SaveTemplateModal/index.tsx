"use client";

import { useState, useEffect } from "react";
import Modal from "#/components/Modal";
import type { TemplateData } from "#/types/template-data";
import type { SavedTemplate } from "#/types/templates";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: TemplateData | null;
  onSaved?: (template: SavedTemplate) => void;
}

export default function SaveTemplateModal({
  isOpen,
  onClose,
  projectData,
  onSaved,
}: SaveTemplateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!projectData || !name.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          templateType: projectData.templateType,
          mainColor: projectData.mainColor,
          templateData: projectData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao salvar template");
      }

      setSuccess(true);
      onSaved?.(result.data);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("templateSaved"));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao salvar";
      setError(message);
    } finally {
      setIsSaving(false);
      onClose?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={false}
      width="420px"
      showCloseButton={false}
      closeOnClickOutside={true}
    >
      {success ? (
        <div className="space-y-4 px-6 pt-6 pb-6 text-center">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Template salvo com sucesso!
          </p>
          <p className="text-sm text-gray-600">
            Você pode acessá-lo a qualquer momento na área de templates.
          </p>
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6B46C1] px-4 py-2 text-sm font-medium text-white hover:from-[#7C3AED] hover:to-[#5B21B6]"
          >
            Fechar
          </button>
        </div>
      ) : (
        <div className="font-satoshi p-6">
          <p className="text-primary-light-400 text-[24px] font-medium">
            Salvar como template
          </p>
          <p className="text-white-neutral-light-900 mb-6 text-sm">
            Salve esta proposta como um template para usar como base em futuros
            projetos.
          </p>

          <div className="mb-6 space-y-3">
            <div className="rounded-lg border border-[#E8E2FD]/70 bg-[#E8E2FD4D] px-3 py-2.5">
              <label className="text-white-neutral-light-800 text-sm font-medium">
                Nome do template
              </label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onFocus={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className="text-white-neutral-light-800 w-full rounded-lg border border-gray-200 bg-white p-6 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
              placeholder='Ex: "Redes Sociais Completa"'
            />
          </div>

          <div className="mb-6 space-y-3">
            <div className="rounded-lg border border-[#E8E2FD]/70 bg-[#E8E2FD4D] px-3 py-2.5">
              <label className="text-white-neutral-light-800 text-sm font-medium">
                Descrição
              </label>
            </div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onFocus={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className="text-white-neutral-light-800 w-full rounded-lg border border-gray-200 bg-white p-6 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
              placeholder='Ex: "Pacote completo para redes sociais"'
            />
          </div>

          {error && (
            <p className="mb-4 text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-start gap-3">
            <button
              onClick={onClose}
              className="text-white-neutral-light-800 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="bg-primary-light-400 hover:bg-primary-light-500 border-primary-light-25 rounded-md px-4 py-2 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar template"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
