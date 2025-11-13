"use client";

import { useState, useEffect } from "react";
import { parseCurrencyValue } from "#/helpers/formatCurrency";

interface CurrencyInputProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const formatToCurrency = (inputValue: string | number): string => {
  const normalizedNumber = parseCurrencyValue(inputValue);

  if (normalizedNumber === null) return "";

  return normalizedNumber.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parseFromCurrency = (formattedValue: string): string => {
  const normalizedNumber = parseCurrencyValue(formattedValue);

  return normalizedNumber === null ? "" : normalizedNumber.toString();
};

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

  // Initialize display value when component mounts or value changes from outside
  useEffect(() => {
    if (!isEditing) {
      const formattedValue = formatToCurrency(value);
      setDisplayValue(formattedValue || "");
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setHasError(false);
    // Show raw number when editing
    const rawValue = parseCurrencyValue(value);
    setDisplayValue(
      rawValue === null ? "" : rawValue.toString()
    );
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
