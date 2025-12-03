"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IntroductionSection,
  IntroductionService,
} from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import EditableButton from "#/app/editar/components/EditableButton";
import EditableLogo from "#/app/editar/components/EditableLogo";
import EditableAvatar from "#/app/editar/components/EditableAvatar";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

export default function MinimalIntro({
  userName,
  title,
  subtitle,
  logo,
  clientPhoto,
  services,
}: IntroductionSection) {
  const {
    updateIntroduction,
    updateIntroductionService,
    reorderIntroductionServices,
    projectData,
    activeEditingId,
  } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);
  const [openServiceModalId, setOpenServiceModalId] = useState<string | null>(
    null
  );

  const canEdit = activeEditingId === null;

  // Create temporary items when array is empty so marquee always shows
  const workingServices =
    services && services.length > 0
      ? services
      : [
          {
            id: "intro-service-temp-1",
            image: "/images/templates/flash/placeholder.png",
            serviceName: "Serviço 1",
            sortOrder: 0,
          } as IntroductionService,
          {
            id: "intro-service-temp-2",
            image: "/images/templates/flash/placeholder.png",
            serviceName: "Serviço 2",
            sortOrder: 1,
          } as IntroductionService,
          {
            id: "intro-service-temp-3",
            image: "/images/templates/flash/placeholder.png",
            serviceName: "Serviço 3",
            sortOrder: 2,
          } as IntroductionService,
          {
            id: "intro-service-temp-4",
            image: "/images/templates/flash/placeholder.png",
            serviceName: "Serviço 4",
            sortOrder: 3,
          } as IntroductionService,
        ];

  return (
    <>
      <style jsx global>{`
        .section_hero {
          position: relative;
          background-color: #000000;
          min-height: 90vh;
        }

        .nav_component {
          position: relative;
          z-index: 10;
        }

        .padding-global {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }

        .container-large {
          width: 100%;
          max-width: 90rem;
          margin-left: auto;
          margin-right: auto;
        }

        .nav_wrap {
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          display: flex;
        }

        .nav_brand {
          color: #fbfbfb;
          font-weight: 500;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-animate-chars {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          padding: 1rem 1.75rem;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          background: transparent;
          cursor: pointer;
        }

        .btn-animate-chars:hover {
          border-color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-animate-chars__text {
          color: #fbfbfb;
          font-size: 1rem;
          font-weight: 400;
        }

        .padding-section-large {
          padding-top: 8rem;
          padding-bottom: 8rem;
        }

        .hero_component {
          grid-column-gap: 4rem;
          grid-row-gap: 4rem;
          justify-content: space-between;
          align-items: flex-start;
          display: flex;
        }

        .hero_left {
          flex: 1;
        }

        .heading-wrap {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .heading-style-h1 {
          color: #fbfbfb;
          margin: 0;
          font-size: 3rem;
          font-weight: 300;
          line-height: 1.2;
          font-family: var(--font-overused);
        }

        .text-weight-light {
          font-weight: 300;
        }

        .heading-client-image {
          flex-shrink: 0;
        }

        .heading-line {
          color: rgba(255, 255, 255);
          margin: 1rem 0 0 0;
          font-size: 3rem;
          font-weight: 300;
          line-height: 1;
        }

        .hero_right {
          flex-shrink: 0;
        }

        .text-size-regular {
          font-size: 1rem;
          line-height: 1.5;
          color: #fbfbfb;
        }

        .text-color-grey {
          color: rgba(255, 255, 255, 0.5);
        }

        .marquee_component {
          position: relative;
          overflow: hidden;
          margin-top: 4rem;
          padding-bottom: 8px;
        }

        .marquee_component:hover .marquee_content {
          animation-play-state: paused;
        }

        .marquee_component.paused .marquee_content {
          animation-play-state: paused;
        }

        .marquee_content {
          display: flex;
          gap: 0;
          animation: marquee 30s linear infinite;
          height: 568px;
          max-height: 568px;
          padding: 4px;
        }

        .marquee_item {
          display: flex;
          gap: 1.5rem;
          flex-shrink: 0;
          height: 568px;
          max-height: 568px;
          padding: 4px;
        }

        .marquee-img {
          width: 72.5rem;
          height: 560px;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          position: relative;
          z-index: 10;
          pointer-events: auto;
          transition: all 0.2s ease;
        }

        .marquee-img::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(1, 112, 214, 0.4);
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          z-index: 1;
        }

        .marquee-img:hover::after {
          opacity: 1;
        }

        .marquee-img.active::after {
          opacity: 1;
        }

        .marquee-img video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media screen and (max-width: 991px) {
          .heading-style-h1 {
            font-size: 3.5rem;
          }
          .heading-line {
            font-size: 3.5rem;
          }
          .padding-section-large {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
          .marquee_content {
            height: 31.25rem;
          }
          .marquee_item {
            height: 31.25rem;
          }
          .marquee-img {
            width: 50rem;
            height: 31.25rem;
          }
        }

        @media screen and (max-width: 767px) {
          .hero_component {
            flex-direction: column;
            align-items: flex-start;
          }
          .heading-style-h1 {
            font-size: 2.5rem;
          }
          .heading-line {
            font-size: 2.5rem;
            margin: 1rem 0;
          }
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .marquee_content {
            height: auto;
          }
          .marquee_item {
            height: auto;
          }
          .marquee-img {
            width: 85vw;
            height: auto;
            aspect-ratio: 16/10;
          }
        }
      `}</style>

      <section className="section_hero">
        {/* Navigation */}
        <div className="nav_component">
          <div className="padding-global">
            <div className="container-large">
              <div className="nav_wrap">
                <div className="nav_brand">
                  <EditableLogo
                    logoUrl={logo}
                    onLogoChange={(newLogo: string | null) =>
                      updateIntroduction({ logo: newLogo || undefined })
                    }
                    size="md"
                    editingId="intro-logo"
                  />
                  <EditableText
                    value={userName || "Your Name"}
                    onChange={(newUserName: string) =>
                      updateIntroduction({ userName: newUserName })
                    }
                    className="nav_brand"
                    editingId="intro-userName"
                  />
                </div>
                <div
                  className={`m-0 h-auto w-auto border p-0 hover:border-[#0170D6] hover:bg-[#0170D666] ${isButtonModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                >
                  <div
                    className={`btn-animate-chars ${canEdit ? "" : "cursor-not-allowed"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canEdit) {
                        setIsButtonModalOpen(true);
                      }
                    }}
                  >
                    <span className="btn-animate-chars__text">
                      {projectData?.buttonConfig?.buttonTitle ||
                        "Iniciar Projeto"}
                    </span>
                    <EditableButton
                      isModalOpen={isButtonModalOpen}
                      setIsModalOpen={setIsButtonModalOpen}
                      position="below"
                      editingId="intro-button"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="hero_component">
              <div className="hero_left">
                <div className="heading-wrap">
                  <h1 className="heading-style-h1 text-weight-light">Olá,</h1>
                  <EditableAvatar
                    imageUrl={clientPhoto}
                    onImageChange={(newPhoto: string | null) =>
                      updateIntroduction({ clientPhoto: newPhoto || undefined })
                    }
                    size="lg"
                    editingId="intro-clientPhoto"
                    className="heading-client-image"
                  />
                  <EditableText
                    value={userName || "Cliente"}
                    onChange={(newUserName: string) =>
                      updateIntroduction({ userName: newUserName })
                    }
                    className="heading-style-h1 text-weight-light"
                    editingId="intro-userName-hero"
                  />
                </div>
                <h1 className="heading-line">—</h1>
                <EditableText
                  value={title || "Título da sua proposta aqui"}
                  onChange={(newTitle: string) =>
                    updateIntroduction({ title: newTitle })
                  }
                  className="heading-style-h1 text-weight-light w-full"
                  editingId="intro-title"
                />
              </div>
              <div className="hero_right">
                {projectData?.projectValidUntil && (
                  <div className="flex flex-col items-end gap-3">
                    <div
                      className={`relative m-0 h-auto w-auto border p-0 hover:border-[#0170D6] hover:bg-[#0170D666] ${isDateModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                    >
                      <div
                        className={`text-size-regular ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canEdit) {
                            setIsDateModalOpen(true);
                          }
                        }}
                        style={{
                          border: isDateModalOpen
                            ? "1px solid #0170D6"
                            : "1px solid transparent",
                          background: isDateModalOpen
                            ? "#0170D666"
                            : "transparent",
                          padding: "4px",
                        }}
                      >
                        Proposta —{" "}
                        <span className="text-color-grey">
                          {formatDateToDDDeMonthDeYYYY(
                            projectData.projectValidUntil.toString()
                          )}
                        </span>
                      </div>
                      <EditableDate
                        isModalOpen={isDateModalOpen}
                        setIsModalOpen={setIsDateModalOpen}
                        editingId="intro-date"
                      />
                    </div>
                    {subtitle && (
                      <div className="max-w-[340px] text-right">
                        <EditableText
                          value={subtitle}
                          onChange={(newSubtitle: string) =>
                            updateIntroduction({ subtitle: newSubtitle })
                          }
                          className="text-size-regular text-color-grey"
                          editingId="intro-subtitle"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div
          className={`marquee_component ${openServiceModalId ? "paused" : ""}`}
        >
          <div className="marquee_content">
            {/* First set of images */}
            <div className="marquee_item">
              {workingServices.map((service) => (
                <div
                  key={service.id}
                  className={`marquee-img relative cursor-pointer ${
                    openServiceModalId === service.id
                      ? "active ring-4 ring-[#0170D6] ring-offset-2 ring-offset-black"
                      : "hover:ring-2 hover:ring-[#0170D6] hover:ring-offset-2 hover:ring-offset-black"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🐛 Marquee item clicked:", {
                      serviceId: service.id,
                      currentOpenId: openServiceModalId,
                      target: e.target,
                    });
                    setOpenServiceModalId(
                      openServiceModalId === service.id ? null : service.id
                    );
                  }}
                >
                  <Image
                    src={
                      service.image || "/images/templates/flash/placeholder.png"
                    }
                    alt={service.serviceName || ""}
                    fill
                    style={{
                      objectFit: "cover",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    priority
                  />
                </div>
              ))}
            </div>
            {/* Second set (duplicate for infinite scroll) */}
            <div className="marquee_item">
              {workingServices.map((service) => (
                <div
                  key={`${service.id}-clone`}
                  className={`marquee-img relative cursor-pointer ${
                    openServiceModalId === service.id
                      ? "active ring-4 ring-[#0170D6] ring-offset-2 ring-offset-black"
                      : "hover:ring-2 hover:ring-[#0170D6] hover:ring-offset-2 hover:ring-offset-black"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenServiceModalId(
                      openServiceModalId === service.id ? null : service.id
                    );
                  }}
                >
                  <Image
                    src={
                      service.image || "/images/templates/flash/placeholder.png"
                    }
                    alt={service.serviceName || ""}
                    fill
                    style={{
                      objectFit: "cover",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EditableImage modals rendered outside overflow container */}
        {workingServices.map((service) => (
          <EditableImage
            key={`modal-${service.id}`}
            isModalOpen={openServiceModalId === service.id}
            setIsModalOpen={(isOpen) => {
              console.log("🐛 Marquee setIsModalOpen:", {
                isOpen,
                serviceId: service.id,
              });
              setOpenServiceModalId(isOpen ? service.id : null);
            }}
            editingId={`intro-service-${service.id}`}
            itemType="introServices"
            items={workingServices}
            currentItemId={service.id}
            onUpdateItem={(id, data) =>
              updateIntroductionService(
                id as string,
                data as Partial<IntroductionService>
              )
            }
            onReorderItems={(items) =>
              reorderIntroductionServices(items as IntroductionService[])
            }
          />
        ))}
      </section>
    </>
  );
}
