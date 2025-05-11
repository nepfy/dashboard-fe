import InfoIcon from "#/components/icons/InfoIcon";

interface SuccessMessageProps {
  message?: string | null;
}

export default function ErrorMessage({ message }: SuccessMessageProps) {
  return (
    <p className="p-3 flex justify-center items-center gap-2 h-[80px] rounded-2xs border border-secondary-light-100 bg-secondary-light-10 text-secondary-light-400">
      <InfoIcon width="18" height="18" fill="#7bae1d" /> {message}
    </p>
  );
}
