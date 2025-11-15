/* eslint-disable @next/next/no-img-element */
"use client";

import { AboutUsSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import { useEditor } from "../../../contexts/EditorContext";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import { useState } from "react";

export default function MinimalAboutUs({
  title,
  subtitle,
  hideSection,
}: AboutUsSection) {
  const { updateAboutUs, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;

  if (hideSection) return null;

  return (
    <>
      <style jsx global>{`
        .section_about {
          background-color: #000000;
          color: #fbfbfb;
        }

        .about_component {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .about-heading {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: flex-start;
        }

        .about-heading_left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .about-heading_title {
          display: flex;
          align-items: flex-start;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .about-dev,
        .about-design {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .about-video {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .about-video img,
        .about-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-paragraph {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
        }

        .about-marquee {
          margin-top: 4rem;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          max-height: 390px;
        }

        .about-marquee_text {
          font-size: 15vw;
          font-weight: 300;
          color: rgba(255, 255, 255);
          white-space: nowrap;
          animation: marquee 200s linear infinite;
          margin-top: 6rem;
        }

        .section_partners {
          background-color: #fbfbfb;
          color: #040404;
          padding: 8rem 0;
        }

        .partners-component {
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .partners-heading {
          max-width: 980px;
          padding-bottom: 2rem;
        }

        .heading-style-h2 {
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
        }

        .text-weight-normal {
          font-weight: 400;
        }

        .partners-paragraph {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 1rem;
          max-width: 100%;
        }

        .text-size-medium {
          font-size: 1.25rem;
          line-height: 1.5;
          color: rgba(4, 4, 4, 0.9);
          font-weight: 300;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .partners-logo {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ffffff;
        }

        .partners-logo:hover {
          opacity: 1;
        }

        @media screen and (max-width: 991px) {
          .about-heading {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .about-content {
            grid-template-columns: 1fr;
          }
          .heading-style-h2 {
            font-size: 2rem;
          }
        }

        @media screen and (max-width: 767px) {
          .section_partners {
            padding: 5rem 0;
          }
          .heading-style-h2 {
            font-size: 1.75rem;
          }
          .partners-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <section className="section_about">
        <div
          className="padding-global"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="container-large">
            <div className="about_component">
              <div className="about-heading mb-12">
                <div className="about-heading_left">
                  <div
                    className={`relative m-0 h-auto w-fit border p-0 hover:border-[#0170D6] hover:bg-[#0170D666] ${isDateModalOpen ? "border-[#0170D6] bg-[#0170D666]" : "border-transparent bg-transparent"}`}
                  >
                    <div
                      className={`text-size-regular text-weight-light ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canEdit) {
                          setIsDateModalOpen(true);
                        }
                      }}
                    >
                      Proposta —{" "}
                      <span className="text-color-grey">
                        {formatDateToDDDeMonthDeYYYY(
                          projectData?.projectValidUntil?.toString() || ""
                        )}
                      </span>
                      <EditableDate
                        isModalOpen={isDateModalOpen}
                        setIsModalOpen={setIsDateModalOpen}
                        editingId="aboutUs-date"
                      />
                    </div>
                  </div>
                  {subtitle && (
                    <EditableText
                      value={subtitle}
                      onChange={(newSubtitle: string) =>
                        updateAboutUs({ subtitle: newSubtitle })
                      }
                      className="text-size-medium"
                      editingId="aboutUs-subtitle"
                    />
                  )}
                </div>
                <div className="about-heading_title">
                  <EditableText
                    value={title || "Título da seção sobre"}
                    onChange={(newTitle: string) =>
                      updateAboutUs({ title: newTitle })
                    }
                    className="heading-style-h1 text-weight-light"
                    editingId="aboutUs-title"
                  />
                </div>
              </div>

              <div className="about-content">
                <div className="about-dev">
                  <div className="about-video">
                    {}
                    <img src="/images/templates/flash/placeholder.png" alt="" />
                  </div>
                  <div className="about-paragraph">
                    <p>
                      We&apos;re a creative studio focused on bringing brands to
                      life through thoughtful design and smart technology.
                    </p>
                  </div>
                </div>
                <div className="about-design">
                  <div className="about-video">
                    {}
                    <img src="/images/templates/flash/placeholder.png" alt="" />
                  </div>
                  <div className="about-paragraph">
                    <p>
                      We&apos;re a creative studio focused on bringing brands to
                      life through thoughtful design and smart technology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-marquee">
          <div className="marquee_content">
            <div className="about-marquee_text">
              Brand Design → Design Systems → UI Design → Webflow Development
            </div>
          </div>
        </div>
      </section>

      <section className="section_partners">
        <div className="padding-global">
          <div className="container-large">
            <div className="partners-component">
              <div className="partners-heading">
                <h2 className="heading-style-h2 text-weight-normal">
                  We recognized a gap in the creative industry—small businesses
                  often struggle to find high-quality, yet affordable, design
                  solutions. That&apos;s why we exist.
                </h2>
              </div>
              <div className="partners-paragraph">
                <div className="flex max-w-[45rem] flex-col items-end justify-end gap-6">
                  <p className="text-size-medium">
                    Your website is most likely the first point of contact
                    someone will have with your brand. Cut through the noise and
                    stand out from the crowd by creating a website that will
                    help you achieve your business goals while showing who you
                    are in a way people will not forget.
                  </p>
                  <p className="text-size-medium">
                    Design is about creating experiences, making the lives of
                    people easier, or even making it fun when you&apos;re not
                    having the best day. With that in mind, we provide services
                    to be your partner on your next project.
                  </p>
                </div>
              </div>
              <div className="partners-grid">
                <div className="partners-logo">
                  <span className="logo-embed w-embed flex max-h-[50px] max-w-[100px] items-center justify-center overflow-hidden">
                    <img
                      src="/images/templates/flash/placeholder.png"
                      alt=""
                      style={{
                        objectFit: "cover",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </span>
                </div>
                <div className="partners-logo">
                  <span className="logo-embed w-embed flex max-h-[50px] max-w-[100px] items-center justify-center overflow-hidden">
                    <img
                      src="/images/templates/flash/placeholder.png"
                      alt=""
                      style={{
                        objectFit: "cover",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </span>
                </div>
                <div className="partners-logo">
                  <span className="logo-embed w-embed flex max-h-[50px] max-w-[100px] items-center justify-center overflow-hidden">
                    <img
                      src="/images/templates/flash/placeholder.png"
                      alt=""
                      style={{
                        objectFit: "cover",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </span>
                </div>
                <div className="partners-logo">
                  <span className="logo-embed w-embed flex max-h-[50px] max-w-[100px] items-center justify-center overflow-hidden">
                    <img
                      src="/images/templates/flash/placeholder.png"
                      alt=""
                      style={{
                        objectFit: "cover",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
