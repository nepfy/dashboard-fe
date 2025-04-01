"use client";

import { useEffect } from "react";

interface Custom500Props {
  error: {
    message?: string;
  };
}

export default function Custom500({ error }: Custom500Props) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">Algo deu errado</h1>
      <p className="mt-4 text-gray-700">{error?.message}</p>
    </div>
  );
}
