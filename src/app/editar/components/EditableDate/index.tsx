"use client";

import { useState, useMemo, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import CloseIcon from "#/components/icons/CloseIcon";
import Calendar from "#/app/editar/components/Calendar";
import { useEditor } from "#/app/editar/contexts/EditorContext";

interface EditableDateProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function EditableDate({
  isModalOpen,
  setIsModalOpen,
}: EditableDateProps) {
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const { projectData, updateProjectValidUntil } = useEditor();

  const currentDate = useMemo(() => {
    if (!projectData?.projectValidUntil) return null;
    const dateStr = projectData.projectValidUntil;

    if (typeof dateStr === "string" && dateStr.includes("-")) {
      if (dateStr.includes("T")) {
        const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T/);
        if (isoMatch) {
          const [, year, month, day] = isoMatch;
          const localDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          return localDate;
        }
      }

      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          const date = new Date(year, month - 1, day);
          return date;
        }
      }
    }

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }, [projectData?.projectValidUntil]);

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedDate(currentDate);
    }
  }, [isModalOpen, currentDate]);

  const handleDateSelect = (date: Date) => {
    setTempSelectedDate(new Date(date));
  };

  const handleSave = () => {
    const dateToSave = tempSelectedDate;
    if (dateToSave) {
      updateProjectValidUntil(dateToSave);
    }
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative inline" onClick={handleOpen}>
      <EditableModal
        isOpen={isModalOpen}
        className="fixed inset-0 z-[10] flex items-center justify-center sm:absolute sm:inset-auto sm:top-[-150px] sm:left-[25px]"
        trianglePosition="top-[150px] left-[-8px]"
      >
        <div
          className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-lg font-medium text-[#2A2A2A]">
            Validade da proposta
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
          >
            <CloseIcon width="12" height="12" fill="#1C1A22" />
          </button>
        </div>

        <span onClick={(e) => e.stopPropagation()}>
          <Calendar
            selectedDate={tempSelectedDate}
            onDateSelect={handleDateSelect}
          />
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className="mt-14 flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
        >
          Alterar
        </button>
      </EditableModal>
    </div>
  );
}
