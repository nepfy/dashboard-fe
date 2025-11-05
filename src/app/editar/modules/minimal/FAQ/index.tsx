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

export default function MinimalFAQ({
  hideSection,
  items,
  mainColor,
}: FAQSection) {
  const { updateFAQItem, reorderFAQItems } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  return (
    <section className="section_faq">
      {!hideSection && (
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="faq">
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
                    <div className="flex w-full items-baseline justify-between border-b border-gray-200 pb-6 last:border-b-0">
                      <span className="flex w-full items-baseline justify-between gap-10 md:w-auto md:justify-start md:gap-24">
                        <p className="pr-2 text-[15px] text-[#121212]/60">
                          0{index + 1}.
                        </p>
                        {!item.hideQuestion && (
                          <p className="text-[18px] font-bold text-[#121212] transition-colors duration-300">
                            {item.question}
                          </p>
                        )}
                      </span>

                      <button className="hidden text-[14px] text-[#121212] uppercase transition-colors duration-300 md:block">
                        <span className="flex items-center gap-1">
                          <span className="opacity-100 transition-opacity duration-300">
                            <MoveDown size={16} />
                          </span>
                        </span>
                      </button>
                    </div>

                    <div className="max-h-96 overflow-hidden opacity-100 transition-all duration-500 ease-in-out">
                      <p className="pt-6 pb-0 pl-0 text-[16px] text-[#121212] md:pb-10 md:pl-30">
                        {item.answer}
                      </p>
                    </div>

                    <button className="my-10 flex w-full justify-end text-[14px] text-[#121212] uppercase transition-colors duration-300 md:hidden">
                      <span className="flex items-center gap-1">
                        Expandir
                        <span className="opacity-100 transition-opacity duration-300">
                          <MoveDown size={12} />
                        </span>
                      </span>
                    </button>

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
          </div>
        </div>
      )}
    </section>
  );
}

