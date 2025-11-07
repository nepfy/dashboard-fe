"use client";

import { useState, useMemo, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import CloseIcon from "#/components/icons/CloseIcon";
import Calendar from "#/app/editar/components/Calendar";
import { useEditor } from "#/app/editar/contexts/EditorContext";

interface EditableDateProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  editingId: string;
}

export default function EditableDate({
  isModalOpen,
  setIsModalOpen,
  editingId,
}: EditableDateProps) {
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const { projectData, updateProjectValidUntil, startEditing, stopEditing } =
    useEditor();

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
      // Try to start editing when modal opens
      const canStartEditing = startEditing(editingId);
      if (!canStartEditing) {
        // If another field/modal is already active, close this modal
        setIsModalOpen(false);
        return;
      }
      setTempSelectedDate(currentDate);
    } else {
      // Stop editing when modal closes
      stopEditing(editingId);
    }
  }, [
    isModalOpen,
    currentDate,
    editingId,
    startEditing,
    stopEditing,
    setIsModalOpen,
  ]);

  const handleDateSelect = (date: Date) => {
    setTempSelectedDate(new Date(date));
  };

  const handleSave = () => {
    const dateToSave = tempSelectedDate;
    if (dateToSave) {
      updateProjectValidUntil(dateToSave);
    }
    setIsModalOpen(false);
    stopEditing(editingId);
  };

  // Check if the date has been changed
  const hasDateChanged = () => {
    if (!currentDate || !tempSelectedDate) return false;

    // Compare dates by converting to ISO string and comparing date parts only
    const currentDateStr = currentDate.toISOString().split("T")[0];
    const tempDateStr = tempSelectedDate.toISOString().split("T")[0];

    return currentDateStr !== tempDateStr;
  };

  const handleOpen = () => {
    // Check if we can start editing (no other field/modal is active)
    // If another field/modal is active, do nothing
    if (startEditing(editingId)) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative inline w-full" onClick={handleOpen}>
      <EditableModal
        isOpen={isModalOpen}
        className="flex w-[350px] items-center justify-center"
      >
        <div>
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
                stopEditing(editingId);
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
            disabled={!hasDateChanged()}
            className={`mt-6 flex w-full transform items-center justify-center gap-1 rounded-[12px] px-6 py-3.5 text-sm font-medium transition-all duration-200 ${
              hasDateChanged()
                ? "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Salvar Alterações
          </button>
        </div>
      </EditableModal>
    </div>
  );
}
