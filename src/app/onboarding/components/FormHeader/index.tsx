interface FormHeaderProps {
  title?: string;
  description?: string;
}

export default function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-[32px] font-bold text-[var(--color-white-neutral-light-800)] text-center sm:pt-6">
        {title}
      </h2>
      <p className="text-[var(--color-white-neutral-light-500)] text-center">
        {description}
      </p>
    </div>
  );
}
