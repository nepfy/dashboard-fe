import QuestionIcon from "#/components/icons/QuestionIcon";

export function Label({
  children,
  htmlFor,
  info,
  onClick,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  info?: boolean;
  onClick?: () => void;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[#1C1C1C] bg-[#E8E2FD4D]/80 text-sm p-3 rounded-[8px] font-medium flex gap-3 justify-between items-center mb-2 border border-[#E8E2FD]"
    >
      {children}
      {info && (
        <div onClick={onClick}>
          <QuestionIcon className="cursor-pointer" fill="#8B8895" />
        </div>
      )}
    </label>
  );
}
