import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "#/components/Inputs";

type PasswordInputProps = {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}) => {
  return (
    <div className="space-y-2 relative">
      <button
        type="button"
        className="absolute right-4 bottom-2"
        onClick={toggleShowPassword}
        tabIndex={-1}
      >
        {showPassword ? (
          <Eye width="20" height="20" />
        ) : (
          <EyeOff width="20" height="20" />
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
      />
    </div>
  );
};

export default PasswordInput;
