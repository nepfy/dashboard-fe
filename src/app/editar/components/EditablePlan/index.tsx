import { useEffect, useMemo, useState } from "react";
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
  editingId,
}: {
  plan: Plan;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("conteudo");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showPlanInfo, setShowPlanInfo] = useState<boolean>(false);
  const [showConfirmExclusion, setShowConfirmExclusion] =
    useState<boolean>(false);
  const {
    projectData,
    deletePlanItem,
    updatePlans,
    startEditing,
    stopEditing,
  } = useEditor();

  const plans = useMemo(
    () => projectData?.proposalData?.plans?.plansItems || [],
    [projectData?.proposalData?.plans?.plansItems]
  );
  const NEW_PLAN_ID = "__new_plan__";
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plan.id);
  const [pendingByPlanId, setPendingByPlanId] = useState<
    Record<string, Partial<Plan>>
  >({});

  const selectedPlan = useMemo(() => {
    if (selectedPlanId === NEW_PLAN_ID) return null;
    return plans.find((p) => p.id === selectedPlanId) || plan;
  }, [plans, selectedPlanId, plan]);

  // Create items list that includes existing plans plus pending draft
  const itemsForSelector = useMemo(() => {
    const items = [...plans];
    const pendingDraft = pendingByPlanId[NEW_PLAN_ID];
    if (pendingDraft) {
      // Create a temporary plan object for the pending draft
      const tempPlan: Plan = {
        id: NEW_PLAN_ID,
        title: pendingDraft.title || "",
        description: pendingDraft.description || "",
        value: pendingDraft.value || "",
        planPeriod: pendingDraft.planPeriod || "",
        recommended: !!pendingDraft.recommended,
        buttonTitle: pendingDraft.buttonTitle || "",
        buttonWhereToOpen: pendingDraft.buttonWhereToOpen || "link",
        buttonHref: pendingDraft.buttonHref || "",
        buttonPhone: pendingDraft.buttonPhone || "",
        hideTitleField: false,
        hideDescription: false,
        hidePrice: false,
        hidePlanPeriod: false,
        hideButtonTitle: false,
        includedItems: pendingDraft.includedItems || [],
        sortOrder: plans.length,
        hideItem: false,
      };
      items.push(tempPlan);
    }
    return items;
  }, [plans, pendingByPlanId]);

  // Ensure that when the modal opens (or plan prop changes), we focus the plan passed in props
  useEffect(() => {
    if (isModalOpen) {
      // Try to start editing when modal opens
      const canStartEditing = startEditing(editingId);
      if (!canStartEditing) {
        // If another field/modal is already active, close this modal
        setIsModalOpen(false);
        return;
      }
      setSelectedPlanId(plan.id);
    } else {
      // Stop editing when modal closes
      stopEditing(editingId);
    }
  }, [
    isModalOpen,
    plan.id,
    editingId,
    startEditing,
    stopEditing,
    setIsModalOpen,
  ]);
  const setPendingFor = (planId: string, updates: Partial<Plan>) => {
    setPendingByPlanId((prev) => ({
      ...prev,
      [planId]: { ...(prev[planId] || {}), ...updates },
    }));
  };
  const getPendingFor = (planId: string | null) =>
    (planId && pendingByPlanId[planId]) || ({} as Partial<Plan>);

  const hasChanges = useMemo(
    () => Object.keys(pendingByPlanId).length > 0,
    [pendingByPlanId]
  );

  const handleSave = async () => {
    if (!hasChanges) return;

    let currentPlans = plans;
    let newlyCreatedId: string | null = null;

    // Create new plan if draft exists
    const draft = pendingByPlanId[NEW_PLAN_ID];
    if (draft) {
      if (currentPlans.length >= 3) return;
      const newId = `plan-${Date.now()}`;
      const newPlan: Plan = {
        id: newId,
        title: draft.title || "",
        description: draft.description || "",
        value: draft.value || "",
        planPeriod: draft.planPeriod || "",
        recommended: !!draft.recommended,
        buttonTitle: draft.buttonTitle || "",
        buttonWhereToOpen: draft.buttonWhereToOpen || "link",
        buttonHref: draft.buttonHref || "",
        buttonPhone: draft.buttonPhone || "",
        hideTitleField: false,
        hideDescription: false,
        hidePrice: false,
        hidePlanPeriod: false,
        hideButtonTitle: false,
        includedItems: draft.includedItems || [],
        sortOrder: currentPlans.length,
        hideItem: false,
      };
      if (draft.recommended) {
        currentPlans = currentPlans.map((p) => ({ ...p, recommended: false }));
      }
      currentPlans = [...currentPlans, newPlan];
      newlyCreatedId = newId;
    }

    // Apply updates for existing plans
    const entries = Object.entries(pendingByPlanId).filter(
      ([id]) => id !== NEW_PLAN_ID
    );
    if (entries.length > 0) {
      const recEntry = entries.find(([, upd]) => upd.recommended === true);
      if (recEntry) {
        const [recId, recUpd] = recEntry;
        currentPlans = currentPlans.map((p) =>
          p.id === recId
            ? { ...p, ...recUpd, recommended: true }
            : { ...p, ...(pendingByPlanId[p.id] || {}), recommended: false }
        );
      } else {
        currentPlans = currentPlans.map((p) => ({
          ...p,
          ...(pendingByPlanId[p.id] || {}),
        }));
      }
    }

    updatePlans({ plansItems: currentPlans });
    if (newlyCreatedId) setSelectedPlanId(newlyCreatedId);
    setPendingByPlanId({});
    setIsModalOpen(false);
    stopEditing(editingId);
  };

  const handleDelete = async () => {
    if (!selectedPlanId) return;
    deletePlanItem(selectedPlanId);
    setShowConfirmExclusion(false);
    setPendingByPlanId((prev) => {
      const next = { ...prev };
      delete next[selectedPlanId];
      return next;
    });
  };
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <EditableModal
      className="flex h-[550px] cursor-default flex-col items-stretch sm:h-[650px]"
      isOpen={isModalOpen}
      preferredPlacement="right"
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
                setPendingByPlanId({});
                setIsModalOpen(false);
                stopEditing(editingId);
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
            >
              <CloseIcon width="12" height="12" fill="#1C1A22" />
            </button>
          </div>

          <div className="h-[77%]">
            <ItemSelector
              items={itemsForSelector}
              selectedItemId={selectedPlanId}
              onItemSelect={(id) => {
                setSelectedPlanId(id);
              }}
              onAddItem={() => {
                if (plans.length >= 3) return;
                setSelectedPlanId(NEW_PLAN_ID);
                setPendingFor(NEW_PLAN_ID, {
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
                    ...getPendingFor(selectedPlanId),
                  } as Plan
                }
                currentItem={selectedPlan || ({} as Plan)}
                onUpdate={(data) =>
                  selectedPlanId && setPendingFor(selectedPlanId, data)
                }
                setShowPlanInfo={setShowPlanInfo}
                onDeleteItem={() => setShowConfirmExclusion(true)}
              />
            )}
            {activeTab === "entregas" && (
              <DeliveriesTab
                includedItems={
                  (getPendingFor(selectedPlanId)
                    .includedItems as Plan["includedItems"]) ||
                  selectedPlan?.includedItems ||
                  []
                }
                onUpdate={({ reorderedItems }) => {
                  if (!selectedPlanId) return;
                  setPendingFor(selectedPlanId, {
                    includedItems: reorderedItems,
                  });
                }}
                onDeleteItem={() => setShowConfirmExclusion(true)}
              />
            )}
            {activeTab === "botao" && (
              <ButtonTab
                plan={
                  {
                    ...(selectedPlan || ({} as Plan)),
                    ...getPendingFor(selectedPlanId),
                  } as Plan
                }
                setShowInfo={setShowInfo}
                onChange={(data) =>
                  selectedPlanId && setPendingFor(selectedPlanId, data)
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
              Salvar Alterações
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
