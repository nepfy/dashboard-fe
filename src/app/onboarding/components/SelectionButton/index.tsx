import { useFormContext } from "#/app/onboarding/helpers/FormContext";

interface SelectionButtonProps {
  option: string | { id: string; name: string };
  fieldName: string;
  isMultiSelect?: boolean;
  checkmark?: boolean;
  onClick?: () => void;
  otherOption?: boolean;
}

interface formDataProps {
  fullName: string;
  cpf: string;
  phone: string;
  jobType: string[];
  discoverySource: string[];
  usedBefore: string;
}

const SelectionButton = ({
  option,
  fieldName,
  isMultiSelect = true,
  checkmark = true,
  onClick,
  otherOption,
}: SelectionButtonProps) => {
  const { formData, handleMultiSelect, handleSingleSelect } = useFormContext();

  const optionValue = typeof option === "object" ? option.id : option;
  const optionLabel = typeof option === "object" ? option.name : option;

  const selectedValues = formData[fieldName as keyof formDataProps] as
    | string
    | string[];
  const isSelected = Array.isArray(selectedValues)
    ? selectedValues.includes(optionValue)
    : selectedValues === optionValue;

  const handleSelect = isMultiSelect
    ? () => handleMultiSelect(fieldName as keyof formDataProps, optionValue)
    : () => handleSingleSelect(fieldName as keyof formDataProps, optionValue);

  const combinedHandler = () => {
    handleSelect();
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      onClick={combinedHandler}
      className={`py-4 px-6 text-center border rounded-2xs bg-white-neutral-light-100 border-white-neutral-light-300 flex items-center justify-center
        ${
          isSelected
            ? "shadow-sm bg-white-neutral-light-200 border-white-neutral-light-300"
            : "border-gray-300 hover:border-gray-400"
        }
      ${otherOption && optionLabel === "Outro..." ? "hidden" : ""}`}
    >
      {isSelected && checkmark && (
        <span className="mr-2 text-indigo-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
      {optionLabel}
    </button>
  );
};

export default SelectionButton;
