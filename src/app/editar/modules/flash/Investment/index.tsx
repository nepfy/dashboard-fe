import { InvestmentSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function FlashInvestment({
  hideSection,
  title,
}: InvestmentSection) {
  const { updateInvestment } = useEditor();
  // let bg;
  // if (mainColor === "#4F21A1") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  // }
  // if (mainColor === "#BE8406") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #BE8406 64.22%, #BE8406 64.9%, #CEA605 81.78%)`;
  // }
  // if (mainColor === "#9B3218") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #9B3218 44.22%, #9B3218 64.9%, #9B3218 81.78%)`;
  // }
  // if (mainColor === "#05722C") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #05722C 44.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
  // }
  // if (mainColor === "#182E9B") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #182E9B 44.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  // }
  // if (mainColor === "#212121") {
  //   bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #212121 24.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  // }
  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-10 lg:px-41 lg:pt-22">
          <div className="max-w-[1055px] pb-21">
            <span className="inline text-[24px] font-semibold text-[#A0A0A0] lg:text-[48px]">
              Investimento.{" "}
            </span>{" "}
            <EditableText
              value={title || ""}
              onChange={(newTitle: string) =>
                updateInvestment({ title: newTitle })
              }
              className="mb-21 inline w-full text-[24px] font-normal text-[#E6E6E6] lg:text-[48px]"
              editingId="investment-title"
            />
          </div>
        </div>
      )}

      {/* <div
        className="hidden lg:block"
        style={{
          width: 746,
          height: 746,
          background: bg,
          filter: "blur(80px)",
          position: "absolute",
          bottom: 0,
          right: -500,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      /> */}
    </div>
  );
}
