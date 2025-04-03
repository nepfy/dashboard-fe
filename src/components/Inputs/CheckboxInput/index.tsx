interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInput: React.FC<CustomInputProps> = (props) => {
  const { label, inputName, id, onChange } = props;

  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={inputName}
        onChange={onChange}
        className="w-4 h-4 rounded-[var(--radius-l)] border-[var(--color-white-neutral-light-300)] text-[var(--color-primary-light-400)] focus:ring-[var(--color-primary-light-400)]"
      />
      <label
        htmlFor={inputName}
        className="text-sm text-[var(--color-white-neutral-light-500)]"
      >
        {label}
      </label>
    </>
  );
};

export default CheckboxInput;
