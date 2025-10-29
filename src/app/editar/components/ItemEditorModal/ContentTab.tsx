"use client";

import { useState, useEffect } from "react";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
} from "#/types/template-data";
import { CurrencyInput } from "#/components/Inputs";

interface ContentTabProps {
  itemType: "team" | "results" | "expertise" | "testimonials";
  currentItem: TeamMember | Result | ExpertiseTopic | Testimonial | null;
  onUpdate: (
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
  ) => void;
  onDeleteItem: (itemId: string) => void; // Change this to accept itemId
}

export default function ContentTab({
  itemType,
  currentItem,
  onUpdate,
  onDeleteItem, // Change this
}: ContentTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    instagram: "",
    investment: "",
    roi: "",
    title: "",
    description: "",
    testimonial: "",
  });

  const [instagramError, setInstagramError] = useState("");

  // Instagram username validation
  const validateInstagramUsername = (username: string): string => {
    if (!username) return ""; // Empty is valid (optional field)

    // Check length (1-30 characters)
    if (username.length < 1 || username.length > 30) {
      return "Username deve ter entre 1 e 30 caracteres";
    }

    // Check for spaces
    if (username.includes(" ")) {
      return "Username não pode conter espaços";
    }

    // Check for valid characters (letters, numbers, periods, underscores)
    const validPattern = /^[a-zA-Z0-9._]+$/;
    if (!validPattern.test(username)) {
      return "Username pode conter apenas letras, números, pontos e underscores";
    }

    return ""; // Valid
  };

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
          title: "",
          description: "",
          testimonial: "",
        });
      } else if (itemType === "results") {
        const result = currentItem as Result;
        setFormData({
          name: result.client || "",
          role: "",
          instagram: result.instagram || "",
          investment: result.investment || "",
          roi: result.roi || "",
          title: "",
          description: "",
          testimonial: "",
        });
      } else if (itemType === "expertise") {
        const topic = currentItem as ExpertiseTopic;
        setFormData({
          name: "",
          role: "",
          instagram: "",
          investment: "",
          roi: "",
          title: topic.title || "",
          description: topic.description || "",
          testimonial: "",
        });
      } else {
        const testimonial = currentItem as Testimonial;
        setFormData({
          name: testimonial.name || "",
          role: testimonial.role || "",
          instagram: "",
          investment: "",
          roi: "",
          title: "",
          description: "",
          testimonial: testimonial.testimonial || "",
        });
      }
    }
  }, [currentItem, itemType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate Instagram username on change
    if (field === "instagram") {
      const error = validateInstagramUsername(value);
      setInstagramError(error);
    }

    // Update pending changes immediately when user types
    if (itemType === "team") {
      onUpdate({
        name: field === "name" ? value : formData.name,
        role: field === "role" ? value : formData.role,
      });
    } else if (itemType === "results") {
      onUpdate({
        client: field === "name" ? value : formData.name,
        instagram: field === "instagram" ? value : formData.instagram,
        investment: field === "investment" ? value : formData.investment,
        roi: field === "roi" ? value : formData.roi,
      });
    } else if (itemType === "expertise") {
      onUpdate({
        title: field === "title" ? value : formData.title,
        description: field === "description" ? value : formData.description,
      });
    } else {
      onUpdate({
        name: field === "name" ? value : formData.name,
        role: field === "role" ? value : formData.role,
        testimonial: field === "testimonial" ? value : formData.testimonial,
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
    <div className="mt-4 space-y-6 px-1">
      {/* Nome field */}
      {itemType !== "expertise" && itemType !== "testimonials" && (
        <div className="flex items-center justify-between">
          <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
            Nome
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
            placeholder="Digite o nome"
          />
        </div>
      )}

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
            className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
            placeholder="Digite o cargo"
          />
        </div>
      )}

      {/* Results-specific fields */}
      {itemType === "results" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className={`w-[210px] rounded-[4px] border bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] ${
                  instagramError
                    ? "border-red-500"
                    : "border-[#DBDDDF] focus:border-[#007bff] focus:outline-none"
                }`}
                placeholder="Usuário"
              />
              {instagramError && (
                <div className="absolute top-full left-0 mt-1 text-xs text-red-500">
                  {instagramError}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Investimento
            </label>
            <CurrencyInput
              value={formData.investment}
              onChange={(value) => handleInputChange("investment", value)}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Retorno
            </label>
            <CurrencyInput
              value={formData.roi}
              onChange={(value) => handleInputChange("roi", value)}
              placeholder="R$ 0,00"
            />
          </div>
        </>
      )}

      {/* Expertise-specific fields */}
      {itemType === "expertise" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
              placeholder="Digite o título"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
              placeholder="Digite a descrição"
              rows={5}
            />
          </div>
        </>
      )}

      {/* Testimonials-specific fields */}
      {itemType === "testimonials" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
              placeholder="Digite o nome"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Cargo
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
              placeholder="Digite o cargo"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
              Depoimento
            </label>
            <textarea
              value={formData.testimonial}
              onChange={(e) => handleInputChange("testimonial", e.target.value)}
              className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
              placeholder="Digite o depoimento"
              rows={5}
            />
          </div>
        </>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center pt-4">
        <button
          onClick={() => currentItem?.id && onDeleteItem(currentItem.id)} // Change this line
          className="text-white-neutral-light-900 flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-red-700"
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
