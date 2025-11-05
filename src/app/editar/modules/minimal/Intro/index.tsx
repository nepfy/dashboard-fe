import { useState } from "react";
import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import EditableButton from "#/app/editar/components/EditableButton";

export default function MinimalIntro({
  mainColor,
  userName,
  title,
  subtitle,
  hideSubtitle,
  services,
}: IntroductionSection) {
  const { updateIntroduction, projectData } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-11 lg:px-12">
        <div className="hero_component">
          <div className="hero_left">
            <div className="heading-wrap">
              <h1 className="heading-style-h1 text-weight-light">Hello,</h1>
              <div className="heading-client-image"></div>
              <h1 className="heading-style-h1 text-weight-light">
                <EditableText
                  value={userName || ""}
                  onChange={(newUserName: string) =>
                    updateIntroduction({ userName: newUserName })
                  }
                  className="heading-style-h1 text-weight-light"
                />
              </h1>
            </div>
            <h1 className="heading-line">—</h1>
            <h1 className="heading-style-h1 text-weight-light">
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) =>
                  updateIntroduction({ title: newTitle })
                }
                className="heading-style-h1 text-weight-light"
              />
            </h1>
          </div>
          <div className="hero_right">
            {projectData?.projectValidUntil && (
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDateModalOpen(true);
                }}
              >
                <div className={`text-size-regular text-weight-light ${isDateModalOpen ? "border border-[#0170D6] bg-[#0170D666]" : "border border-transparent bg-transparent"}`}>
                  Proposal —{" "}
                  <span className="text-color-grey">
                    {formatDateToDDDeMonthDeYYYY(
                      projectData.projectValidUntil.toString()
                    )}
                  </span>
                </div>
                <EditableDate
                  isModalOpen={isDateModalOpen}
                  setIsModalOpen={setIsDateModalOpen}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {!hideSubtitle && (
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="about-heading_left">
            <div className="text-weight-light text-size-regular">
              Proposal —{" "}
              <span className="text-color-grey">
                {projectData?.projectValidUntil
                  ? formatDateToDDDeMonthDeYYYY(
                      projectData.projectValidUntil.toString()
                    )
                  : "June 22, 2025"}
              </span>
            </div>
            <div>
              <EditableText
                value={subtitle || ""}
                onChange={(newSubtitle: string) =>
                  updateIntroduction({ subtitle: newSubtitle })
                }
                className="text-size-regular"
              />
            </div>
          </div>
        </div>
      )}

      {services && services.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="about-marquee">
            <div className="marquee_content">
              <div className="marquee_item">
                <div className="about-marquee_text">
                  <EditableText
                    value={
                      services?.map((service) => service.serviceName).join(" → ") || ""
                    }
                    onChange={(newServices: string) => {
                      const serviceNames = newServices
                        .split("→")
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
                    className="about-marquee_text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

