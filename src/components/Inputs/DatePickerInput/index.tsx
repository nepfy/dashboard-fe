/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import QuestionIcon from "#/components/icons/QuestionIcon";

interface DatePickerProps {
  label?: string | React.ReactNode;
  inputName?: string;
  id?: string;
  placeholder?: string;
  value?: string;
  infoText?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  info?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  inputName,
  id,
  placeholder = "Escolha uma data",
  value,
  infoText,
  error,
  onChange,
  onBlur,
  onClick,
  disabled = false,
  info = false,
}) => {
  const [, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [supportsShowPicker, setSupportsShowPicker] = useState<boolean>(true);

  // Mapeamento dos meses em português
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // Converte data ISO para formato brasileiro DD de MMM de YYYY
  const formatDateToBrazilian = (isoDate: string): string => {
    if (!isoDate) return "";

    try {
      const date = new Date(isoDate + "T00:00:00"); // Adiciona hora para evitar problemas de timezone
      const day = date.getDate().toString().padStart(2, "0");
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day} de ${month} de ${year}`;
    } catch {
      return "";
    }
  };

  // Verifica suporte ao método showPicker
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const input = document.createElement("input");
    input.type = "date";
    const supports =
      typeof (input as HTMLInputElement & { showPicker?: () => void })
        .showPicker === "function";
    setSupportsShowPicker(supports);
  }, []);

  // Atualiza o valor exibido quando o value prop muda
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateToBrazilian(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openNativePicker = (): boolean => {
    if (disabled || !dateInputRef.current) {
      return false;
    }

    setIsOpen(true);

    const picker = dateInputRef.current as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (supportsShowPicker && picker.showPicker) {
      picker.showPicker();
    } else {
      picker.focus();
      picker.click();
    }

    return true;
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!openNativePicker()) {
      onClick?.(e);
      return;
    }
    onClick?.(e);
  };

  const handleCalendarClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openNativePicker();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDisplayValue(formatDateToBrazilian(selectedDate));
    setIsOpen(false);
    onChange?.(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayValue("");

    // Cria um evento sintético para o onChange
    const syntheticEvent = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  return (
    <div className="block w-full" ref={containerRef}>
      <label
        htmlFor={inputName}
        className="flex items-center justify-between text-sm font-medium text-[var(--color-white-neutral-light-700)]"
      >
        {label}
        {info && (
          <div onClick={onClick}>
            <QuestionIcon className="cursor-pointer" fill="#8B8895" />
          </div>
        )}
      </label>

      <div className="relative">
        {/* Input visual (que o usuário vê) */}
        <input
          type="text"
          id={id}
          name={inputName}
          placeholder={placeholder}
          value={displayValue}
          onClick={handleInputClick}
          onBlur={onBlur}
          readOnly
          disabled={disabled}
          className={`bg-white-neutral-light-100 mt-1.5 w-full cursor-pointer rounded-[var(--radius-s)] border px-4 py-3 pr-12 placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "text-white-neutral-light-800"
          } ${
            error
              ? "border-red-700"
              : "border-white-neutral-light-300 focus:border-[var(--color-primary-light-400)]"
          } ${supportsShowPicker ? "" : "pointer-events-none"} `}
        />

        {/* Input de data oculto (para funcionalidade nativa) */}
        <input
          ref={dateInputRef}
          type="date"
          value={value || ""}
          onChange={handleDateChange}
          className={`absolute inset-0 h-full w-full opacity-0 ${
            supportsShowPicker ? "pointer-events-none" : "cursor-pointer"
          }`}
          tabIndex={supportsShowPicker ? -1 : 0}
        />

        {/* Ícones do lado direito */}
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center gap-2">
          {displayValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-white-neutral-light-900 hover:text-white-neutral-light-600 transition-colors"
              tabIndex={-1}
            >
              ×
            </button>
          )}
          <Calendar
            size={16}
            role="button"
            aria-label="Abrir seletor de data"
            tabIndex={-1}
            onClick={handleCalendarClick}
            className="text-white-neutral-light-900 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {infoText && (
          <div className="rounded-md text-xs text-gray-500">{infoText}</div>
        )}
        {error && (
          <div className="rounded-md text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
