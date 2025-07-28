import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../TeamSection/TeamSection.css";
import { formatCurrency } from "#/helpers";
import type {
  CompleteProjectData,
  ProjectResult,
} from "#/app/project/types/project";

interface ResultsSectionProps {
  data?: CompleteProjectData;
}

interface CustomArrowProps {
  onClick?: () => void;
}

function CustomArrowLeft(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="w-10 h-10 absolute left-0 top-40 -translate-y-1/2 text-black -z-10 bg-white-neutral-light-100 rounded-full flex items-center justify-center cursor-pointer"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      <ArrowLeft size={14} />
    </button>
  );
}

function CustomArrowRight(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="w-10 h-10 absolute right-4 top-40 -translate-y-1/2 text-black -z-10 bg-white-neutral-light-100 rounded-full flex items-center justify-center cursor-pointer"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      <ArrowRight size={14} />
    </button>
  );
}

export default function ResultsSection({ data }: ResultsSectionProps) {
  const sliderRef = useRef<Slider>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const resultList = data?.results || [];
  const sortedResultList = [...resultList].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
  const memberCount = sortedResultList.length;

  const sliderSettings = {
    dots: isMobile,
    customPaging: () => (
      <div className="rounded-full w-2 h-2">
        <div
          className="bg-white rounded-full w-2 h-2 mt-20"
          style={{
            backgroundColor: data?.mainColor || "#FFFFFF",
          }}
        />
      </div>
    ),
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000,
    speed: 3000,
    slidesToShow: isMobile ? 1 : Math.min(3, memberCount),
    slidesToScroll: 1,
    arrows: false,
    nextArrow: <CustomArrowRight />,
    prevArrow: <CustomArrowLeft />,
  };

  const renderMember = (result: ProjectResult, index: number) => (
    <div
      key={result?.id || index}
      className="flex flex-col transition-all duration-500 ease-in-out transform opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
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
      <div className="w-full team-slider">
        <Slider ref={sliderRef} {...sliderSettings} className="relative">
          {sortedResultList.map((member, index) => (
            <div key={member?.id || index} className="px-2">
              {renderMember(member, index)}
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      {!data?.hideResultsSection && (
        <div
          id="results"
          className="w-full max-w-[1440px] mx-auto pt-50 lg:pt-100 px-6 mb-50 lg:mb-62"
        >
          {memberCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
              <p className="text-white text-sm font-semibold">
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
