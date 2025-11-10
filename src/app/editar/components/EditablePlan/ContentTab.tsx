import { useEffect, useState } from "react";
import { Plan } from "#/types/template-data";
import { ChevronDown, InfoIcon } from "lucide-react";
import { CurrencyInput } from "#/components/Inputs";

interface ContentTabProps {
  plan: Plan;
  currentItem: Plan | null;
  onUpdate: (data: Partial<Plan>) => void;
  onDeleteItem: () => void;
  setShowPlanInfo: (show: boolean) => void;
}
export default function ContentTab({
  plan,
  onUpdate,
  onDeleteItem,
  setShowPlanInfo,
}: ContentTabProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [tempPaymentMethod, setTempPaymentMethod] = useState<
    "Mensal" | "Anual" | "Único" | undefined
  >(undefined);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  useEffect(() => {
    if (plan.planPeriod) {
      setTempPaymentMethod(plan.planPeriod);
    }
  }, [plan.planPeriod]);

  return (
    <div className="mt-4 h-[340px] space-y-6 overflow-y-auto px-1 pr-2 pb-14">
      <div className="relative z-10 flex items-center justify-between gap-4">
        <label className="relative flex items-center gap-2 text-sm font-medium text-[#2A2A2A]">
          Definir como melhor plano
          <span>
            <div
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              onClick={() => {
                setShowPlanInfo(true);
                setIsTooltipVisible(false);
              }}
              className="relative"
            >
              <InfoIcon
                width="12"
                height="12"
                className="cursor-pointer text-[#7C7C7C]"
              />
              {isTooltipVisible && (
                <div className="absolute top-[-44px] left-[-70px] z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] whitespace-nowrap text-gray-800 shadow-lg">
                  Clique para saber mais
                  <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-t-white border-r-transparent border-l-transparent"></div>
                </div>
              )}
            </div>
          </span>
        </label>
        <button
          onClick={() => onUpdate({ recommended: !plan.recommended })}
          className={`relative z-10 inline-flex h-6 w-[46px] cursor-pointer items-center rounded-full transition-colors ${
            !plan.recommended
              ? "bg-white-neutral-light-300"
              : "bg-primary-light-400"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              !plan.recommended ? "translate-x-0.5" : "translate-x-6"
            }`}
          />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
          Título
        </label>
        <input
          type="text"
          value={plan.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
          placeholder="Digite o título"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
          Valor
        </label>
        <CurrencyInput
          value={plan.value || ""}
          onChange={(value) => onUpdate({ value })}
          placeholder="0,00"
          className="w-[210px]"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="relative flex items-center gap-3 text-sm font-medium text-[#2A2A2A]">
          Pagamento
          <div className="relative"></div>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-[210px] cursor-pointer items-center justify-between rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-left text-sm font-medium text-[#161616]"
          >
            {tempPaymentMethod === "Mensal"
              ? "Mensal"
              : tempPaymentMethod === "Anual"
                ? "Anual"
                : tempPaymentMethod === "Único"
                  ? "Único"
                  : "Selecionar"}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[37px] z-10 w-[210px] rounded-b-[4px] border border-[#DBDDDF] bg-[#F6F8FA]">
              <div className="flex flex-col">
                <label className="flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Mensal"
                    checked={tempPaymentMethod === "Mensal"}
                    onChange={() => {
                      setTempPaymentMethod("Mensal");
                      onUpdate({ planPeriod: "Mensal" as Plan["planPeriod"] });
                      setIsDropdownOpen(false);
                    }}
                    className="h-4 w-4 cursor-pointer text-purple-600"
                  />
                  <span className="text-sm font-medium text-[#161616]">
                    Mensal
                  </span>
                </label>
                <label className="flex w-full cursor-pointer items-center gap-3 border-t border-t-[#DBDDDF] p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Anual"
                    checked={tempPaymentMethod === "Anual"}
                    onChange={() => {
                      setTempPaymentMethod("Anual");
                      onUpdate({ planPeriod: "Anual" as Plan["planPeriod"] });
                      setIsDropdownOpen(false);
                    }}
                    className="h-4 w-4 cursor-pointer text-purple-600"
                  />
                  <span className="text-sm font-medium text-[#161616]">
                    Anual
                  </span>
                </label>

                <label className="flex w-full cursor-pointer items-center gap-3 border-t border-t-[#DBDDDF] p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Único"
                    checked={tempPaymentMethod === "Único"}
                    onChange={() => {
                      setTempPaymentMethod("Único");
                      onUpdate({ planPeriod: "Único" as Plan["planPeriod"] });
                      setIsDropdownOpen(false);
                    }}
                    className="h-4 w-4 cursor-pointer text-purple-600"
                  />
                  <span className="text-sm font-medium text-[#161616]">
                    Único
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="mb-1 block text-sm font-medium text-[#2A2A2A]">
          Descrição
        </label>
        <textarea
          value={plan.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 font-medium text-[#161616]"
          placeholder="Digite a descrição"
          rows={5}
        />
      </div>

      <div className="mb-14 flex items-center justify-center pt-4">
        <button
          onClick={() => onDeleteItem()}
          className="text-white-neutral-light-900 flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-red-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Excluir plano
        </button>
      </div>
    </div>
  );
}
