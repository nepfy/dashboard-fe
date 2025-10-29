import { useState } from "react";
import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableButton from "#/app/editar/components/EditableButton";

export default function FlashIntro({
  mainColor,
  userName,
  email,
  title,
  subtitle,
  hideSubtitle,
  services,
}: IntroductionSection) {
  const { updateIntroduction, projectData } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);
  let bg;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  }

  if (mainColor === "#BE8406") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #C97C00 64.9%, #CEA605 81.78%)`;
  }

  if (mainColor === "#9B3218") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
  }

  if (mainColor === "#05722C") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #189B53 64.9%, #4ABE3F 81.78%)`;
  }

  if (mainColor === "#182E9B") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  }

  if (mainColor === "#212121") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  }

  return (
    <div className="relative overflow-hidden px-6 py-11 lg:px-12">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between text-[#E6E6E6]">
        <span className="text-lg font-semibold lg:text-base lg:font-normal">
          <EditableText
            value={userName || ""}
            onChange={(newUserName: string) =>
              updateIntroduction({ userName: newUserName })
            }
            className="text-lg font-semibold lg:text-base lg:font-normal"
          />{" "}
        </span>
        <div className="hidden items-center gap-12 lg:flex">
          <EditableText
            value={email || ""}
            onChange={(newEmail: string) =>
              updateIntroduction({ email: newEmail })
            }
            className="text-[#E6E6E6]"
          />
          <div
            className="relative z-5 h-auto w-auto cursor-pointer py-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsButtonModalOpen(true);
            }}
          >
            <div
              className={`absolute inset-0 border hover:border-[#0170D6] hover:bg-[#0170D666] ${isButtonModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
            />
            <p className="rounded-full bg-black p-5">
              {projectData?.buttonConfig?.buttonTitle || "Iniciar Projeto"}
            </p>
            <EditableButton
              isModalOpen={isButtonModalOpen}
              setIsModalOpen={setIsButtonModalOpen}
              position="below"
            />
          </div>
        </div>

        <button
          className="z-[900] flex h-6 w-6 cursor-pointer flex-col items-center justify-center space-y-1 lg:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`bg-white-neutral-light-100 h-[1px] w-8 transition-all duration-300`}
          />
          <span
            className={`bg-white-neutral-light-100 mt-1 mb-2 h-[1px] w-8 transition-all duration-300`}
          />
          <span
            className={`bg-white-neutral-light-100 h-[1px] w-8 transition-all duration-300`}
          />
        </button>
      </nav>

      <div className="mx-auto mb-24 flex max-w-[1440px] flex-col overflow-y-visible pt-30 lg:mb-0 lg:pt-60 lg:pb-39 xl:pl-30">
        <EditableText
          value={title || ""}
          onChange={(newTitle: string) =>
            updateIntroduction({ title: newTitle })
          }
          className="max-w-[1120px] text-[32px] leading-[1.3] text-[#E6E6E6] xl:text-[72px]"
        />

        {projectData?.projectValidUntil && (
          <div
            className="relative mt-4 self-start"
            onClick={(e) => {
              e.stopPropagation();
              setIsDateModalOpen(true);
            }}
          >
            <p
              className={`inline w-auto cursor-pointer text-sm font-bold text-[#E6E6E6] hover:border-[#0170D6] hover:bg-[#0170D666] ${isDateModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border border-transparent bg-transparent"}`}
            >
              Proposta válida até -{" "}
              <span className="font-normal text-[#E6E6E6]/40">
                {formatDateToDDDeMonthDeYYYY(
                  projectData.projectValidUntil.toString()
                )}
              </span>
            </p>
            <EditableDate
              isModalOpen={isDateModalOpen}
              setIsModalOpen={setIsDateModalOpen}
            />
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-end justify-between gap-4 lg:flex-row">
        <div className="order-2 w-full border-l border-l-[#A0A0A0] pt-22 pl-4 lg:order-1 lg:w-1/2 lg:pl-8">
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
            className="max-w-[250px] text-sm text-[#E6E6E6]"
          />
        </div>
        {!hideSubtitle && (
          <div className="order-1 w-full border-l border-l-[#A0A0A0] pt-22 pl-4 lg:order-2 lg:w-1/2 lg:pl-8">
            <span className="max-w-[400px] text-[18px] text-[#E6E6E6]">
              <EditableText
                value={subtitle || ""}
                onChange={(newSubtitle: string) =>
                  updateIntroduction({ subtitle: newSubtitle })
                }
                className="w-full max-w-[380px] text-[18px] text-[#E6E6E6]"
              />
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          width: "120%",
          height: "100%",
          background: bg,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
