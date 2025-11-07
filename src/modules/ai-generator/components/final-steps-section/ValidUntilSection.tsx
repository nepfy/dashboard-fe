import { useMemo, useState } from "react";
import CalendarIcon from "#/components/icons/CalendarIcon";
import { Label } from "#/components/Label";
import { ValidUntilModal } from "#/modules/ai-generator/components/modal/ValidUntilModal";

interface ValidUntilSectionProps {
  validUntil: string;
  setValidUntil: (date: string) => void;
  errors: string;
}

export function ValidUntilSection({
  validUntil,
  setValidUntil,
  errors,
}: ValidUntilSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  const parseValidUntil = (value: string): Date | null => {
    if (!value) {
      return null;
    }

    const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = value.match(isoPattern);

    if (match) {
      const [, year, month, day] = match;
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    const fallbackDate = new Date(value);
    return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
  };

  const formatToIso = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parsedDate = useMemo(() => parseValidUntil(validUntil), [validUntil]);

  const formattedDisplayValue = useMemo(() => {
    if (!parsedDate) {
      return "";
    }
    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [parsedDate]);

  const handleOpenModal = () => {
    setTempSelectedDate(parsedDate);
    setIsModalOpen(true);
  };

  const handleConfirmDate = () => {
    if (tempSelectedDate) {
      setValidUntil(formatToIso(tempSelectedDate));
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setTempSelectedDate(parsedDate);
    setIsModalOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    setTempSelectedDate(new Date(date));
  };

  return (
    <>
      <Label info onClick={handleOpenModal}>
        Qual a validade desta proposta?
      </Label>

      <div className="relative w-full lg:w-1/2">
        <button
          type="button"
          onClick={handleOpenModal}
          className={`bg-white-neutral-light-100 mt-1.5 flex w-full items-center justify-between rounded-[var(--radius-s)] border px-4 py-3 text-left text-sm transition-colors ${
            errors
              ? "border-red-700"
              : "border-white-neutral-light-300 hover:border-[var(--color-primary-light-400)] focus:border-[var(--color-primary-light-400)]"
          }`}
        >
          <span
            className={`${
              formattedDisplayValue
                ? "text-white-neutral-light-800"
                : "text-[var(--color-white-neutral-light-400)]"
            }`}
          >
            {formattedDisplayValue || "Escolha uma data"}
          </span>
          <CalendarIcon width="16" height="16" fill="#8B8895" />
        </button>
        {errors ? (
          <p className="mt-2 text-sm font-medium text-red-700">{errors}</p>
        ) : null}
      </div>

      <ValidUntilModal
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={tempSelectedDate}
        onDateSelect={handleDateSelect}
        onConfirm={handleConfirmDate}
        confirmDisabled={!tempSelectedDate}
      />
    </>
  );
}
