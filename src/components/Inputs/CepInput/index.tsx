import React from "react";
import { Search, LoaderCircle } from "lucide-react";

interface CepInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputName?: string;
  error?: string | null;
  isSearching?: boolean;
  onSearch?: () => void;
  disabled?: boolean;
}

const CepInput: React.FC<CepInputProps> = (props) => {
  const {
    label,
    inputName,
    id,
    type = "text",
    placeholder,
    value,
    error,
    onChange,
    onBlur,
    isSearching = false,
    onSearch,
    disabled,
    ...rest
  } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="block w-full">
      <label
        htmlFor={inputName}
        className="text-sm font-medium text-[var(--color-white-neutral-light-700)]"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          disabled={disabled || isSearching}
          type={type}
          id={id}
          name={inputName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          className={`border-white-neutral-light-300 bg-white-neutral-light-100 w-full rounded-[var(--radius-s)] border px-4 py-3 pr-10 placeholder:text-[var(--color-white-neutral-light-400)] focus:border-[var(--color-primary-light-400)] focus:outline-none ${
            disabled || isSearching
              ? "opacity-50"
              : "text-white-neutral-light-800"
          }`}
          {...rest}
        />

        <button
          type="button"
          onClick={onSearch}
          disabled={disabled || isSearching || !value}
          className={`absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full p-1 ${
            !disabled && !isSearching && value
              ? "cursor-pointer text-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-10)]"
              : "cursor-not-allowed text-[var(--color-white-neutral-light-400)]"
          }`}
          aria-label="Buscar CEP"
        >
          {isSearching ? (
            <LoaderCircle className="text-primary-light-400 animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 rounded-md text-sm font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default CepInput;
