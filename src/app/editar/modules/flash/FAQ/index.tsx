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
import { getHeroGradientColors } from "#/helpers/colorUtils";

export default function FlashFAQ({
  hideSection,
  items,
  mainColor,
}: FAQSection) {
  const { updateFAQItem, reorderFAQItems, activeEditingId } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  // Generate gradient colors for the FAQ background
  const defaultColor = mainColor || "#4F21A1";
  const colors = getHeroGradientColors(defaultColor);
  const gradientString = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${colors.dark} 34.22%, ${defaultColor} 64.9%, ${colors.light} 81.78%)`;

  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="relative z-1 mx-auto max-w-[1440px] px-6 pt-10 pb-23 lg:px-41 lg:pt-22 xl:pb-36">
          <p className="max-w-[1055px] pb-21 text-[32px] font-normal text-[#E6E6E6] lg:text-[72px]">
            Perguntas
            <br /> Frequentes
          </p>
          {items?.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`relative mt-12 rounded-[4px] border border-transparent ${openModalId === item.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : canEdit ? "cursor-pointer border-transparent bg-transparent hover:border-[#0170D6] hover:bg-[#0170D666]" : "cursor-not-allowed border-transparent bg-transparent"}`}
                onClick={() => {
                  if (canEdit || openModalId === item.id) {
                    setOpenModalId(
                      openModalId === item.id ? null : (item?.id ?? null)
                    );
                  }
                }}
              >
                <div className="flex w-full items-baseline justify-between border-b border-[#A0A0A0]/30 pb-6 last:border-b-0">
                  <span className="flex w-full items-baseline justify-between gap-10 md:w-auto md:justify-start md:gap-24">
                    <p className="pr-2 text-[15px] text-[#E6E6E6]/60">
                      0{index + 1}.
                    </p>
                    {!item.hideQuestion && (
                      <p className="text-[18px] font-bold text-[#ffffff] transition-colors duration-300">
                        {item.question}
                      </p>
                    )}
                  </span>

                  <button className="hidden text-[14px] text-[#E6E6E6] uppercase transition-colors duration-300 md:block">
                    <span className="flex items-center gap-1">
                      <span
                        className={`opacity-100 transition-opacity duration-300`}
                      >
                        <MoveDown size={16} />
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

                <EditableImage
                  isModalOpen={openModalId === item.id}
                  setIsModalOpen={(isOpen) =>
                    setOpenModalId(isOpen ? (item?.id ?? null) : null)
                  }
                  editingId={`faq-${item.id}`}
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
            );
          })}
        </div>
      )}
      <div
        className="hidden lg:block"
        style={{
          width: 1148,
          height: 900,
          background: gradientString,
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
          background: gradientString,
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
