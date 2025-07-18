import { LoaderCircle } from "lucide-react";

export default function ProjectLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <LoaderCircle className="h-6 w-6 animate-spin" />
        <span>Carregando...</span>
      </div>
    </div>
  );
}
