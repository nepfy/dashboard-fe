interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  inputName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<CustomInputProps> = (props) => {
  const { label, inputName, id, type, placeholder, value, onChange } = props;

  return (
    <div className="block w-full">
      <label
        htmlFor={inputName}
        className="text-[var(--color-white-neutral-light-700)] text-sm font-medium"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={inputName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 mt-1.5 rounded-[var(--radius-s)] border border-[var(--color-white-neutral-light-300)] bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] placeholder:text-[var(--color-white-neutral-light-400)] focus:outline-none focus:border-[var(--color-primary-light-400)]"
      />
    </div>
  );
};

export default TextField;
