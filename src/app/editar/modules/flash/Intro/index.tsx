import { useState } from "react";
import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableButton from "#/app/editar/components/EditableButton";
import { getHeroGradientColors } from "#/helpers/colorUtils";

export default function FlashIntro({
  mainColor,
  userName,
  title,
  subtitle,
  hideSubtitle,
  services,
}: IntroductionSection) {
  const { updateIntroduction, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;

  // Generate gradient colors for the hero background
  const defaultColor = mainColor || "#4F21A1";
  const colors = getHeroGradientColors(defaultColor);
  const gradientString = `radial-gradient(circle at 0 0, #000 7%, ${colors.dark} 35%, ${defaultColor} 68%, ${colors.light} 76%)`;

  return (
    <div className="relative overflow-hidden px-6 py-11 lg:px-12">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between text-[#E6E6E6]">
        <span className="text-lg font-semibold lg:text-base lg:font-normal">
          <EditableText
            value={userName || ""}
            onChange={(newUserName: string) =>
              updateIntroduction({ userName: newUserName })
            }
            className="text-lg font-medium"
            editingId="intro-userName"
          />{" "}
        </span>
        <div className="flex items-center gap-12">
          {/* <EditableText
            value={email || ""}
            onChange={(newEmail: string) =>
              updateIntroduction({ email: newEmail })
            }
            className="text-[#E6E6E6]"
          /> */}
          <div
            className={`relative z-10 h-auto w-auto py-2 ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (canEdit) {
                setIsButtonModalOpen(true);
              }
            }}
          >
            <div
              className={`absolute inset-0 border ${canEdit ? "hover:border-[#0170D6] hover:bg-[#0170D666]" : ""} ${isButtonModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
            />
            <p className="rounded-full bg-black px-7 py-5">
              {projectData?.buttonConfig?.buttonTitle || "Iniciar Projeto"}
            </p>
            <EditableButton
              isModalOpen={isButtonModalOpen}
              setIsModalOpen={setIsButtonModalOpen}
              position="below"
              editingId="intro-button"
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto mb-24 flex max-w-[1440px] flex-col overflow-y-visible pt-30 lg:mb-0 lg:pt-60 lg:pb-39 xl:pl-30">
        <EditableText
          value={title || ""}
          onChange={(newTitle: string) =>
            updateIntroduction({ title: newTitle })
          }
          className="max-w-[1120px] text-[43px] leading-[1.3] text-[#E6E6E6] xl:text-[72px]"
          editingId="intro-title"
        />

        {projectData?.projectValidUntil && (
          <div
            className="relative mt-4 self-start"
            onClick={(e) => {
              e.stopPropagation();
              if (canEdit) {
                setIsDateModalOpen(true);
              }
            }}
          >
            <p
              className={`inline w-auto text-[13px] text-[#E6E6E6] lg:text-[15px] ${canEdit ? "cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666]" : "cursor-not-allowed"} ${isDateModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border border-transparent bg-transparent"}`}
            >
              Proposta válida até -{" "}
              <span className="font-normal text-[#FFFFFF]">
                {formatDateToDDDeMonthDeYYYY(
                  projectData.projectValidUntil.toString()
                )}
              </span>
            </p>
            <EditableDate
              isModalOpen={isDateModalOpen}
              setIsModalOpen={setIsDateModalOpen}
              editingId="intro-date"
            />
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-end justify-between gap-4 lg:flex-row">
        <div className="order-2 hidden w-full pt-22 pl-0 lg:order-1 lg:block lg:w-1/2 lg:border-l lg:border-l-[#ffffff]/50 lg:pl-8">
          <EditableText
            value={
              services?.map((service) => service.serviceName).join("\n") || ""
            }
            onChange={(newServices: string) => {
              // Convert string back to services array format
              const serviceNames = newServices
                .split("\n")
                .map((name) => name.trim())
                .filter((name) => name);
              const updatedServices = serviceNames.map((name, index) => ({
                id: services?.[index]?.id || `service-${index}`,
                serviceName: name,
                hideItem: services?.[index]?.hideItem || false,
                sortOrder: services?.[index]?.sortOrder || index,
              }));
              updateIntroduction({ services: updatedServices });
            }}
            className="w-full text-sm text-[#E6E6E6]"
            editingId="intro-services"
          />
        </div>
        {!hideSubtitle && (
          <div className="order-1 w-full pt-22 pl-0 lg:order-2 lg:w-1/2 lg:border-l lg:border-l-[#ffffff]/50 lg:pl-8">
            <span className="max-w-[400px] text-[18px] text-[#ffffff]">
              <EditableText
                value={subtitle || ""}
                onChange={(newSubtitle: string) =>
                  updateIntroduction({ subtitle: newSubtitle })
                }
                className="w-full max-w-[380px] text-[16px] text-[#ffffff] lg:text-[18px]"
                editingId="intro-subtitle"
              />
            </span>
          </div>
        )}
      </div>
      <div
        className="pointer-events-none"
        style={{
          width: "120%",
          position: "absolute",
          inset: "-36vw 0% 0% -10vw",
        }}
      >
        <div
          style={{
            zIndex: -1,
            filter: "blur(110px)",
            backgroundImage: gradientString,
            borderRadius: "50%",
            width: "130vw",
            height: "130vw",
            position: "sticky",
            inset: "-159% 0% 0%",
          }}
        />
        <div
          style={{
            zIndex: -2,
            backgroundColor: "#000000",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: "0%",
          }}
        />
      </div>
    </div>
  );
}
