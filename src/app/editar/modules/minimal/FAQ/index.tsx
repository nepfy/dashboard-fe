"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const { updateFAQItem, reorderFAQItems, activeEditingId } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="px-10">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-40 flex flex-col gap-2">
              {items?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col rounded-lg border border-transparent bg-[#0b0b0b] px-6 py-8 pb-4 ${openModalId === item.id ? "cursor-default border border-[#0170D6] bg-[#0170D666]" : canEdit ? "cursor-pointer hover:bg-[#121212]" : "cursor-not-allowed"}`}
                    onClick={() => {
                      if (canEdit || openModalId === item.id) {
                        setOpenModalId(
                          openModalId === item.id ? null : (item?.id ?? null)
                        );
                      }
                    }}
                  >
                    <div className="flex justify-between">
                      {!item.hideQuestion && (
                        <div className="text-base font-medium text-[#ffffff]">
                          {item.question}
                        </div>
                      )}
                      <div className="h-6 w-6">
                        <ChevronDown
                          size={24}
                          className="h-6 w-6"
                          color="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="max-w-[100ch] overflow-hidden pt-4 opacity-70">
                      <div className="pb-2">
                        <p className="text-base text-[#E6E6E6]">
                          {item.answer}
                        </p>
                      </div>
                    </div>

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
                      className={`absolute top-0 left-0 z-10 h-full w-full rounded-lg ${openModalId === item.id ? "bg-[#0170D666]" : "bg-transparent"}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
