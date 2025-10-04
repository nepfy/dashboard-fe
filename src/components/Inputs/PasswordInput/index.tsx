import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "#/components/Inputs";

type PasswordInputProps = {
  label?: string;
  bgLabel?: boolean;
  info?: boolean;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  disabled?: boolean;
  showInfo?: () => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  bgLabel = false,
  info = false,
  id,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  disabled,
  showInfo,
}) => {
  return (
    <div className="space-y-2 relative">
      <button
        type="button"
        className="absolute right-4 bottom-[34px] z-10 cursor-pointer text-white-neutral-light-800"
        onClick={toggleShowPassword}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff width="20" height="20" />
        ) : (
          <Eye width="20" height="20" />
        )}
      </button>

      <TextField
        label={label}
        bgLabel={bgLabel}
        inputName={id}
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
        info={info}
        onClick={showInfo}
      />
    </div>
  );
};

export default PasswordInput;
