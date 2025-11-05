"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveUp, MoveDown } from "lucide-react";
import {
  TestimonialsSection,
  Testimonial,
  TeamMember,
  Result,
  ExpertiseTopic,
} from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashTestimonials({
  mainColor,
  hideSection,
  items,
}: TestimonialsSection) {
  const { updateTestimonialItem, reorderTestimonialItems, activeEditingId } = useEditor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  
  const canEdit = activeEditingId === null;

  const currentTestimonial = items?.[currentIndex];
  let bg;
  let bgMobile;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  }
  if (mainColor === "#BE8406") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #BE8406 64.22%, #BE8406 64.9%, #CEA605 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #BE8406 64.9%, #CEA605 81.78%)`;
  }
  if (mainColor === "#9B3218") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #9B3218 44.22%, #9B3218 64.9%, #9B3218 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
  }
  if (mainColor === "#05722C") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #05722C 44.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
  }
  if (mainColor === "#182E9B") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #182E9B 44.22%, #182E9B 64.9%, #443FBE 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  }
  if (mainColor === "#212121") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #212121 24.22%, #212121 64.9%, #3A3A3A 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  }

  const handlePrevious = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? (items?.length ?? 0) - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 800);
  };

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === (items?.length ?? 0) - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="relative z-10 mx-auto mt-7 mb-23 h-[900px] max-w-[1440px] px-6 lg:px-60 lg:pt-22 xl:pb-36">
          <div className="mb-12 flex items-center gap-2 pl-0 xl:pl-7">
            <div className="bg-white-neutral-light-100 h-3 w-3 rounded-full" />
            <p className="text-sm font-semibold text-white">Depoimentos</p>
          </div>

          <div className={`border-l border-l-[#545257]/50 lg:pl-7`}>
            <div
              onClick={() => {
                if (canEdit || openModalId === currentTestimonial?.id) {
                  setOpenModalId(currentTestimonial?.id ?? null);
                }
              }}
              className={`text-[#E6E6E6 relative flex flex-col items-start rounded-[4px] text-sm font-bold ${
                !!openModalId
                  ? "cursor-default border border-[#0170D6] bg-[#0170D666]"
                  : canEdit ? "cursor-pointer hover:border-[#0170D6] hover:bg-[#0170D666] border border-transparent" : "cursor-not-allowed border border-transparent"
              } `}
            >
              <div
                onClick={() => {
                  if (canEdit || openModalId === currentTestimonial?.id) {
                    setOpenModalId(currentTestimonial?.id ?? null);
                  }
                }}
                className={`transition-opacity duration-800 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="mb-7 text-[24px] text-[#E6E6E6] md:text-[32px]">
                  {currentTestimonial?.testimonial}
                </p>
                <div className="flex items-center gap-3">
                  {!currentTestimonial?.hidePhoto &&
                    currentTestimonial?.photo && (
                      <div className="relative h-[54px] w-[54px] overflow-hidden rounded-full">
                        <Image
                          src={currentTestimonial?.photo}
                          alt={`Depoimento de ${currentTestimonial?.name}`}
                          fill
                          className="object-cover"
                          style={{ aspectRatio: "auto" }}
                          quality={95}
                        />
                      </div>
                    )}
                  <div>
                    <p className="text-[18px] font-semibold text-[#E6E6E6]">
                      {currentTestimonial?.name}
                    </p>
                    {currentTestimonial?.role && (
                      <p className="text-[18px] font-medium text-[#A0A0A0]">
                        {currentTestimonial?.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <EditableImage
                isModalOpen={openModalId === currentTestimonial?.id}
                setIsModalOpen={(isOpen) =>
                  setOpenModalId(
                    isOpen ? (currentTestimonial?.id ?? null) : null
                  )
                }
                editingId={`testimonials-${currentTestimonial?.id}`}
                itemType="testimonials"
                items={items || []}
                currentItemId={currentTestimonial?.id ?? null}
                onUpdateItem={
                  updateTestimonialItem as (
                    itemId: string,
                    data:
                      | Partial<Testimonial>
                      | Partial<TeamMember>
                      | Partial<Result>
                      | Partial<ExpertiseTopic>
                  ) => void
                }
                onReorderItems={
                  reorderTestimonialItems as (
                    items:
                      | Testimonial[]
                      | TeamMember[]
                      | Result[]
                      | ExpertiseTopic[]
                  ) => void
                }
              />
            </div>

            <div className="mt-30 flex items-center gap-1">
              <button
                onClick={handlePrevious}
                disabled={
                  isTransitioning || (items?.length ?? 0) <= 1 || !!openModalId
                }
                className={`flex h-10 w-10 rotate-270 items-center justify-center rounded-full bg-[#E6E6E6] shadow-lg transition-colors disabled:opacity-50 ${!!openModalId ? "cursor-default" : "cursor-pointer hover:bg-gray-50"}`}
                aria-label="Depoimento anterior"
              >
                <MoveUp size={12} className="text-black" />
              </button>
              <button
                onClick={handleNext}
                disabled={
                  isTransitioning || (items?.length ?? 0) <= 1 || !!openModalId
                }
                className={`flex h-10 w-10 rotate-270 items-center justify-center rounded-full bg-[#E6E6E6] shadow-lg transition-colors disabled:opacity-50 ${!!openModalId ? "cursor-default" : "cursor-pointer hover:bg-gray-50"}`}
                aria-label="Próximo depoimento"
              >
                <MoveDown size={12} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="block lg:hidden"
        style={{
          width: 1242,
          height: 746,
          background: bgMobile,
          filter: "blur(80px)",
          position: "absolute",
          bottom: -500,
          right: -580,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />

      <div
        className="hidden lg:block"
        style={{
          width: 746,
          height: 846,
          background: bg,
          filter: "blur(80px)",
          position: "absolute",
          bottom: 0,
          right: -500,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />
    </div>
  );
}
