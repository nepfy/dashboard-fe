/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  value?: string | string[];
  onChange?: (tags: string[]) => void;
  infoText?: string;
  error?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  placeholder,
  value = "",
  onChange,
  infoText,
  error,
  disabled,
}) => {
  const getTagArray = (): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      return value
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [];
  };

  const [tags, setTags] = useState<string[]>(getTagArray());
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update tags when value prop changes
  useEffect(() => {
    setTags(getTagArray());
  }, [value]);

  const addtag = (tag: string) => {
    const trimmedtag = tag.trim();
    if (trimmedtag && !tags.includes(trimmedtag)) {
      const newtags = [...tags, trimmedtag];
      setTags(newtags);
      onChange?.(newtags);
    }
  };

  const removetag = (indexToRemove: number) => {
    const newtags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newtags);
    onChange?.(newtags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check if user typed semicolon
    if (value.includes(";")) {
      const parts = value.split(";");
      const tagToAdd = parts[0];
      const remainingInput = parts.slice(1).join(";");

      if (tagToAdd.trim()) {
        addtag(tagToAdd);
      }

      setInputValue(remainingInput);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    switch (key) {
      case "Tab":
        e.preventDefault();
        if (inputValue.trim()) {
          addtag(inputValue);
          setInputValue("");
        }
        break;

      case "Enter":
        e.preventDefault();
        if (inputValue.trim()) {
          addtag(inputValue);
          setInputValue("");
        }
        break;

      case "Backspace":
        if (!inputValue && tags.length > 0) {
          // Remove last tag if input is empty
          removetag(tags.length - 1);
        }
        break;

      case "ArrowLeft":
        if (!inputValue && tags.length > 0) {
          e.preventDefault();
          setFocusedIndex(tags.length - 1);
        } else if (focusedIndex !== null && focusedIndex > 0) {
          e.preventDefault();
          setFocusedIndex(focusedIndex - 1);
        }
        break;

      case "ArrowRight":
        if (focusedIndex !== null) {
          e.preventDefault();
          if (focusedIndex < tags.length - 1) {
            setFocusedIndex(focusedIndex + 1);
          } else {
            setFocusedIndex(null);
            inputRef.current?.focus();
          }
        }
        break;

      case "Delete":
        if (focusedIndex !== null) {
          removetag(focusedIndex);
          if (focusedIndex >= tags.length - 1) {
            setFocusedIndex(null);
            inputRef.current?.focus();
          }
        }
        break;
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setFocusedIndex(null);
  };

  const handleTagClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedIndex(index);
  };

  return (
    <div className="block w-full">
      <label
        htmlFor="tags-input"
        className="text-white-neutral-light-700 text-sm font-medium block mb-1.5"
      >
        {label}
      </label>

      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`w-full min-h-[48px] px-3 py-2 mt-1.5 rounded-xs  bg-white-neutral-light-100  cursor-text flex flex-wrap gap-2 items-center 
          ${
            error
              ? "border border-red-700"
              : "border border-white-neutral-light-300 focus-within:border-primary-light-400"
          }`}
      >
        {/* Render tag */}
        {tags.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            onClick={(e) => handleTagClick(index, e)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              focusedIndex === index
                ? "bg-white-neutral-light-300 text-white-neutral-light-800 ring-2 ring-primary-light-300"
                : "bg-white-neutral-light-200 text-white-neutral-light-800 hover:bg-white-neutral-light-300"
            }`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removetag(index);
              }}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-light-200 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          id="tags-input"
          placeholder={tags.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none  text-white-neutral-light-800 placeholder:text-white-neutral-light-400"
          onFocus={() => setFocusedIndex(null)}
          disabled={disabled}
        />
      </div>

      {infoText && (
        <div className="text-gray-500 rounded-md text-xs mt-2">{infoText}</div>
      )}
      {error && (
        <div className="text-red-700 rounded-md text-sm font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default TagInput;
