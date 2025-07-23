import Image from "next/image";
import { formatCurrency } from "#/helpers";
import type {
  CompleteProjectData,
  ProjectResult,
} from "#/app/project/types/project";

interface ResultsSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function ResultsSectionPreview({
  data,
}: ResultsSectionPreviewProps) {
  const resultList = data?.results || [];
  const sortedResultList = [...resultList].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedResultList.length;

  const renderMember = (result: ProjectResult, index: number) => (
    <div
      key={result?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform"
    >
      <div className="relative w-full aspect-[453/321] overflow-hidden">
        {(result?.photo || !result.hidePhoto) && (
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
                background:
                  "radial-gradient(80.39% 90.37% at 54.56% 1.78%, rgba(0, 0, 0, 0) 20%, #000000 120%)",
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-4 lg:ml-10 text-white">
        <h3 className="text-lg font-medium">{result?.client}</h3>
        <p className="text-lg font-medium text-[#A0A0A0] mb-6">
          @{result?.subtitle}
        </p>

        <p className="text-lg font-medium">Investimento</p>
        <p className="text-lg font-medium text-[#A0A0A0] mb-4">
          {result?.investment ? formatCurrency(result.investment) : ""}
        </p>

        <p className="text-lg font-medium">Retorno</p>
        <p className="text-lg font-medium text-[#A0A0A0]">
          {result?.roi ? formatCurrency(result.roi) : ""}
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (memberCount === 0) {
      return <div className="w-full flex justify-center" />;
    }

    if (memberCount === 1) {
      return (
        <div className="w-full flex justify-start">
          <div className="max-w-[670px] w-full">
            {sortedResultList[0] && renderMember(sortedResultList[0], 0)}
          </div>
        </div>
      );
    }

    if (memberCount === 2) {
      return (
        <div className="w-full grid grid-cols-2 gap-6">
          {sortedResultList.map((member, index) => renderMember(member, index))}
        </div>
      );
    }

    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResultList.map((member, index) => (
          <div key={member?.id || index}>{renderMember(member, index)}</div>
        ))}
      </div>
    );
  };

  return (
    <>
      {!data?.hideResultsSection && memberCount > 0 && (
        <div className="w-full pt-50 lg:pt-100 px-6 mb-50 lg:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
            <p className="text-white text-sm font-semibold">
              Nossos resultados
            </p>
          </div>

          {renderContent()}
        </div>
      )}
    </>
  );
}
