/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import EditableButton from "#/app/editar/components/EditableButton";
import EditableLogo from "#/app/editar/components/EditableLogo";
import EditableAvatar from "#/app/editar/components/EditableAvatar";
import { useEditor } from "../../../contexts/EditorContext";

export default function MinimalIntro({ userName, title, subtitle, logo, clientPhoto, description }: IntroductionSection) {
  const { updateIntroduction, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;

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
          align-items: flex-end;
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
        }

        .marquee_content {
          display: flex;
          gap: 1rem;
          animation: marquee 30s linear infinite;
          max-height: 560px;
        }

        .marquee_item {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
          max-height: 560px;
        }

        .marquee-img {
          width: 72.5rem;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .marquee-img img,
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
          .marquee-img {
            width: 100vw;
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
                  <div className="flex flex-col gap-3 items-end">
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
        <div className="marquee_component">
          <div className="marquee_content">
            <div className="marquee_item">
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
            </div>
            <div className="marquee_item">
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
              <div className="marquee-img">
                {}
                <img src="/images/templates/flash/placeholder.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
