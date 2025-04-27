import { CircleX } from "lucide-react";

interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className="flex flex-row justify-center items-center gap-2 h-[80px] text-red-500 font-medium text-base">
      <CircleX /> {error}
    </p>
  );
}
