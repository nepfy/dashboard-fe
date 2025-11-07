"use client";

import { useState } from "react";
import Marquee from "react-fast-marquee";
import PlusIcon from "#/components/icons/PlusIcon";
import { StepsSection } from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashSteps({
  mainColor,
  hideSection,
  topics,
  marquee,
}: StepsSection) {
  const { updateStepTopic, reorderStepTopics, activeEditingId } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;
  return (
    <div style={{ background: mainColor }}>
      {!hideSection && (
        <>
          <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-10 pb-23 lg:px-41 lg:pt-22 xl:pb-36">
            <div className="mx-auto mb-16 flex max-w-[340px] items-end border-l border-l-[#ffffff]/50 pt-14 pl-4 lg:mb-43 lg:max-w-[670px] lg:pt-30 lg:pl-20">
              <p className="gap-2 text-[32px] text-[#E6E6E6] lg:text-[72px]">
                Como funciona em{" "}
                <span className="inline-flex h-[27px] w-[43px] items-center justify-center rounded-full bg-black align-middle text-[14px] lg:h-[52px] lg:w-[75px] lg:text-[34px]">
                  {topics?.length || 5}
                </span>{" "}
                passos simples
              </p>
            </div>

            {topics?.map((topic, index) => {
              return (
                <div
                  key={topic.id}
                  className={`relative mt-12 rounded-[4px] border border-transparent ${openModalId === topic.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : canEdit ? "cursor-pointer border-transparent bg-transparent hover:border-[#0170D6] hover:bg-[#0170D666]" : "cursor-not-allowed border-transparent bg-transparent"}`}
                  onClick={() => {
                    if (canEdit || openModalId === topic.id) {
                      setOpenModalId(
                        openModalId === topic.id ? null : (topic?.id ?? null)
                      );
                    }
                  }}
                >
                  <div className="flex w-full items-baseline justify-between border-b border-[#A0A0A0]/30 pb-6 last:border-b-0">
                    <span className="flex w-full items-baseline justify-between gap-10 md:w-auto md:justify-start md:gap-24">
                      <p className="text-[15px] text-[#E6E6E6]">
                        0{index + 1}.
                      </p>
                      {!topic.hideStepName && (
                        <p
                          className={`text-[24px] text-[#E6E6E6] transition-colors duration-300 lg:text-[36px]`}
                        >
                          {topic.title}
                        </p>
                      )}
                    </span>

                    <button
                      className={`hidden text-[14px] text-[#E6E6E6] uppercase transition-colors duration-300 md:block`}
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
                    className={`"max-h-96 overflow-hidden opacity-100 transition-all duration-500 ease-in-out`}
                  >
                    <p className="pt-6 pb-0 pl-15 text-[16px] text-[#E6E6E6] md:pb-10 md:pl-30">
                      {topic.description}
                    </p>
                  </div>

                  <button
                    className={`my-10 flex w-full justify-end text-[14px] text-[#E6E6E6] uppercase transition-colors duration-300 md:hidden`}
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

                  {/* EditableImage for step editing */}

                  <EditableImage
                    isModalOpen={openModalId === topic.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (topic?.id ?? null) : null)
                    }
                    editingId={`steps-${topic.id}`}
                    itemType="steps"
                    items={topics || []}
                    currentItemId={topic?.id ?? null}
                    onUpdateItem={updateStepTopic}
                    onReorderItems={reorderStepTopics}
                  />
                  <div
                    className={`absolute top-0 left-0 z-10 h-full w-full rounded-[4px] hover:bg-[#0170D666] ${openModalId === topic.id ? "bg-[#0170D666]" : "bg-transparent"}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Marquee speed={0} gradientWidth={0} autoFill>
              {marquee?.map((item) => (
                <div key={item.id} className="mr-8">
                  {!item.hideItem && (
                    <p className="text-[171px] text-[#E6E6E6]">{item.text}</p>
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
