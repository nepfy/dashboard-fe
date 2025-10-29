"use client";

import { useState } from "react";
import { MoveDown } from "lucide-react";
import {
  FAQSection,
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
} from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashFAQ({ hideSection, items }: FAQSection) {
  const { updateFAQItem, reorderFAQItems } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-10 pb-23 lg:px-41 lg:pt-22 xl:pb-36">
          <p className="max-w-[1055px] pb-21 text-[32px] font-normal text-[#E6E6E6] lg:text-[72px]">
            Perguntas
            <br /> Frequentes
          </p>
          {items?.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`relative mt-12 cursor-pointer rounded-[4px] border border-transparent hover:border-[#0170D6] hover:bg-[#0170D666] ${openModalId === item.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : "cursor-pointer border-transparent bg-transparent"}`}
                onClick={() =>
                  setOpenModalId(
                    openModalId === item.id ? null : (item?.id ?? null)
                  )
                }
              >
                <div className="flex w-full items-baseline justify-between border-b border-[#A0A0A0]/30 pb-6 last:border-b-0">
                  <span className="flex w-full items-baseline justify-between gap-10 md:w-auto md:justify-start md:gap-24">
                    <p className="pr-2 text-[15px] text-[#E6E6E6]">
                      0{index + 1}.
                    </p>
                    {!item.hideQuestion && (
                      <p className="text-[18px] text-[#E6E6E6] transition-colors duration-300">
                        {item.question}
                      </p>
                    )}
                  </span>

                  <button className="hidden text-[14px] text-[#E6E6E6] uppercase transition-colors duration-300 md:block">
                    <span className="flex items-center gap-1">
                      Expandir
                      <span
                        className={`opacity-100 transition-opacity duration-300`}
                      >
                        <MoveDown size={12} />
                      </span>
                    </span>
                  </button>
                </div>

                <div
                  className={`max-h-96 overflow-hidden opacity-100 transition-all duration-500 ease-in-out`}
                >
                  <p className="pt-6 pb-0 pl-0 text-[16px] text-[#E6E6E6] md:pb-10 md:pl-30">
                    {item.answer}
                  </p>
                </div>

                <button className="my-10 flex w-full justify-end text-[14px] text-[#E6E6E6] uppercase transition-colors duration-300 md:hidden">
                  <span className="flex items-center gap-1">
                    Expandir
                    <span className="opacity-100 transition-opacity duration-300">
                      <MoveDown size={12} />
                    </span>
                  </span>
                </button>

                {/* EditableImage for FAQ editing */}
                <div>
                  <EditableImage
                    isModalOpen={openModalId === item.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (item?.id ?? null) : null)
                    }
                    itemType="faq"
                    items={items || []}
                    currentItemId={item?.id ?? null}
                    onUpdateItem={updateFAQItem}
                    onReorderItems={
                      reorderFAQItems as (
                        items: (
                          | TeamMember
                          | Result
                          | ExpertiseTopic
                          | Testimonial
                          | StepTopic
                          | FAQItem
                        )[]
                      ) => void
                    }
                  />
                  <div
                    className={`absolute top-0 left-0 z-10 h-full w-full rounded-[4px] hover:bg-[#0170D666] ${openModalId === item.id ? "bg-[#0170D666]" : "bg-transparent"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div
        className="hidden lg:block"
        style={{
          width: 1148,
          height: 900,
          background:
            "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",

          filter: "blur(80px)",
          position: "absolute",
          bottom: -800,
          left: -1200,
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
