import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "#/components/Inputs";

type PasswordInputProps = {
  label?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  disabled?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  disabled,
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
        inputName={id}
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};

export default PasswordInput;
