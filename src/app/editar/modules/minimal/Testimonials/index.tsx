"use client";

import { useState } from "react";
import Image from "next/image";
import { TestimonialsSection } from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalTestimonialsProps extends TestimonialsSection {
  mainColor?: string;
}

export default function MinimalTestimonials({
  items,
  hideSection,
  mainColor = "#000000",
}: MinimalTestimonialsProps) {
  const {
    updateTestimonialItem,
    reorderTestimonialItems,
  } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  if (hideSection || !items || items.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_testimonials {
          position: relative;
          background-color: ${mainColor};
          color: var(--white);
          padding: 8rem 0;
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
        
        .testimonials-heading {
          margin-bottom: 4rem;
        }
        
        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .text-size-small {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
        }
        
        .heading-style-h2 {
          color: var(--white);
          margin: 1rem 0 0;
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.3;
        }
        
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .testimonial-card {
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          cursor: pointer;
          transition: all .3s;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .testimonial-card:hover {
          border-color: rgba(255, 255, 255, .3);
          background: rgba(255, 255, 255, .02);
        }
        
        .testimonial-text {
          font-size: 1.125rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .9);
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .testimonial-photo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(255, 255, 255, .05);
          position: relative;
        }
        
        .testimonial-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .testimonial-name {
          font-size: 1rem;
          font-weight: 500;
          color: var(--white);
        }
        
        .testimonial-role {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
        }
        
        .edit-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, .1);
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: .5rem;
          padding: .5rem .75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s, background .2s;
          z-index: 100;
        }
        
        .section_testimonials:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .section_testimonials {
            padding: 5rem 0;
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section_testimonials">
        <div className="padding-global">
          <div className="container-large">
            <div className="testimonials-heading">
              <div className="text-style-allcaps text-size-small">Testimonials</div>
              <h2 className="heading-style-h2">What Our Clients Say</h2>
            </div>
            <div className="testimonials-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`testimonial-card relative cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666] ${
                    openModalId === item.id
                      ? "border-[#0170D6] bg-[#0170D666]"
                      : ""
                  }`}
                  onClick={() => setOpenModalId(item?.id ?? null)}
                >
                  <div className="testimonial-text">&quot;{item.testimonial}&quot;</div>
                  <div className="testimonial-author">
                    <div className="testimonial-photo">
                      {!item.hidePhoto && item.photo && (
                        <Image
                          src={item.photo}
                          alt={item.name || ""}
                          fill
                          style={{ objectFit: "cover" }}
                          priority={(item?.sortOrder ?? 0) < 3}
                        />
                      )}
                    </div>
                    <div className="testimonial-info">
                      <div className="testimonial-name">{item.name}</div>
                      <div className="testimonial-role">{item.role}</div>
                    </div>
                  </div>
                  <EditableImage
                    isModalOpen={openModalId === item.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (item?.id ?? null) : null)
                    }
                    editingId={`testimonials-${item.id}`}
                    itemType="testimonials"
                    items={items || []}
                    currentItemId={item?.id ?? null}
                    // @ts-expect-error - Type mismatch between Testimonial and other item types
                    onUpdateItem={updateTestimonialItem}
                    // @ts-expect-error - Type mismatch for reorder function
                    onReorderItems={reorderTestimonialItems}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
