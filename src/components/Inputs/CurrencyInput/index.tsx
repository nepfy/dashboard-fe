"use client";

import { useState, useEffect } from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "R$ 0,00",
  className = "",
  error,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Format number to currency display (e.g., "12500" -> "R$ 12.500,00")
  const formatToCurrency = (numValue: string): string => {
    if (!numValue || numValue === "0") return "";

    const number = parseFloat(numValue);
    if (isNaN(number)) return "";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Parse currency display to plain number (e.g., "R$ 12.500,00" -> "12500")
  const parseFromCurrency = (formattedValue: string): string => {
    if (!formattedValue) return "";

    // Remove currency symbols and spaces
    const cleanValue = formattedValue
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "") // Remove thousands separator
      .replace(/,/g, "."); // Replace decimal comma with dot

    const number = parseFloat(cleanValue);
    return isNaN(number) ? "" : number.toString();
  };

  // Initialize display value when component mounts or value changes from outside
  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(value ? formatToCurrency(value) : "");
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setHasError(false);
    // Show raw number when editing
    setDisplayValue(value || "");
  };

  const handleBlur = () => {
    setIsEditing(false);

    // Validate the input
    const parsedValue = parseFromCurrency(displayValue);
    const isValid =
      !displayValue ||
      (!isNaN(parseFloat(parsedValue)) && parseFloat(parsedValue) >= 0);

    if (!isValid) {
      setHasError(true);
      // Reset to previous valid value
      setDisplayValue(formatToCurrency(value));
    } else {
      setHasError(false);
      // Update the value and format display
      onChange(parsedValue);
      setDisplayValue(formatToCurrency(parsedValue));
    }

    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
  };

  const errorMessage = hasError ? "Valor inválido" : error;

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-[210px] rounded-[4px] border bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616] ${
          errorMessage
            ? "border-red-500"
            : "border-[#DBDDDF] focus:border-[#007bff] focus:outline-none"
        } ${className}`}
      />
      {errorMessage && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-500">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CurrencyInput;
