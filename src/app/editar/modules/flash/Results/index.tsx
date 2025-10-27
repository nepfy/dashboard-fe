import { useState } from "react";
import Image from "next/image";
import { formatCurrencyDisplay } from "#/helpers/formatCurrency";
import { Result, ResultSection, TeamMember } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashResults({
  hideSection,
  title,
  items,
}: ResultSection) {
  const { updateResults, updateResultItem, addResultItem, reorderResultItems } =
    useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const visibleResults = items?.filter(
    (result) => !result.hidePhoto && result.photo
  );
  const resultCount = visibleResults?.length;

  const getPhotoDimensions = () => {
    // Desktop/Tablet dimensions
    const desktopDimensions = {
      2: { width: 500, height: 410 },
      3: { width: 430, height: 340 },
      4: { width: 500, height: 410 },
      5: { width: 430, height: 340 },
      6: { width: 430, height: 340 },
    }[resultCount || 0] || { width: 430, height: 340 }; // default

    return {
      desktop: desktopDimensions,
      mobile: { width: 300, height: 435 },
    };
  };

  const dimensions = getPhotoDimensions();
  return (
    <div className="overflow-hidden bg-black">
      {!hideSection && (
        <div className="mx-auto max-w-[1440px] px-6 pt-7 lg:px-12 lg:pt-22 xl:px-0">
          <div className="mx-auto mb-16 flex max-w-[1100px] items-end border-l border-l-[#A0A0A0] pt-24 pl-5 lg:mb-43 lg:pl-10">
            <EditableText
              value={title || ""}
              onChange={(newTitle: string) =>
                updateResults({ title: newTitle })
              }
              className="text-[32px] text-[#E6E6E6] lg:text-[72px]"
            />
          </div>
          <div className="px-0 lg:px-0 xl:px-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-white-neutral-light-100 h-3 w-3 rounded-full" />
              <p className="text-sm font-semibold text-white">
                Nossos Resultados
              </p>
            </div>

            <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-start gap-3 pb-30 sm:justify-center lg:justify-start">
              {items?.map((item) => (
                <div
                  key={item.id}
                  className="mb-20 flex cursor-pointer flex-col items-start"
                  onClick={() => setOpenModalId(item?.id ?? null)}
                >
                  {!item.hidePhoto && item?.photo && (
                    <div
                      className="relative overflow-hidden rounded-[4px]"
                      style={{
                        width: `${dimensions.mobile.width}px`,
                        height: `${dimensions.mobile.height}px`,
                      }}
                    >
                      <style jsx>{`
                        @media (min-width: 640px) {
                          div {
                            width: ${dimensions.desktop.width}px !important;
                            height: ${dimensions.desktop.height}px !important;
                          }
                        }
                      `}</style>
                      <div className="relative h-full w-full">
                        <Image
                          src={item.photo || ""}
                          alt={item.client || ""}
                          fill
                          className="object-cover"
                          style={{ aspectRatio: "auto" }}
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
                      <p className="text-lg font-medium text-[#C085FD]">
                        {formatCurrencyDisplay(item.roi ?? 0)}
                      </p>
                    </span>
                  </div>

                  <EditableImage
                    isModalOpen={openModalId === item.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (item?.id ?? null) : null)
                    }
                    itemType="results"
                    items={items || []}
                    currentItemId={item?.id ?? null}
                    onUpdateItem={updateResultItem}
                    onAddItem={addResultItem}
                    onReorderItems={
                      reorderResultItems as (
                        items: TeamMember[] | Result[]
                      ) => void
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
