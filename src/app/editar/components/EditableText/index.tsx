"use client";

import React, { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  placeholder?: string;
}

export default function EditableText({
  value,
  onChange,
  className = "",
  placeholder = "",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

      // Auto-resize to fit content
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (localValue.trim() !== value) {
      onChange(localValue.trim());
    }
    setIsEditing(false);
    setIsHovered(false); // Reset hover state
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
      setIsHovered(false); // Reset hover state on escape
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleMouseEnter = () => {
    if (!isEditing) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} inline-block resize-none overflow-hidden border border-[#0170D6] bg-transparent outline-none`}
        style={{
          height: "auto",
          minHeight: "1.2em",
          display: "inline-block",
          verticalAlign: "baseline",
        }}
        rows={1}
      />
    );
  }

  return (
    <p
      className={`${className} cursor-pointer transition-all duration-200 ${
        isHovered && !isEditing
          ? "border border-[#0170D6] bg-[#0170D666]"
          : "border border-transparent bg-transparent"
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {value
        ? value.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < value.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))
        : placeholder}
    </p>
  );
}
