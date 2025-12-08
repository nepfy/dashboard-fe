"use client";

import { useState } from "react";
import Image from "next/image";
import { AboutUsSection, AboutUsItem } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import EditableImage from "#/app/editar/components/EditableImage";
import EditableMarqueeText from "#/app/editar/components/EditableMarqueeText";
import { useEditor } from "../../../contexts/EditorContext";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";

export default function MinimalAboutUs({
  title,
  subtitle,
  hideSection,
  marqueeText,
  hideMarquee,
  items,
}: AboutUsSection) {
  const {
    updateAboutUs,
    updateAboutUsItem,
    reorderAboutUsItems,
    projectData,
    activeEditingId,
  } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [modalAnchorRect, setModalAnchorRect] = useState<DOMRect | null>(null);

  // Create temporary items when array is empty so modal can work
  const workingItems =
    items && items.length > 0
      ? items
      : [
          {
            id: "aboutUs-temp-1",
            image: "/images/templates/flash/placeholder.png",
            caption: "Clique para adicionar imagem e descrição",
            sortOrder: 0,
          } as AboutUsItem,
          {
            id: "aboutUs-temp-2",
            image: "/images/templates/flash/placeholder.png",
            caption: "Clique para adicionar imagem e descrição",
            sortOrder: 1,
          } as AboutUsItem,
        ];

  console.log("🐛 AboutUs Debug:", {
    itemsLength: items?.length || 0,
    workingItemsLength: workingItems.length,
    hideSection,
    openModalId,
    activeEditingId,
    items: items,
    workingItems: workingItems,
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
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .about-item {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .about-video {
          width: 100%;
          border-radius: 0;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .about-item:nth-child(1) .about-video {
          aspect-ratio: 16/9;
        }

        .about-item:nth-child(2) .about-video {
          aspect-ratio: 9/16;
          max-height: 630px;
        }

        .about-video:hover {
          opacity: 0.9;
        }

        .about-video img,
        .about-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-caption {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          cursor: text;
        }

        .about-marquee {
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          max-height: 390px;
          transition: all 0.2s ease;
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
            gap: 2rem;
          }
          .about-item:nth-child(1) .about-video {
            aspect-ratio: 16/9;
          }
          .about-item:nth-child(2) .about-video {
            aspect-ratio: 16/9;
          }
          .heading-style-h2 {
            font-size: 2rem;
          }
        }

        @media screen and (max-width: 767px) {
          .about-content {
            gap: 1.5rem;
          }
          .about-item {
            gap: 1rem;
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
                {workingItems.map((item, index) => (
                  <div key={item.id || index} className="about-item">
                    <div
                      className="about-video"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = (
                          e.currentTarget as HTMLDivElement
                        ).getBoundingClientRect();
                        setModalAnchorRect(rect);
                        setOpenModalId(
                          openModalId === item.id ? null : (item?.id ?? null)
                        );
                      }}
                    >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.caption || ""}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={index < 2}
                          />
                        )}
                      </div>
                    {item.caption && (
                      <p className="about-caption">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EditableImage modals rendered outside overflow container */}
        {workingItems.map((item) => (
          <EditableImage
            key={`modal-${item.id}`}
            isModalOpen={openModalId === item.id}
            setIsModalOpen={(isOpen) =>
              setOpenModalId(isOpen ? (item?.id ?? null) : null)
            }
            editingId={`aboutUs-${item.id}`}
            itemType="aboutUs"
            items={workingItems}
            currentItemId={item?.id ?? null}
            anchorRect={modalAnchorRect}
            onUpdateItem={updateAboutUsItem}
            onReorderItems={(reorderedItems) =>
              reorderAboutUsItems(reorderedItems as AboutUsItem[])
            }
          />
        ))}

        {!hideMarquee && (
          <div className="about-marquee">
            <div className="marquee_content">
              <div className="about-marquee_text">
                <EditableMarqueeText
                  value={
                    marqueeText ||
                    "Brand Design → Design Systems → UI Design → Webflow Development"
                  }
                  onChange={(newMarqueeText: string) =>
                    updateAboutUs({ marqueeText: newMarqueeText })
                  }
                  editingId="aboutUs-marquee"
                  title="Marquee"
                  placeholder="Clique para adicionar imagem e descrição"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
