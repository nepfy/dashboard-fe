import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "../../../components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";

export default function FlashIntro({
  mainColor,
  userName,
  email,
  buttonTitle,
  title,
  validity,
  subtitle,
  hideSubtitle,
  services,
}: IntroductionSection) {
  const { updateIntroduction } = useEditor();

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
    <div className="relative px-6 lg:px-12 py-11 overflow-hidden">
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
      <nav className="flex justify-between items-center text-[#E6E6E6] max-w-[1440px] mx-auto">
        <p className="text-lg lg:text-base font-semibold lg:font-normal">
          <EditableText
            as="p"
            value={userName || ""}
            onChange={(newUserName: string) =>
              updateIntroduction({ userName: newUserName })
            }
            className="text-lg lg:text-base font-semibold lg:font-normal"
          />{" "}
        </p>
        <div className="hidden lg:flex gap-12 items-center">
          <EditableText
            as="p"
            value={email || ""}
            onChange={(newEmail: string) =>
              updateIntroduction({ email: newEmail })
            }
            className=" text-[#E6E6E6]"
          />
          <p className="rounded-full bg-black p-5">
            {buttonTitle || "Iniciar Projeto"}
          </p>
        </div>

        <button
          className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 cursor-pointer z-[900]"
          aria-label="Toggle menu"
        >
          <span
            className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300`}
          />
          <span
            className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300 mb-2 mt-1`}
          />
          <span
            className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300`}
          />
        </button>
      </nav>

      <div className="pt-30 lg:pt-60 mb-24 lg:mb-0 lg:pb-39 xl:pl-30 max-w-[1440px] mx-auto">
        <EditableText
          as="h1"
          value={title || ""}
          onChange={(newTitle: string) =>
            updateIntroduction({ title: newTitle })
          }
          className="text-[32px] xl:text-[72px] text-[#E6E6E6] max-w-[1120px] pb-4"
        />
        {validity && (
          <p className="font-bold text-sm text-[#E6E6E6]">
            Proposta válida até -{" "}
            <span className="font-normal text-[#E6E6E6]/40">
              {formatDateToDDDeMonthDeYYYY(validity)}
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-4 max-w-[1440px] mx-auto">
        <div className="pt-22 pl-4 lg:pl-8 border-l border-l-[#A0A0A0] w-full lg:w-1/2 order-2 lg:order-1">
          <EditableText
            as="p"
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
          <div className="pt-22 pl-4 lg:pl-8 border-l border-l-[#A0A0A0] w-full lg:w-1/2 order-1 lg:order-2">
            <p className="text-[18px] text-[#E6E6E6] max-w-[400px]">
              <EditableText
                as="p"
                value={subtitle || ""}
                onChange={(newSubtitle: string) =>
                  updateIntroduction({ subtitle: newSubtitle })
                }
                className="text-[18px] text-[#E6E6E6] max-w-[400px]"
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
