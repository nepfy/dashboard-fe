import { CircleX } from "lucide-react";

interface ErrorMessageProps {
  error?: string | null;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className="flex flex-row justify-center items-center gap-2 h-[80px] text-red-500 font-medium text-base border border-red-500 bg-red-100 rounded-2xs">
      <CircleX /> {error}
    </p>
  );
}
