import { useState } from "react";
import Image from "next/image";
import { formatCurrencyDisplay } from "#/helpers/formatCurrency";
import { Result, ResultSection, TeamMember } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashResults({
  mainColor,
  hideSection,
  title,
  items,
}: ResultSection) {
  const {
    updateResults,
    updateResultItem,
    reorderResultItems,
    activeEditingId,
  } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const setColor = mainColor === "#212121" ? "#ffffff" : mainColor;

  console.log(setColor);

  const canEdit = activeEditingId === null;
  return (
    <div className="bg-black">
      {!hideSection && (
        <div className="mx-auto max-w-[1440px] px-6 pt-7 lg:px-12 lg:pt-22 xl:px-0">
          <div className="mx-auto mb-16 flex max-w-[1100px] items-end border-l border-l-[#ffffff]/50 pt-24 pl-5 lg:mb-43 lg:pl-10">
            <EditableText
              value={title || ""}
              onChange={(newTitle: string) =>
                updateResults({ title: newTitle })
              }
              className="text-[32px] text-[#E6E6E6] lg:text-[72px]"
              editingId="results-title"
            />
          </div>
          <div className="px-0 lg:px-0 xl:px-8">
            {/* <div className="mb-4 flex items-center gap-2">
              <div className="bg-white-neutral-light-100 h-3 w-3 rounded-full" />
              <p className="text-sm font-semibold text-white">
                Nossos Resultados
              </p>
            </div> */}

            <div
              className={`mx-auto grid max-w-[1500px] grid-cols-1 gap-4 pb-20 lg:grid-cols-3 lg:pb-100`}
            >
              {items?.map((item) => (
                <div
                  className={`relative mb-20 w-full rounded-[4px] border border-transparent ${openModalId === item.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : canEdit ? "cursor-pointer border-transparent bg-transparent hover:border-[#0170D6] hover:bg-[#0170D666]" : "cursor-not-allowed border-transparent bg-transparent"} `}
                  key={item.id}
                >
                  <div
                    key={item.id}
                    className={`relative flex flex-col items-start ${openModalId === item.id ? "cursor-default" : canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onClick={() => {
                      if (canEdit || openModalId === item.id) {
                        setOpenModalId(
                          openModalId === item.id ? null : (item?.id ?? null)
                        );
                      }
                    }}
                  >
                    {!item.hidePhoto && item?.photo && (
                      <div className="relative h-[26rem] w-full overflow-hidden rounded-[4px]">
                        <div className="relative h-full w-full">
                          <Image
                            src={item.photo || ""}
                            alt={item.client || ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 767px) 100vw, (max-width: 991px) 727.9921875px, 854px"
                            quality={95}
                            priority={(item?.sortOrder ?? 0) < 3}
                          />
                        </div>
                      </div>
                    )}

                    <p className="mt-3 p-0 text-[24px] font-medium text-[#E6E6E6]">
                      {item.client}
                    </p>
                    <p className="text-sm font-normal text-[#A0A0A0]">
                      @{item.instagram}
                    </p>

                    <div className="mt-6 flex gap-12">
                      <span>
                        <p className="text-lg font-semibold text-[#E6E6E6]">
                          Investimento
                        </p>
                        <p className="text-lg font-medium text-[#A0A0A0]">
                          {formatCurrencyDisplay(item.investment ?? 0)}
                        </p>
                      </span>
                      <span>
                        <p className="text-lg font-semibold text-[#E6E6E6]">
                          Retorno
                        </p>
                        <p
                          className={`text-lg font-medium`}
                          style={{ color: setColor }}
                        >
                          {formatCurrencyDisplay(item.roi ?? 0)}
                        </p>
                      </span>
                    </div>

                    <EditableImage
                      isModalOpen={openModalId === item.id}
                      setIsModalOpen={(isOpen) =>
                        setOpenModalId(isOpen ? (item?.id ?? null) : null)
                      }
                      editingId={`results-${item.id}`}
                      itemType="results"
                      items={items || []}
                      currentItemId={item?.id ?? null}
                      onUpdateItem={updateResultItem}
                      onReorderItems={
                        reorderResultItems as (
                          items: TeamMember[] | Result[]
                        ) => void
                      }
                    />
                    <div
                      className={`absolute top-0 left-0 z-10 h-full w-full rounded-[4px] hover:bg-[#0170D666] ${openModalId === item.id ? "bg-[#0170D666]" : "bg-transparent"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
