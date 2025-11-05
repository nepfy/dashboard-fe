import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { InvestmentSection } from "#/types/template-data";

export default function FlashScope({
  hideProjectScope,
  projectScope,
}: InvestmentSection) {
  const { updateInvestment } = useEditor();
  return (
    <div className="bg-black">
      {!hideProjectScope && (
        <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-15 lg:px-41 lg:pb-24">
          <div className="max-w-[700px] border-l border-l-[#ffffff]/50 pl-5 lg:pl-10">
            <div className="mb-23 flex items-center gap-2 lg:mb-42">
              <div className="bg-white-neutral-light-100 h-3 w-3 rounded-full" />
              <p className="text-sm font-semibold text-white">
                Escopo do projeto
              </p>
            </div>

            <EditableText
              value={projectScope || ""}
              onChange={(newProjectScope: string) =>
                updateInvestment({ projectScope: newProjectScope })
              }
              className="w-full text-[#E6E6E6]"
              editingId="investment-projectScope"
            />
          </div>
        </div>
      )}
    </div>
  );
}
