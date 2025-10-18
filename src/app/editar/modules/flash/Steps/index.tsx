"use client";

import Marquee from "react-fast-marquee";
import PlusIcon from "#/components/icons/PlusIcon";
import { StepsSection } from "#/types/template-data";

export default function FlashSteps({
  hideSection,
  topics,
  marquee,
}: StepsSection) {
  return (
    <div className="bg-[#4F21A1]">
      {!hideSection && (
        <>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
            <div className="flex items-end pt-14 lg:pt-30 pl-4 lg:pl-20 border-l border-l-[#A0A0A0] max-w-[340px] lg:max-w-[670px] mb-16 lg:mb-43 mx-auto">
              <p className="text-[32px] lg:text-[72px] text-[#E6E6E6] gap-2">
                Como funciona em{" "}
                <span className="w-[43px] lg:w-[75px] h-[27px] lg:h-[52px] bg-black rounded-full inline-flex items-center justify-center text-[14px] lg:text-2xl align-middle">
                  {topics?.length || 5}
                </span>{" "}
                passos simples
              </p>
            </div>

            {topics?.map((topic, index) => {
              return (
                <div key={topic.id} className="pt-12 cursor-pointer">
                  <div className="flex items-baseline justify-between border-b border-[#A0A0A0]/30 last:border-b-0 w-full pb-6">
                    <span className="flex items-baseline justify-between md:justify-start gap-0 md:gap-24 w-full md:w-auto">
                      <p className="text-[15px] text-[#C085FD]">
                        0{index + 1}.
                      </p>
                      {!topic.hideStepName && (
                        <p
                          className={`text-[24px] lg:text-[36px] transition-colors duration-300 text-[#E6E6E6]`}
                        >
                          {topic.title}
                        </p>
                      )}
                    </span>

                    <button
                      className={`hidden md:block text-[14px] uppercase transition-colors duration-300 text-[#E6E6E6]`}
                    >
                      <span className="flex items-center gap-1">
                        Mais Info
                        <span className={`transition-opacity duration-300`}>
                          <PlusIcon
                            width="12"
                            height="12"
                            fill="rgba(230, 230, 230, 1)"
                          />
                        </span>
                      </span>
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out "max-h-96 opacity-100`}
                  >
                    <p className="text-[16px] text-[#E6E6E6] pl-15 md:pl-30 pt-6 pb-0 md:pb-10">
                      {topic.description}
                    </p>
                  </div>

                  <button
                    className={`flex justify-end md:hidden text-[14px] uppercase my-10 w-full transition-colors duration-300 ext-[#E6E6E6]`}
                  >
                    <span className="flex items-center gap-1">
                      Mais Info
                      <span className={`transition-opacity duration-300`}>
                        <PlusIcon
                          width="12"
                          height="12"
                          fill="rgba(230, 230, 230, 1)"
                        />
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Marquee speed={100} gradientWidth={0} autoFill>
              {marquee?.map((item) => (
                <div key={item.id} className="mr-8">
                  {!item.hideItem && (
                    <p className="text-[#E6E6E6] text-[171px]">{item.text}</p>
                  )}
                </div>
              ))}
            </Marquee>
          </div>
        </>
      )}
    </div>
  );
}
