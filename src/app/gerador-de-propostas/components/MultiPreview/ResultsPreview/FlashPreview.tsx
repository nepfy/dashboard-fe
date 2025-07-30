import Image from "next/image";
import "./ResultSection.css";
import type {
  CompleteProjectData,
  ProjectResult,
} from "#/app/project/types/project";

interface ResultsSectionProps {
  data?: CompleteProjectData;
}

export default function ResultsSection({ data }: ResultsSectionProps) {
  const results = data?.results || [];
  const sortedResults = [...results].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const resultCount = sortedResults.length;

  const renderResult = (result: ProjectResult, index: number) => (
    <div
      key={result?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform opacity-0 animate-fade-in mr-3"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      {result?.photo && !result?.hidePhoto && (
        <div className="relative w-full aspect-[260/184] overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={result.photo || ""}
              alt={result.client || ""}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              quality={95}
              priority={index < 3}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), radial-gradient(102.39% 96.37% at 54.56% 1.78%, rgba(0, 0, 0, 0) 0%, #000000 100%)`,
              }}
            />
          </div>
        </div>
      )}
      <div>
        <h3 className="text-[10px] font-medium text-[#DFD5E1]">
          {result.client}
        </h3>
        <p className="text-[10px] text-[#A0A0A0] mb-8">@{result.subtitle}</p>
        <p className="text-[10px] text-[#DFD5E1] font-semibold">Investimento</p>
        <h3 className="text-[10px] font-medium text-[#DFD5E1] mb-2">
          {result?.investment}
        </h3>
        <p className="text-[#DFD5E1] text-[10px] font-medium">Retorno</p>
        <p className="text-[10px] font-semibold text-[#DFD5E1]">
          {result?.roi}
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (resultCount === 0) {
      return <div className="w-full flex justify-center" />;
    }

    if (resultCount === 1) {
      return (
        <div className="w-full h-full flex pb-6">
          <div className="max-w-[260px] h-[184px] w-full">
            {sortedResults[0] && renderResult(sortedResults[0], 0)}
          </div>
        </div>
      );
    }

    if (resultCount === 2) {
      return (
        <div className="w-full grid grid-cols-2 pb-6">
          {sortedResults.map((member, index) => renderResult(member, index))}
        </div>
      );
    }

    if (resultCount === 3) {
      return (
        <div className="w-full grid grid-cols-3 pb-6">
          {sortedResults.map((member, index) => renderResult(member, index))}
        </div>
      );
    }

    return (
      <div
        className="w-full grid gap-6 pb-10"
        style={{
          gridTemplateColumns: `repeat(${Math.min(resultCount, 3)}, 1fr)`,
        }}
      >
        {sortedResults.map((member, index) => renderResult(member, index))}
      </div>
    );
  };

  return (
    <>
      {!data?.hideResultsSection && (
        <div className="w-full min-h-full px-6 bg-black flex flex-col justify-center">
          {resultCount > 0 && (
            <div className="flex items-center gap-1 mt-24 mb-4 px-3">
              <div className="bg-white-neutral-light-100 w-2 h-2 rounded-full" />
              <p className="text-[#DFD5E1] text-[10px] font-semibold">
                Nossos resultados
              </p>
            </div>
          )}

          {renderContent()}
        </div>
      )}
    </>
  );
}
