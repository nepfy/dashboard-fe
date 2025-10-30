import { useMemo, useState } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import CloseIcon from "#/components/icons/CloseIcon";
import TabNavigation from "./TabNavigation";
import ContentTab from "./ContentTab";
import DeliveriesTab from "./DeliveriesTab";
import ButtonTab from "./ButtonTab";
import ShowInfo from "./ShowInfo";
import ShowPlanInfo from "./ShowPlanInfo";
import ConfirmExclusion from "./ConfirmExclusion";
import { Plan } from "#/types/template-data";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import ItemSelector from "./ItemSelector";

type TabType = "conteudo" | "entregas" | "botao";

export default function EditablePlan({
  plan,
  isModalOpen,
  setIsModalOpen,
}: {
  plan: Plan;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("conteudo");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showPlanInfo, setShowPlanInfo] = useState<boolean>(false);
  const [showConfirmExclusion, setShowConfirmExclusion] =
    useState<boolean>(false);
  const { projectData, updatePlanItem, addPlanItem, deletePlanItem } =
    useEditor();

  const plans = useMemo(
    () => projectData?.proposalData?.plans?.plansItems || [],
    [projectData?.proposalData?.plans?.plansItems]
  );
  const NEW_PLAN_ID = "__new_plan__";
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plan.id);
  const selectedPlan = useMemo(() => {
    if (selectedPlanId === NEW_PLAN_ID) return null;
    return plans.find((p) => p.id === selectedPlanId) || plan;
  }, [plans, selectedPlanId, plan]);

  const [pendingUpdates, setPendingUpdates] = useState<Partial<Plan>>({});

  const hasChanges = useMemo(
    () => Object.keys(pendingUpdates).length > 0,
    [pendingUpdates]
  );

  const handleSave = async () => {
    if (!selectedPlanId || !hasChanges) return;
    if (selectedPlanId === NEW_PLAN_ID) {
      if (plans.length >= 3) return;
      const newId = addPlanItem({ ...pendingUpdates });
      if (newId) setSelectedPlanId(newId);
    } else {
      updatePlanItem(selectedPlanId, pendingUpdates);
    }
    setPendingUpdates({});
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedPlanId) return;
    deletePlanItem(selectedPlanId);
    setShowConfirmExclusion(false);
    setPendingUpdates({});
  };
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <EditableModal
      className="absolute top-0 right-[-140px] z-50 flex h-[550px] cursor-default flex-col items-stretch sm:z-12 sm:h-[650px]"
      trianglePosition="top-[85px] left-[-8px]"
      isOpen={isModalOpen}
    >
      {!showInfo && !showPlanInfo && !showConfirmExclusion && (
        <>
          <div
            className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-lg font-medium text-[#2A2A2A]">Planos</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPendingUpdates({});
                setIsModalOpen(false);
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
            >
              <CloseIcon width="12" height="12" fill="#1C1A22" />
            </button>
          </div>

          <div className="h-[77%]">
            <ItemSelector
              items={plans}
              selectedItemId={selectedPlanId}
              onItemSelect={(id) => {
                setSelectedPlanId(id);
                setPendingUpdates({});
              }}
              onAddItem={() => {
                if (plans.length >= 3) return;
                setSelectedPlanId(NEW_PLAN_ID);
                setPendingUpdates({
                  title: "",
                  description: "",
                  value: "",
                  planPeriod: "",
                  recommended: false,
                  buttonTitle: "",
                  buttonWhereToOpen: "link",
                  buttonHref: "",
                  buttonPhone: "",
                  includedItems: [],
                });
              }}
            />
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            {activeTab === "conteudo" && (
              <ContentTab
                plan={
                  {
                    ...(selectedPlan || ({} as Plan)),
                    ...pendingUpdates,
                  } as Plan
                }
                currentItem={selectedPlan || ({} as Plan)}
                onUpdate={(data) =>
                  setPendingUpdates((prev) => ({ ...prev, ...data }))
                }
                setShowPlanInfo={setShowPlanInfo}
                onDeleteItem={() => setShowConfirmExclusion(true)}
              />
            )}
            {activeTab === "entregas" && (
              <DeliveriesTab
                includedItems={
                  (pendingUpdates.includedItems as Plan["includedItems"]) ||
                  selectedPlan?.includedItems ||
                  []
                }
                onUpdate={({ reorderedItems }) =>
                  setPendingUpdates((prev) => ({
                    ...prev,
                    includedItems: reorderedItems,
                  }))
                }
                onDeleteItem={() => setShowConfirmExclusion(true)}
              />
            )}
            {activeTab === "botao" && (
              <ButtonTab
                plan={
                  {
                    ...(selectedPlan || ({} as Plan)),
                    ...pendingUpdates,
                  } as Plan
                }
                setShowInfo={setShowInfo}
                onChange={(data) =>
                  setPendingUpdates((prev) => ({ ...prev, ...data }))
                }
              />
            )}
          </div>

          <div className="bg-white-neutral-light-100 w-full flex-shrink-0 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={!hasChanges}
              className={`flex w-full transform items-center justify-center gap-1 rounded-[12px] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 ${
                hasChanges
                  ? "cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Alterar
            </button>
          </div>
        </>
      )}
      {showInfo && !showPlanInfo && !showConfirmExclusion && (
        <ShowInfo setShowInfo={setShowInfo} />
      )}

      {showPlanInfo && !showInfo && !showConfirmExclusion && (
        <ShowPlanInfo setShowPlanInfo={setShowPlanInfo} />
      )}

      {showConfirmExclusion && !showInfo && !showPlanInfo && (
        <ConfirmExclusion
          onClose={() => setShowConfirmExclusion(false)}
          onConfirm={handleDelete}
        />
      )}
    </EditableModal>
  );
}
