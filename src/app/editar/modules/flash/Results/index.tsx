import Image from "next/image";
import { formatCurrencyDisplay } from "#/helpers/formatCurrency";
import { ResultSection } from "#/types/template-data";

export default function FlashResults({
  hideSection,
  title,
  items,
}: ResultSection) {
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
    <div className="bg-black overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-0 pt-7 lg:pt-22">
          <div className="flex items-end pt-24 pl-5 lg:pl-10 border-l border-l-[#A0A0A0] max-w-[1100px] mb-16 lg:mb-43 mx-auto">
            <p className="text-[32px] lg:text-[72px] text-[#E6E6E6]">
              {title || "Transformamos desafios em resultados visíveis"}
            </p>
          </div>
          <div className="px-0 lg:px-0 xl:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
              <p className="text-white text-sm font-semibold">
                Nossos Resultados
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 max-w-[1500px] mx-auto pb-30">
              {items?.map((item) => (
                <div key={item.id} className="flex flex-col items-start mb-20">
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
                      <div className="relative w-full h-full">
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

                  <p className="text-[24px] font-medium text-[#E6E6E6] mt-3 p-0">
                    {item.client}
                  </p>
                  <p className="font-normal text-[#A0A0A0] text-sm">
                    @{item.instagram}
                  </p>

                  <div className="flex gap-12 mt-6">
                    <span>
                      <p className="font-semibold text-[#E6E6E6] text-lg">
                        Investimento
                      </p>
                      <p className="font-medium text-[#A0A0A0] text-lg">
                        {formatCurrencyDisplay(item.investment ?? 0)}
                      </p>
                    </span>
                    <span>
                      <p className="font-semibold text-[#E6E6E6] text-lg">
                        Retorno
                      </p>
                      <p className="font-medium text-[#C085FD] text-lg">
                        {formatCurrencyDisplay(item.roi ?? 0)}
                      </p>
                    </span>
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
