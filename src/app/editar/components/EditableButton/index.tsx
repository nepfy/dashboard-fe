"use client";

import { useState, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import CloseIcon from "#/components/icons/CloseIcon";
import InfoIcon from "#/components/icons/InfoIcon";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { ChevronDown } from "lucide-react";
import { maskPhone } from "#/helpers/maskPhone";

interface EditableButtonProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  position?: "right" | "below";
}

export default function EditableButton({
  isModalOpen,
  setIsModalOpen,
  position = "right",
}: EditableButtonProps) {
  const { projectData, updateButtonConfig } = useEditor();

  // Temporary state for form fields
  const [tempButtonTitle, setTempButtonTitle] = useState<string>("");
  const [tempWhereToOpen, setTempWhereToOpen] = useState<
    "link" | "whatsapp" | undefined
  >(undefined);
  const [tempHref, setTempHref] = useState<string>("");
  const [tempPhone, setTempPhone] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Get current button config
  const currentButtonConfig = projectData?.buttonConfig;

  // Initialize temp state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempButtonTitle(currentButtonConfig?.buttonTitle || "");
      setTempWhereToOpen(currentButtonConfig?.buttonWhereToOpen || undefined);
      setTempHref(currentButtonConfig?.buttonHref || "");
      setTempPhone(currentButtonConfig?.buttonPhone || "");
    }
  }, [isModalOpen, currentButtonConfig]);

  const handleSave = () => {
    const updateData = {
      buttonTitle: tempButtonTitle,
      buttonWhereToOpen: tempWhereToOpen,
      buttonHref: tempWhereToOpen === "link" ? tempHref : undefined,
      buttonPhone: tempWhereToOpen === "whatsapp" ? tempPhone : undefined,
    };

    updateButtonConfig(updateData);
    setIsModalOpen(false);
  };

  const hasButtonChanged = () => {
    // If there's no current config, check if any temp values are not empty
    if (!currentButtonConfig) {
      return (
        tempButtonTitle !== "" ||
        tempWhereToOpen !== undefined ||
        tempHref !== "" ||
        tempPhone !== ""
      );
    }

    return (
      tempButtonTitle !== (currentButtonConfig.buttonTitle || "") ||
      tempWhereToOpen !==
        (currentButtonConfig.buttonWhereToOpen || undefined) ||
      tempHref !== (currentButtonConfig.buttonHref || "") ||
      tempPhone !== (currentButtonConfig.buttonPhone || "")
    );
  };

  const handlePhoneChange = (value: string) => {
    // Store as plain text (remove formatting)
    const plainText = value.replace(/\D/g, "");
    setTempPhone(plainText);
  };

  const getDisplayPhone = () => {
    return maskPhone(tempPhone);
  };

  return (
    <EditableModal
      isOpen={isModalOpen}
      className={`absolute flex h-[480px] w-[350px] cursor-default flex-col items-stretch justify-center ${
        position === "right"
          ? "sm:inset-auto sm:top-[-130px] sm:right-[-360px]"
          : "sm:inset-auto sm:top-[88px] sm:right-12"
      }`}
      trianglePosition={
        position === "right"
          ? "top-[150px] left-[-8px]"
          : "top-[-15px] right-[20px] rotate-90"
      }
    >
      <>
        {!showInfo && (
          <>
            <div
              className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-lg font-medium text-[#2A2A2A]">Botão</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
              >
                <CloseIcon width="12" height="12" fill="#1C1A22" />
              </button>
            </div>

            <div
              className="h-[72%] space-y-6"
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
                  onChange={(e) => setTempButtonTitle(e.target.value)}
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
                    className="relative"
                  >
                    <InfoIcon width="12" height="12" fill="#1C1A22" />
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
                  <label className="text-sm font-medium text-[#2A2A2A]">
                    Link
                  </label>
                  <input
                    type="url"
                    value={tempHref}
                    onChange={(e) => setTempHref(e.target.value)}
                    placeholder="Adicione o link"
                    className="w-[210px] rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm font-medium text-[#161616]"
                  />
                </div>
              )}

              {/* Conditional WhatsApp Field */}
              {tempWhereToOpen === "whatsapp" && (
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-[#2A2A2A]">
                    WhatsApp
                  </label>
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

            {/* Save Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={!hasButtonChanged()}
              className={`flex w-full transform items-center justify-center gap-1 rounded-[12px] px-6 py-3.5 text-sm font-medium transition-all duration-200 ${
                hasButtonChanged()
                  ? "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              Alterar
            </button>
          </>
        )}

        {showInfo && (
          <div className="flex flex-col items-stretch justify-center">
            <div className="text-white-neutral-light-900 text-sm">
              <div className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6">
                <span className="text-lg font-medium text-[#2A2A2A]">
                  Botão
                </span>
              </div>

              <p className="text-primary-light-400 mb-4 text-[16px] font-medium">
                Você pode definir para onde o botão vai levar o usuário:
              </p>

              <ul className="mb-4">
                <li className="list-inside list-disc">
                  Cole uma URL (ex: seu site, portfólio, rede social)
                </li>
                <li className="list-inside list-disc">
                  Ou insira um número de WhatsApp (com DDD, ex: 11 99999-9999)
                </li>
              </ul>

              <p className="mb-4">
                Assim, quando alguém clicar no botão, será direcionado para o
                link ou abrirá uma conversa no WhatsApp.
              </p>
              <p className="mb-4">
                Certifique-se de inserir o endereço ou número corretamente para
                evitar erros de redirecionamento.
              </p>
            </div>
            <button
              onClick={() => {
                setShowInfo(false);
              }}
              className={`flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700`}
            >
              Entendi
            </button>
          </div>
        )}
      </>
    </EditableModal>
  );
}
