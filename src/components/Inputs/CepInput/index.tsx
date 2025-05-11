import React from "react";
import { Search, Loader2 } from "lucide-react";

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
        className="text-[var(--color-white-neutral-light-700)] text-sm font-medium"
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
          className={`w-full px-4 py-3 pr-10 rounded-[var(--radius-s)] 
          border border-white-neutral-light-300 bg-white-neutral-light-100
          placeholder:text-[var(--color-white-neutral-light-400)] 
          focus:outline-none focus:border-[var(--color-primary-light-400)]
          ${
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
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full
            ${
              !disabled && !isSearching && value
                ? "text-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-10)] cursor-pointer"
                : "text-[var(--color-white-neutral-light-400)] cursor-not-allowed"
            }`}
          aria-label="Buscar CEP"
        >
          {isSearching ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-700 rounded-md mt-2 text-sm font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default CepInput;
