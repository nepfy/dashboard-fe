import { Plan } from "#/types/template-data";
import { useEffect, useState } from "react";
import InfoIcon from "#/components/icons/InfoIcon";
import { ChevronDown } from "lucide-react";
import { maskPhone } from "#/helpers/maskPhone";

export default function ButtonTab({
  plan,
  setShowInfo,
  onChange,
}: {
  plan: Plan;
  setShowInfo: (show: boolean) => void;
  onChange: (
    data: Partial<
      Pick<
        Plan,
        "buttonTitle" | "buttonWhereToOpen" | "buttonHref" | "buttonPhone"
      >
    >
  ) => void;
}) {
  const [tempButtonTitle, setTempButtonTitle] = useState<string>(
    plan?.buttonTitle || ""
  );
  const [tempWhereToOpen, setTempWhereToOpen] = useState<
    "link" | "whatsapp" | undefined
  >(plan?.buttonWhereToOpen || undefined);
  const [tempHref, setTempHref] = useState<string>(plan?.buttonHref || "");
  const [tempPhone, setTempPhone] = useState<string>(plan?.buttonPhone || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const handlePhoneChange = (value: string) => {
    // Store as plain text (remove formatting)
    const plainText = value.replace(/\D/g, "");
    setTempPhone(plainText);
    onChange({ buttonPhone: plainText });
  };

  const getDisplayPhone = () => {
    return maskPhone(tempPhone || plan?.buttonPhone || "");
  };

  // Sync local inputs from plan when it changes
  useEffect(() => {
    setTempButtonTitle(plan?.buttonTitle || "");
    setTempWhereToOpen(plan?.buttonWhereToOpen || undefined);
    setTempHref(plan?.buttonHref || "");
    setTempPhone(plan?.buttonPhone || "");
    // don't touch isDropdownOpen here; keep user's dropdown state
  }, [
    plan?.buttonTitle,
    plan?.buttonWhereToOpen,
    plan?.buttonHref,
    plan?.buttonPhone,
  ]);

  return (
    <div
      className="h-[72%] space-y-6 overflow-y-auto py-2 pr-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Button Text Field */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-[#2A2A2A]">
          Texto botão
        </label>
        <input
          type="text"
          value={tempButtonTitle}
          onChange={(e) => {
            setTempButtonTitle(e.target.value);
            onChange({ buttonTitle: e.target.value });
          }}
          placeholder="Digite o texto"
          className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm font-medium text-[#161616]"
        />
      </div>

      {/* Where to Open Field */}
      <div className="flex items-center justify-between gap-2">
        <label className="relative flex items-center gap-3 text-sm font-medium text-[#2A2A2A]">
          Abrir em
          <div
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
            onClick={() => {
              setShowInfo(true);
              setIsTooltipVisible(false);
            }}
            className="relative cursor-pointer"
          >
            <InfoIcon width="12" height="12" fill="#7C7C7C" />
            {isTooltipVisible && (
              <div className="absolute top-[-44px] left-[-70px] z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] whitespace-nowrap text-gray-800 shadow-lg">
                Clique para saber mais
                <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-t-white border-r-transparent border-l-transparent"></div>
              </div>
            )}
          </div>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-[210px] cursor-pointer items-center justify-between rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-left text-sm font-medium text-[#161616]"
          >
            {tempWhereToOpen === "link"
              ? "Link"
              : tempWhereToOpen === "whatsapp"
                ? "WhatsApp"
                : "Selecionar"}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[37px] z-10 w-[210px] rounded-b-[4px] border border-[#DBDDDF] bg-[#F6F8FA]">
              <div>
                <label className="flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="whereToOpen"
                    value="link"
                    checked={tempWhereToOpen === "link"}
                    onChange={() => {
                      setTempWhereToOpen("link");
                      setIsDropdownOpen(false);
                      onChange({ buttonWhereToOpen: "link" });
                    }}
                    className="h-4 w-4 cursor-pointer text-purple-600"
                  />
                  <span className="text-sm font-medium text-[#161616]">
                    Link
                  </span>
                </label>
                <label className="flex w-full cursor-pointer items-center gap-3 border-t border-t-[#DBDDDF] p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="whereToOpen"
                    value="whatsapp"
                    checked={tempWhereToOpen === "whatsapp"}
                    onChange={() => {
                      setTempWhereToOpen("whatsapp");
                      setIsDropdownOpen(false);
                      onChange({ buttonWhereToOpen: "whatsapp" });
                    }}
                    className="h-4 w-4 cursor-pointer text-purple-600"
                  />
                  <span className="text-sm font-medium text-[#161616]">
                    WhatsApp
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Link Field */}
      {tempWhereToOpen === "link" && (
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-[#2A2A2A]">Link</label>
          <input
            type="url"
            value={tempHref}
            onChange={(e) => {
              setTempHref(e.target.value);
              onChange({ buttonHref: e.target.value });
            }}
            placeholder="Adicione o link"
            className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm font-medium text-[#161616]"
          />
        </div>
      )}

      {/* Conditional WhatsApp Field */}
      {tempWhereToOpen === "whatsapp" && (
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-[#2A2A2A]">WhatsApp</label>
          <input
            type="tel"
            value={getDisplayPhone()}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(00) 0000-0000"
            className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm font-medium text-[#161616]"
          />
        </div>
      )}
    </div>
  );
}
