import QuestionIcon from "#/components/icons/QuestionIcon";

interface CustomTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | React.ReactNode;
  textareaName?: string;
  infoText?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInfoClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  info?: boolean;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  rows?: number;
}

// Custom resize icon component
const ResizeIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className="opacity-50 hover:opacity-75 transition-opacity"
  >
    <path
      d="M10 2L2 10M6 2L2 6M10 6L6 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TextArea: React.FC<CustomTextAreaProps> = (props) => {
  const {
    label,
    textareaName,
    id,
    placeholder,
    value,
    infoText,
    error,
    onChange,
    onBlur,
    onInfoClick,
    disabled,
    info,
    maxLength,
    minLength,
    showCharCount = false,
    rows = 4,
  } = props;

  const currentLength = typeof value === "string" ? value.length : 0;
  const isNearLimit = maxLength ? currentLength >= maxLength - 2 : false;

  return (
    <div className="block w-full">
      <label
        htmlFor={textareaName}
        className="text-[var(--color-white-neutral-light-700)] text-sm font-medium flex items-center justify-between"
      >
        {label}
        {info && (
          <div onClick={onInfoClick}>
            <QuestionIcon className="cursor-pointer" fill="#8B8895" />
          </div>
        )}
      </label>

      <div className="relative">
        <textarea
          disabled={disabled}
          id={id}
          name={textareaName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          rows={rows}
          style={{
            resize: "none", // Hide default resize handle
          }}
          className={`w-full px-4 py-3 mt-1.5 rounded-xs 
                      border bg-white-neutral-light-100
                    placeholder:text-[var(--color-white-neutral-light-400)] 
                      focus:outline-none pr-8
          ${disabled ? "opacity-50" : "text-white-neutral-light-800"}
          ${
            error
              ? "border-red-700"
              : "focus:border-[var(--color-primary-light-400)] border-white-neutral-light-300"
          }
          `}
        />

        {/* Custom resize handle */}
        <div
          className="absolute bottom-1 right-1 w-4 h-4 cursor-ns-resize flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            const textarea = e.currentTarget
              .previousElementSibling as HTMLTextAreaElement;
            const startY = e.clientY;
            const startHeight = parseInt(getComputedStyle(textarea).height, 10);

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const newHeight = startHeight + (moveEvent.clientY - startY);
              if (newHeight > 60) {
                // Minimum height
                textarea.style.height = `${newHeight}px`;
              }
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          <ResizeIcon />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {infoText && (
          <div className="text-gray-500 rounded-md text-xs">{infoText}</div>
        )}
        {error && (
          <div className="text-red-700 rounded-md text-sm font-medium">
            {error}
          </div>
        )}
        {showCharCount && maxLength && (
          <div
            className={`text-xs ml-auto ${
              isNearLimit ? "text-red-500" : "text-white-neutral-light-500"
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

export default TextArea;
