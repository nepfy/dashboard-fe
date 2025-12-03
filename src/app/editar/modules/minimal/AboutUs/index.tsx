/* eslint-disable @next/next/no-img-element */
"use client";

import { AboutUsSection, AboutUsItem } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import { useState } from "react";

export default function MinimalAboutUs({
  title,
  subtitle,
  hideSection,
  marqueeText,
  hideMarquee,
  items,
}: AboutUsSection) {
  const { updateAboutUs, updateAboutUsItem, reorderAboutUsItems, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  console.log('🐛 AboutUs Debug:', {
    itemsLength: items?.length || 0,
    hideSection,
    openModalId,
    activeEditingId,
    firstItem: items?.[0],
  });

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
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 4rem;
        }

        .about-heading_left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .about-heading_title {
          display: flex;
          align-items: flex-start;
          flex: 1;
          max-width: 60%;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .about-item {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 1;
          transition: all 0.2s ease;
        }

        .about-item:hover {
          transform: scale(1.01);
        }

        .about-video {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          pointer-events: auto;
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
          margin-top: 3rem;
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
                      className="text-size-regular text-weight-light cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDateModalOpen(true);
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
                {items && items.length > 0 ? (
                  items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`about-item about-item-${index + 1} relative cursor-pointer ${
                        openModalId === item.id
                          ? "ring-2 ring-[#0170D6]"
                          : "hover:ring-2 hover:ring-[#0170D6]"
                      }`}
                      onClick={(e) => {
                        console.log('🐛 AboutUs item clicked:', {
                          itemId: item.id,
                          index,
                          currentOpenId: openModalId,
                          target: e.target,
                        });
                        setOpenModalId(item?.id ?? null);
                      }}
                    >
                      <div className="about-video">
                        <img
                          src={
                            item.image ||
                            "/images/templates/flash/placeholder.png"
                          }
                          alt={item.caption || ""}
                        />
                      </div>
                      <div className="about-paragraph">
                        <EditableText
                          value={item.caption || "Descrição da imagem"}
                          onChange={(newCaption: string) => {
                            const updatedItems = [...(items || [])];
                            updatedItems[index] = {
                              ...item,
                              caption: newCaption,
                            };
                            updateAboutUs({ items: updatedItems });
                          }}
                          className="text-size-regular text-color-grey"
                          editingId={`aboutUs-item-${index}-caption`}
                        />
                      </div>
                      <EditableImage
                        isModalOpen={openModalId === item.id}
                        setIsModalOpen={(isOpen) =>
                          setOpenModalId(isOpen ? (item?.id ?? null) : null)
                        }
                      editingId={`aboutUs-${item.id}`}
                      itemType="aboutUs"
                      items={items || []}
                      currentItemId={item?.id ?? null}
                      onUpdateItem={updateAboutUsItem}
                      onReorderItems={(reorderedItems) => reorderAboutUsItems(reorderedItems as AboutUsItem[])}
                    />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="about-item about-item-1">
                      <div className="about-video">
                        <img
                          src="/images/templates/flash/placeholder.png"
                          alt=""
                        />
                      </div>
                      <div className="about-paragraph">
                        <p>Descrição da primeira imagem</p>
                      </div>
                    </div>
                    <div className="about-item about-item-2">
                      <div className="about-video">
                        <img
                          src="/images/templates/flash/placeholder.png"
                          alt=""
                        />
                      </div>
                      <div className="about-paragraph">
                        <p>Descrição da segunda imagem</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {!hideMarquee && (
          <div className="about-marquee">
            <div className="marquee_content">
              <div className="about-marquee_text">
                <EditableText
                  value={
                    marqueeText ||
                    "Brand Design → Design Systems → UI Design → Webflow Development"
                  }
                  onChange={(newMarqueeText: string) =>
                    updateAboutUs({ marqueeText: newMarqueeText })
                  }
                  className="about-marquee_text"
                  editingId="aboutUs-marquee"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
