import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";
import type { HeroProps } from "./intro-section";

export default function Hero({ pageTitle, createdAt }: HeroProps) {
  return (
    <div className="w-full flex flex-col items-center mt-22 lg:mt-60 mb-40">
      <div>
        <h1 className="text-white-neutral-light-100 font-normal text-4xl lg:text-7xl max-w-[1120px] lg:leading-8xl">
          {pageTitle}
        </h1>
        <p className="text-white-neutral-light-100 font-bold text-xs mt-6">
          Proposta{" "}
          {createdAt ? formatDateToDDMonYYYY(createdAt.toString()) : ""}
        </p>
      </div>
    </div>
  );
}
