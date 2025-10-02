interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputName?: string;
  textBlack?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInput: React.FC<CustomInputProps> = (props) => {
  const { label, inputName, id, textBlack, onChange } = props;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        name={inputName}
        onChange={onChange}
        className="w-4 h-4 rounded-[var(--radius-l)] border-[var(--color-white-neutral-light-300)] text-[var(--color-primary-light-400)] focus:ring-[var(--color-primary-light-400)]"
      />
      <label
        htmlFor={inputName}
        className={`text-sm
        ${
          textBlack
            ? "text-white-neutral-light-900"
            : "text-white-neutral-light-500"
        }
          `}
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
