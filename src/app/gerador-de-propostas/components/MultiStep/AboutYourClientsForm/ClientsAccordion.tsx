import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";
import { TextField } from "#/components/Inputs";
import Modal from "#/components/Modal";

import { Client } from "#/types/project";

interface ClientsAccordionProps {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
}

export default function ClientsAccordion({
  clients,
  onClientsChange,
}: ClientsAccordionProps) {
  const [openClient, setOpenClient] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [clientToRemove, setClientToRemove] = useState<string | null>(null);

  const addClient = () => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: "",
      sortOrder: clients.length,
    };

    const updatedClients = [...clients, newClient];
    onClientsChange(updatedClients);
    setOpenClient(newClient.id);
  };

  const removeClient = (clientId: string) => {
    const updatedClients = clients.filter((client) => client.id !== clientId);
    // Update sort orders after removal
    const reorderedClients = updatedClients.map((client, index) => ({
      ...client,
      sortOrder: index,
    }));
    onClientsChange(reorderedClients);

    if (openClient === clientId) {
      setOpenClient(null);
    }
  };

  const handleRemoveClick = (clientId: string) => {
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
    value: string
  ) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, [field]: value } : client
    );
    onClientsChange(updatedClients);
  };

  const toggleClient = (clientId: string) => {
    setOpenClient(openClient === clientId ? null : clientId);
  };

  const handleFileChange = (clientId: string, file: File | null) => {
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload the file and get a URL
      const imageUrl = URL.createObjectURL(file);
      updateClient(clientId, "logo", imageUrl);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedClients = [...clients];
    const draggedClient = reorderedClients[draggedIndex];

    // Remove the dragged item
    reorderedClients.splice(draggedIndex, 1);
    // Insert it at the new position
    reorderedClients.splice(dropIndex, 0, draggedClient);

    // Update sort orders
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
      {clients.map((client, index) => (
        <div
          key={client.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            draggedIndex === index ? "opacity-50 scale-95" : ""
          } ${
            dragOverIndex === index && draggedIndex !== index
              ? "border-2 border-primary-light-400 border-dashed"
              : ""
          }`}
        >
          {/* Accordion Header */}
          <div className="flex justify-center gap-4 w-full">
            <div
              className={`flex flex-1 items-center justify-between py-2 px-4 cursor-grab active:cursor-grabbing hover:bg-white-neutral-light-400 transition-colors bg-white-neutral-light-300 rounded-2xs mb-4 ${
                draggedIndex === index ? "cursor-grabbing" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (draggedIndex === null) {
                  toggleClient(client.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center font-medium text-white-neutral-light-900 cursor-grab active:cursor-grabbing"
                    title="Arraste para reordenar"
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
              className="text-white-neutral-light-900 w-11 h-11 hover:bg-red-50 transition-colors flex items-center justify-center bg-white-neutral-light-100 rounded-[12px] border border-white-neutral-light-300 cursor-pointer"
              title="Remover cliente"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Accordion Content */}
          {openClient === client.id && (
            <div className="pb-4 space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-white-neutral-light-700 mb-2">
                  Logo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(client.id, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`photo-${client.id}`}
                    />
                    <label
                      htmlFor={`photo-${client.id}`}
                      className="w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border bg-white-neutral-light-100 border-white-neutral-light-300 rounded-2xs cursor-pointer hover:bg-white-neutral-light-200 transition-colors button-inner"
                    >
                      <PictureIcon width="16" height="16" /> Alterar imagem
                    </label>
                  </div>
                  <div className="text-xs text-white-neutral-light-500">
                    {client?.logo}
                  </div>
                </div>
                <div className="text-xs text-white-neutral-light-400 mt-3">
                  Tipo de arquivo: .jpg ou .png. Tamanho: 679×735px e peso entre
                  30 KB e 50 KB
                </div>
              </div>

              <div>
                <TextField
                  label="Nome do cliente"
                  inputName={`name-${client.id}`}
                  id={`name-${client.id}`}
                  type="text"
                  placeholder="Insira o nome do cliente"
                  value={client.name}
                  onChange={(e) =>
                    updateClient(client.id, "name", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addClient}
        className="w-full p-4 border-1 border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
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
        <p className="text-white-neutral-light-500 text-sm mb-6 p-6">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex items-center gap-3 border-t border-white-neutral-light-300 p-6">
          <button
            type="button"
            onClick={handleConfirmRemove}
            className="px-4 py-2 text-sm font-medium bg-primary-light-500 button-inner-inverse border rounded-[12px] text-white-neutral-light-100 border-white-neutral-light-300 hover:bg-primary-light-600 cursor-pointer"
          >
            Remover
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
