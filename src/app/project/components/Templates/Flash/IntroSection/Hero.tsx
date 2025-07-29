import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";
import type { HeroProps } from "./intro-section";

export default function Hero({
  pageTitle,
  createdAt,
  isSmallHeight = false,
}: HeroProps) {
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
    <div
      className={`w-full flex flex-col items-center ${
        isSmallHeight ? "mt-8 mb-8" : "mt-22 lg:mt-55 mb-20"
      }`}
    >
      <div id="intro-title-container" className="overflow-hidden">
        <h1
          id="intro-title"
          className={`text-white-neutral-light-100 font-normal max-w-[1120px] lg:leading-8xl relative ${
            isSmallHeight ? "text-2xl" : "text-4xl lg:text-7xl"
          }`}
        >
          {pageTitle}
        </h1>
        <p
          id="intro-validity"
          className={`text-white-neutral-light-100 font-bold text-xs opacity-50 ${
            isSmallHeight ? "mt-4" : "mt-6"
          }`}
        >
          Proposta {formatCreatedAt()}
        </p>
      </div>
    </div>
  );
}
