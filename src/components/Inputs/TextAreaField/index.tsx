/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";
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
  showCharCount?: boolean;
  rows?: number;
  autoExpand?: boolean;
  minHeight?: number;
  maxHeight?: number;
  charCountMessage?: string; // New prop for custom char count message
}

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
    showCharCount = false,
    rows = 4,
    autoExpand = false,
    minHeight = 60,
    maxHeight,
    charCountMessage,
    ...rest
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLength = typeof value === "string" ? value.length : 0;

  const adjustHeight = () => {
    if (!autoExpand || !textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    let newHeight = textarea.scrollHeight;
    if (newHeight < minHeight) newHeight = minHeight;
    if (maxHeight && newHeight > maxHeight) newHeight = maxHeight;
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    if (autoExpand) {
      adjustHeight();
    }
  }, [value, autoExpand]);

  useEffect(() => {
    if (autoExpand && textareaRef.current) {
      textareaRef.current.style.minHeight = `${minHeight}px`;
      if (maxHeight) {
        textareaRef.current.style.maxHeight = `${maxHeight}px`;
      }
      adjustHeight();
    }
  }, [autoExpand, minHeight, maxHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (autoExpand) {
      setTimeout(adjustHeight, 0);
    }
  };

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
          {...rest}
          ref={textareaRef}
          disabled={disabled}
          id={id}
          name={textareaName}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          rows={autoExpand ? 1 : rows}
          style={{
            resize: autoExpand ? "none" : "none",
            overflow: autoExpand ? "hidden" : "auto",
            transition: autoExpand ? "height 0.1s ease" : "none",
          }}
          className={`w-full px-4 py-1.5 mt-1.5 rounded-xs 
                      border bg-white-neutral-light-100
                    placeholder:text-[var(--color-white-neutral-light-400)] 
                      focus:outline-none pr-8 relative
          ${disabled ? "opacity-50" : "text-white-neutral-light-800"}
          ${
            error
              ? "border-red-700"
              : "focus:border-[var(--color-primary-light-400)] border-white-neutral-light-300"
          }
          `}
        />

        {!autoExpand && (
          <div
            className="absolute bottom-1 right-1 w-4 h-4 cursor-ns-resize flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              const textarea = textareaRef.current;
              if (!textarea) return;

              const startY = e.clientY;
              const startHeight = parseInt(
                getComputedStyle(textarea).height,
                10
              );

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newHeight = startHeight + (moveEvent.clientY - startY);
                if (newHeight > minHeight) {
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
        )}
      </div>

      <div
        className={`mt-2 flex items-center ${
          error || infoText ? "justify-between" : "justify-end"
        }`}
      >
        {infoText && (
          <div className="text-gray-500 rounded-md text-xs">{infoText}</div>
        )}
        {error && (
          <div className="text-red-700 rounded-md text-sm font-medium">
            {error}
          </div>
        )}
        {showCharCount && (
          <div className="text-xs flex-shrink-0 ml-2 flex items-center justify-center gap-1 text-white-neutral-light-500">
            {charCountMessage || `${currentLength} caracteres`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
