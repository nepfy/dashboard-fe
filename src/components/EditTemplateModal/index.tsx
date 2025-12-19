"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Modal from "#/components/Modal";
import type { TemplateData } from "#/types/template-data";

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
  templateData: TemplateData | null;
}

export default function EditTemplateModal({
  isOpen,
  onClose,
  templateId,
  templateData,
}: EditTemplateModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setError(null);
      setIsLoading(false);
      setIsSaving(false);
      setIsDeleting(false);
      return;
    }

    if (!templateId) {
      setError("Template inválido");
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/templates/${templateId}`);
        const result: {
          success: boolean;
          data?: { name: string; description?: string | null };
          error?: string;
        } = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Erro ao carregar template");
        }

        setName(result.data.name ?? "");
        setDescription(result.data.description ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar template");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [isOpen, templateId]);

  const handleSave = async () => {
    if (!templateId || !templateData || !name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          templateType: templateData.templateType,
          mainColor: templateData.mainColor,
          templateData,
        }),
      });

      const result: { success: boolean; error?: string } = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro ao salvar template");
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("templateSaved"));
      }

      toast.success("Template salvo com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao salvar";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!templateId || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      const result: { success: boolean; error?: string } = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro ao excluir template");
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("templateSaved"));
      }

      toast.success("Template excluído com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      onClose();
      router.push("/gerar-proposta");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao excluir";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 4000 });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={false}
      width="520px"
      showCloseButton={false}
      closeOnClickOutside={true}
    >
      <div className="font-satoshi p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-primary-light-400 text-[24px] font-medium">
            Editar template
          </p>
          <button
            onClick={onClose}
            className="border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] border text-sm"
            aria-label="Fechar"
            disabled={isSaving || isDeleting}
          >
            ✕
          </button>
        </div>

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
            disabled={isLoading || isSaving || isDeleting}
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
            className="text-white-neutral-light-800 w-full rounded-lg border border-gray-200 bg-white p-6 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300 disabled:opacity-60"
            placeholder='Ex: "Pacote ID Visual"'
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
            disabled={isLoading || isSaving || isDeleting}
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
            className="text-white-neutral-light-800 w-full rounded-lg border border-gray-200 bg-white p-6 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300 disabled:opacity-60"
            placeholder='Ex: "Pacote de identidade visual com papelaria"'
          />
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!templateId || isLoading || isSaving || isDeleting}
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-700 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Excluir template
        </button>

        {error && (
          <p className="mb-4 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-start gap-3">
          <button
            onClick={onClose}
            disabled={isSaving || isDeleting}
            className="text-white-neutral-light-800 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={
              isLoading ||
              isSaving ||
              isDeleting ||
              !templateId ||
              !templateData ||
              !name.trim()
            }
            className="bg-primary-light-400 hover:bg-primary-light-500 border-primary-light-25 rounded-md px-4 py-2 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </Modal>
  );
}


