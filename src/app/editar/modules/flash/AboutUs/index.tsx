import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { AboutUsSection } from "#/types/template-data";

export default function FlashAboutUs({
  hideSection,
  title,
  mainColor,
}: AboutUsSection) {
  const { updateAboutUs } = useEditor();
  let bg;
  let bgMobile;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  }

  if (mainColor === "#BE8406") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #C97C00 64.9%, #CEA605 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #BE8406 64.9%, #CEA605 81.78%)`;
  }

  if (mainColor === "#9B3218") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
  }

  if (mainColor === "#05722C") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #189B53 64.9%, #4ABE3F 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
  }

  if (mainColor === "#182E9B") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  }

  if (mainColor === "#212121") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  }

  return (
    <>
      {!hideSection && (
        <div className="bg-black relative overflow-hidden">
          <div
            className="hidden lg:block"
            style={{
              width: 1148,
              height: 1148,
              background: bg,
              filter: "blur(80px)",
              position: "absolute",
              top: -420,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
              overflow: "hidden",
              borderRadius: "100%",
            }}
          />

          <div
            className="lg:hidden"
            style={{
              width: 546,
              height: 546,
              background: bgMobile,
              filter: "blur(80px)",
              position: "absolute",
              top: -180,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
              overflow: "hidden",
              borderRadius: "100%",
            }}
          />
          <div className="flex justify-center items-center px-6 lg:px-12 xl:px-0 py-35 lg:py-62 relative z-10 max-w-[1440px] mx-auto">
            <div className="pl-4 lg:pl-10 pt-36 border-l border-l-[#A0A0A0] max-w-[1100px] inline">
              <div className="text-[18px] lg:text-[48px] text-[#E6E6E6] font-medium">
                <span className="font-bold inline">Sobre nós.</span>{" "}
                <EditableText
                  as="span"
                  value={title || ""}
                  onChange={(newTitle: string) =>
                    updateAboutUs({ title: newTitle })
                  }
                  className="text-[18px] lg:text-[48px] text-[#E6E6E6] font-medium inline"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
