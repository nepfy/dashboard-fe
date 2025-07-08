import QuestionIcon from "#/components/icons/QuestionIcon";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputName?: string;
  infoText?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  info?: boolean;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  allowOverText?: boolean;
}

const TextField: React.FC<CustomInputProps> = (props) => {
  const {
    label,
    inputName,
    id,
    type,
    placeholder,
    value,
    infoText,
    error,
    onChange,
    onBlur,
    onClick,
    disabled,
    info,
    maxLength,
    minLength,
    showCharCount = false,
    allowOverText = false,
  } = props;

  const currentLength = typeof value === "string" ? value.length : 0;
  const isNearLimit = maxLength ? currentLength >= maxLength - 2 : false;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  const renderTextWithOverflow = () => {
    if (!allowOverText || !maxLength || !value || typeof value !== "string") {
      return null;
    }

    if (currentLength <= maxLength) {
      return null;
    }

    const normalText = value.substring(0, maxLength);
    const overflowText = value.substring(maxLength);

    return (
      <div className="absolute inset-0 px-4 py-3 pointer-events-none flex items-center">
        <span className="text-white-neutral-light-800">{normalText}</span>
        <span className="text-red-500 font-medium">{overflowText}</span>
      </div>
    );
  };

  return (
    <div className="block w-full">
      <label
        htmlFor={inputName}
        className="text-[var(--color-white-neutral-light-700)] text-sm font-medium flex items-center justify-between"
      >
        {label}
        {info && (
          <div onClick={onClick}>
            <QuestionIcon className="cursor-pointer" fill="#8B8895" />
          </div>
        )}
      </label>

      <div className="relative">
        <input
          disabled={disabled}
          type={type}
          id={id}
          name={inputName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={allowOverText ? undefined : maxLength}
          className={`w-full px-4 py-3 mt-1.5 rounded-[var(--radius-s)] 
                      border bg-white-neutral-light-100
                    placeholder:text-[var(--color-white-neutral-light-400)] 
                      focus:outline-none relative
          ${
            disabled
              ? "opacity-50"
              : allowOverText && isOverLimit
              ? "text-transparent"
              : "text-white-neutral-light-800"
          }
          ${
            error || (allowOverText && isOverLimit)
              ? "border-red-700"
              : "focus:border-[var(--color-primary-light-400)] border-white-neutral-light-300"
          }
          
          `}
        />

        {allowOverText && renderTextWithOverflow()}
      </div>

      <div className="mt-2 flex items-center justify-between">
        {infoText && (
          <div className="text-gray-500 rounded-md text-xs">{infoText}</div>
        )}
        {(error || (allowOverText && isOverLimit)) && (
          <div className="text-red-700 rounded-md text-sm font-medium">
            {error ||
              (allowOverText && isOverLimit
                ? `Texto excede o limite de ${maxLength} caracteres`
                : "")}
          </div>
        )}
        {showCharCount && maxLength && (
          <div
            className={`text-xs ml-auto ${
              isNearLimit || isOverLimit
                ? "text-red-500"
                : "text-white-neutral-light-500"
            }`}
          >
            {currentLength} / {maxLength}{" "}
            <span> {minLength && `(mín. ${minLength} caracteres)`} </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextField;
