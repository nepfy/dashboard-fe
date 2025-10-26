"use client";

import { useState, useEffect } from "react";
import { TeamMember, Result } from "#/types/template-data";

interface ContentTabProps {
  itemType: "team" | "results";
  currentItem: TeamMember | Result | null;
  onUpdate: (data: Partial<TeamMember> | Partial<Result>) => void;
  onDelete: () => void;
}

export default function ContentTab({
  itemType,
  currentItem,
  onUpdate,
  onDelete,
}: ContentTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    instagram: "",
    investment: "",
    roi: "",
  });

  useEffect(() => {
    if (currentItem) {
      if (itemType === "team") {
        const teamMember = currentItem as TeamMember;
        setFormData({
          name: teamMember.name || "",
          role: teamMember.role || "",
          instagram: "",
          investment: "",
          roi: "",
        });
      } else {
        const result = currentItem as Result;
        setFormData({
          name: result.client || "",
          role: "",
          instagram: result.instagram || "",
          investment: result.investment || "",
          roi: result.roi || "",
        });
      }
    }
  }, [currentItem, itemType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update pending changes immediately when user types
    if (itemType === "team") {
      onUpdate({
        name: field === "name" ? value : formData.name,
        role: field === "role" ? value : formData.role,
      });
    } else {
      onUpdate({
        client: field === "name" ? value : formData.name,
        instagram: field === "instagram" ? value : formData.instagram,
        investment: field === "investment" ? value : formData.investment,
        roi: field === "roi" ? value : formData.roi,
      });
    }
  };

  if (!currentItem) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Selecione um item para editar
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      {/* Nome field */}
      <div className="flex items-center justify-between gap-2">
        <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
          Nome
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Digite o nome"
        />
      </div>

      {/* Role field (only for team) */}
      {itemType === "team" && (
        <div className="flex items-center justify-between gap-2">
          <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
            Cargo
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Digite o cargo"
          />
        </div>
      )}

      {/* Results-specific fields */}
      {itemType === "results" && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleInputChange("instagram", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="@usuario"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Investimento
            </label>
            <input
              type="text"
              value={formData.investment}
              onChange={(e) => handleInputChange("investment", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="R$ 0,00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Retorno
            </label>
            <input
              type="text"
              value={formData.roi}
              onChange={(e) => handleInputChange("roi", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="R$ 0,00"
            />
          </div>
        </>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center pt-4">
        <button
          onClick={onDelete}
          className="text-white-neutral-light-900 flex items-center gap-2 text-sm font-medium hover:text-red-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Excluir item
        </button>
      </div>
    </div>
  );
}
