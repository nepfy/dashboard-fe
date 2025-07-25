import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";
import type { HeroProps } from "./intro-section";

export default function Hero({ pageTitle, createdAt }: HeroProps) {
  const formatCreatedAt = () => {
    if (!createdAt) return "";

    if (createdAt instanceof Date) {
      return formatDateToDDMonYYYY(createdAt.toISOString().split("T")[0]);
    }

    if (typeof createdAt === "string") {
      if (createdAt.includes("T")) {
        return formatDateToDDMonYYYY(createdAt.split("T")[0]);
      }
      return formatDateToDDMonYYYY(createdAt);
    }

    return "";
  };

  return (
    <div className="w-full flex flex-col items-center mt-22 lg:mt-55 mb-20">
      <div>
        <h1 className="text-white-neutral-light-100 font-normal text-4xl lg:text-7xl max-w-[1120px] lg:leading-8xl">
          {pageTitle}
        </h1>
        <p className="text-[#DFD5E1] font-bold text-xs mt-6">
          Proposta {formatCreatedAt()}
        </p>
      </div>
    </div>
  );
}
