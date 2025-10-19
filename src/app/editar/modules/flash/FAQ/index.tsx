"use client";

import { MoveDown } from "lucide-react";
import { FAQSection } from "#/types/template-data";

export default function FlashFAQ({ hideSection, items }: FAQSection) {
  return (
    <div className="bg-black relative overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
          <p className="text-[32px] lg:text-[72px] text-[#E6E6E6] max-w-[1055px] pb-21 font-normal">
            Perguntas
            <br /> Frequentes
          </p>
          {items?.map((item, index) => {
            return (
              <div key={item.id} className="pt-12 cursor-pointer">
                <div className="flex items-baseline justify-between border-b border-[#A0A0A0]/30 last:border-b-0 w-full pb-6">
                  <span className="flex items-baseline justify-between md:justify-start gap-10 md:gap-24 w-full md:w-auto">
                    <p className="text-[15px] text-[#E6E6E6] pr-2">
                      0{index + 1}.
                    </p>
                    {!item.hideQuestion && (
                      <p className="text-[18px] transition-colors duration-300 text-[#E6E6E6]">
                        {item.question}
                      </p>
                    )}
                  </span>

                  <button className="hidden md:block text-[14px] uppercase transition-colors duration-300 text-[#E6E6E6]">
                    <span className="flex items-center gap-1">
                      Expandir
                      <span
                        className={`transition-opacity duration-300 opacity-100`}
                      >
                        <MoveDown size={12} />
                      </span>
                    </span>
                  </button>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out max-h-96 opacity-100`}
                >
                  <p className="text-[16px] text-[#E6E6E6] pl-0 md:pl-30 pt-6 pb-0 md:pb-10">
                    {item.answer}
                  </p>
                </div>

                <button className="flex justify-end md:hidden text-[14px] uppercase my-10 w-full transition-colors duration-300 text-[#E6E6E6]">
                  <span className="flex items-center gap-1">
                    Expandir
                    <span className="transition-opacity duration-300 opacity-100">
                      <MoveDown size={12} />
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div
        className="hidden lg:block"
        style={{
          width: 1148,
          height: 1148,
          background:
            "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: "-100%",
          left: "-60%",
          transform: "translateX(50%)",
          right: 0,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />

      <div
        className="sm:hidden"
        style={{
          width: 1400,
          height: 800,
          background:
            "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: "-48%",
          right: "140%",
          transform: "translateX(50%)",
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />
    </div>
  );
}
