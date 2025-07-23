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
  showCharCount?: boolean;
  charCountMessage?: string; // New prop for custom char count message
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
    showCharCount = false,
    charCountMessage,
  } = props;

  const currentLength = typeof value === "string" ? value.length : 0;

  // Determinar qual mensagem de erro mostrar
  const errorMessage = error || "";

  return (
    <div className="block w-full overflow-hidden">
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
          className={`w-full px-4 py-3 mt-1.5 rounded-[var(--radius-s)] 
                      border bg-white-neutral-light-100
                    placeholder:text-[var(--color-white-neutral-light-400)] 
                      focus:outline-none relative
          ${disabled ? "opacity-50" : "text-white-neutral-light-800"}
          ${
            errorMessage
              ? "border-red-700"
              : "focus:border-[var(--color-primary-light-400)] border-white-neutral-light-300"
          }
          `}
        />
      </div>

      {/* Container para informações inferiores com layout flexível */}
      <div className="mt-2 min-h-[20px]">
        {/* Primeira linha: infoText ou errorMessage */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {infoText && !errorMessage && (
              <div className="text-gray-500 rounded-md text-xs">{infoText}</div>
            )}

            {errorMessage && (
              <div className="text-red-700 rounded-md text-sm font-medium">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Custom char count message if provided */}
          {showCharCount && (
            <div className="text-xs flex-shrink-0 ml-2 flex items-center justify-center gap-1 text-white-neutral-light-500">
              {charCountMessage || `${currentLength} caracteres`}
            </div>
          )}
        </div>

        {/* Segunda linha: infoText quando há erro (para não sobrepor) */}
        {infoText && errorMessage && (
          <div className="text-gray-500 rounded-md text-xs mt-1">
            {infoText}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextField;
