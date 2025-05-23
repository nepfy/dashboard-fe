import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Type definitions
interface SelectOption {
  value: string;
  label: string | React.ReactNode;
}

interface SelectInputProps {
  options?: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options = [],
  placeholder = "Selecione uma opção",
  value = "",
  onChange = () => {},
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: SelectOption): void => {
    setSelectedValue(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option: SelectOption) => option.value === selectedValue
  );

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative w-full h-full bg-white border border-white-neutral-light-300 rounded-2xs shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <span className="block truncate text-gray-900">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Arrow Icon */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-white-neutral-light-300 ring-opacity-5 overflow-auto focus:outline-none animate-in fade-in-0 zoom-in-95 duration-200">
          {options.map((option: SelectOption) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors duration-150 ${
                selectedValue === option.value
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-900"
              }`}
            >
              <span className="block truncate">{option.label}</span>

              {/* Checkmark for selected option */}
              {selectedValue === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
