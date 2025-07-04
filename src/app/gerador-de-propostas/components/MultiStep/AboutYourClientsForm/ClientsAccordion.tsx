import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import { TextField } from "#/components/Inputs";
import Modal from "#/components/Modal";
import { useImageUpload } from "#/hooks/useImageUpload";

import { Client } from "#/types/project";

interface ClientsAccordionProps {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
  disabled?: boolean;
}

export default function ClientsAccordion({
  clients,
  onClientsChange,
  disabled = false,
}: ClientsAccordionProps) {
  const [openClient, setOpenClient] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [clientToRemove, setClientToRemove] = useState<string | null>(null);
  const [uploadingClients, setUploadingClients] = useState<Set<string>>(
    new Set()
  );

  const [logoVisibility, setLogoVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const [clientNameVisibility, setClientNameVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const [uploadErrors, setUploadErrors] = useState<{
    [key: string]: string;
  }>({});

  const { uploadImage, clearError } = useImageUpload();

  const addClient = () => {
    if (disabled) return;

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: "",
      sortOrder: clients.length,
    };

    const updatedClients = [...clients, newClient];
    onClientsChange(updatedClients);
    setOpenClient(newClient.id);

    setLogoVisibility((prev) => ({
      ...prev,
      [newClient.id]: true,
    }));

    setClientNameVisibility((prev) => ({
      ...prev,
      [newClient.id]: true,
    }));
  };

  const removeClient = (clientId: string) => {
    if (disabled) return;

    const updatedClients = clients.filter((client) => client.id !== clientId);
    const reorderedClients = updatedClients.map((client, index) => ({
      ...client,
      sortOrder: index,
    }));
    onClientsChange(reorderedClients);

    if (openClient === clientId) {
      setOpenClient(null);
    }

    setLogoVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[clientId];
      return newVisibility;
    });

    setClientNameVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[clientId];
      return newVisibility;
    });

    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[clientId];
      return newErrors;
    });
  };

  const handleRemoveClick = (clientId: string) => {
    if (disabled) return;
    setClientToRemove(clientId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (clientToRemove) {
      removeClient(clientToRemove);
    }
    setShowRemoveModal(false);
    setClientToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setClientToRemove(null);
  };

  const updateClient = (
    clientId: string,
    field: keyof Client,
    value: string | boolean
  ) => {
    if (disabled) return;

    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, [field]: value } : client
    );
    onClientsChange(updatedClients);
  };

  const toggleClient = (clientId: string) => {
    if (disabled) return;
    setOpenClient(openClient === clientId ? null : clientId);
  };

  const toggleLogoVisibility = (clientId: string) => {
    if (disabled) return;

    const newVisibility = !(logoVisibility[clientId] ?? true);

    setLogoVisibility((prev) => ({
      ...prev,
      [clientId]: newVisibility,
    }));

    updateClient(clientId, "hideLogo", !newVisibility);
  };

  const toggleClientNameVisibility = (clientId: string) => {
    if (disabled) return;

    const newVisibility = !(clientNameVisibility[clientId] ?? true);

    setClientNameVisibility((prev) => ({
      ...prev,
      [clientId]: newVisibility,
    }));

    updateClient(clientId, "hideClientName", !newVisibility);
  };

  const getLogoVisibility = (clientId: string) => {
    return logoVisibility[clientId] ?? true;
  };

  const getClientNameVisibility = (clientId: string) => {
    return clientNameVisibility[clientId] ?? true;
  };

  const handleFileChange = async (clientId: string, file: File | null) => {
    if (!file || disabled) return;

    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[clientId];
      return newErrors;
    });

    try {
      clearError();

      setUploadingClients((prev) => new Set(prev).add(clientId));

      const result = await uploadImage(file);

      if (result.success && result.data) {
        updateClient(clientId, "logo", result.data.url);
      } else {
        console.error("Upload failed:", result.error);
        setUploadErrors((prev) => ({
          ...prev,
          [clientId]: result.error || "Erro ao fazer upload da imagem",
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadErrors((prev) => ({
        ...prev,
        [clientId]: "Erro ao fazer upload da imagem",
      }));
    } finally {
      setUploadingClients((prev) => {
        const newSet = new Set(prev);
        newSet.delete(clientId);
        return newSet;
      });
    }
  };

  const isUploadingForClient = (clientId: string) => {
    return uploadingClients.has(clientId);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (disabled) return;
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedClients = [...clients];
    const draggedClient = reorderedClients[draggedIndex];

    reorderedClients.splice(draggedIndex, 1);
    reorderedClients.splice(dropIndex, 0, draggedClient);

    const updatedClients = reorderedClients.map((client, index) => ({
      ...client,
      sortOrder: index,
    }));

    onClientsChange(updatedClients);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {clients.map((client, index) => {
        const logoVisible = getLogoVisibility(client.id);
        const clientNameVisible = getClientNameVisibility(client.id);

        return (
          <div
            key={client.id}
            className={`transition-all duration-200 ${
              draggedIndex === index ? "opacity-50 scale-95" : ""
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? "border-2 border-primary-light-400 border-dashed"
                : ""
            } ${disabled ? "opacity-60" : ""}`}
          >
            {/* Accordion Header */}
            <div
              className="flex justify-center gap-4 w-full"
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div
                className={`flex flex-1 items-center justify-between py-2 px-4 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                  disabled
                    ? "cursor-not-allowed"
                    : "hover:bg-white-neutral-light-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled && draggedIndex === null) {
                    toggleClient(client.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 flex items-center justify-center font-medium text-white-neutral-light-900 ${
                        disabled
                          ? "cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing"
                      }`}
                      title={
                        disabled ? "Desabilitado" : "Arraste para reordenar"
                      }
                    >
                      ⋮⋮
                    </div>
                    <span className="text-sm font-medium text-white-neutral-light-900">
                      Cliente {index + 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      openClient === client.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick(client.id);
                }}
                disabled={disabled}
                className={`text-white-neutral-light-900 w-11 h-11 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-red-50"
                }`}
                title={disabled ? "Desabilitado" : "Remover cliente"}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Accordion Content */}
            {openClient === client.id && (
              <div className="pb-4 space-y-4">
                <p className="text-white-neutral-light-800 py-3">
                  Dica: Você pode adicionar o logo do cliente ou apenas escrever
                  o nome caso não tenha a imagem.
                </p>

                {/* Logo Section */}
                <div>
                  <label
                    className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-3"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Logo
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLogoVisibility(client.id);
                      }}
                      className={`cursor-pointer ${
                        disabled ? "cursor-not-allowed opacity-60" : ""
                      }`}
                      disabled={disabled}
                    >
                      {logoVisible ? <EyeOpened /> : <EyeClosed />}
                    </button>
                  </label>
                  {logoVisible && (
                    <div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-[160px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                client.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                            id={`photo-${client.id}`}
                            disabled={
                              isUploadingForClient(client.id) || disabled
                            }
                          />
                          <label
                            htmlFor={`photo-${client.id}`}
                            className={`w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white-neutral-light-300 rounded-2xs transition-colors button-inner ${
                              isUploadingForClient(client.id) || disabled
                                ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                                : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                            }`}
                          >
                            {isUploadingForClient(client.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <PictureIcon width="16" height="16" />
                                Alterar imagem
                              </>
                            )}
                          </label>
                        </div>
                        <div className="text-xs text-white-neutral-light-500">
                          {client.logo
                            ? "Logo carregado"
                            : "Nenhuma logo selecionada"}
                        </div>
                      </div>

                      <div className="text-xs text-white-neutral-light-400 mt-3">
                        Tipo de arquivo: .jpg, .png ou .webp. Tamanho
                        recomendado: 100×100px. Tamanho máximo: 5MB
                      </div>

                      {uploadErrors[client.id] && (
                        <div className="text-xs text-red-500 mt-2 font-medium">
                          {uploadErrors[client.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Nome do Cliente Section */}
                <div>
                  <label
                    className="text-white-neutral-light-800 text-sm px-3 py-1 rounded-3xs font-medium flex justify-between items-center mb-2"
                    style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
                  >
                    Nome do cliente
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleClientNameVisibility(client.id);
                      }}
                      className={`cursor-pointer ${
                        disabled ? "cursor-not-allowed opacity-60" : ""
                      }`}
                      disabled={disabled}
                    >
                      {clientNameVisible ? <EyeOpened /> : <EyeClosed />}
                    </button>
                  </label>
                  {clientNameVisible && (
                    <TextField
                      inputName={`name-${client.id}`}
                      id={`name-${client.id}`}
                      type="text"
                      placeholder="Insira o nome do cliente"
                      value={client.name}
                      onChange={(e) =>
                        updateClient(client.id, "name", e.target.value)
                      }
                      disabled={disabled}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addClient}
        disabled={disabled}
        className={`w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-white-neutral-light-200"
            : "cursor-pointer bg-white-neutral-light-100 hover:bg-white-neutral-light-200"
        }`}
      >
        <Plus size={16} />
        Adicionar Cliente
      </button>

      <Modal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        title="Tem certeza de que deseja excluir este item?"
        footer={false}
      >
        <p className="text-white-neutral-light-900 text-sm px-6 pb-7">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex items-center gap-3 border-t border-white-neutral-light-300 p-6">
          <button
            type="button"
            onClick={handleConfirmRemove}
            className="px-4 py-2 text-sm font-medium bg-primary-light-500 button-inner-inverse border rounded-[12px] text-white-neutral-light-100 border-white-neutral-light-300 hover:bg-primary-light-600 cursor-pointer"
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={handleCancelRemove}
            className="px-4 py-2 text-sm font-medium border rounded-[12px] text-gray-700 border-white-neutral-light-300 hover:bg-gray-50 cursor-pointer button-inner"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
