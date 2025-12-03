"use client";

import { useState, useEffect } from "react";
import EditableModal from "#/app/editar/components/EditableModal";
import MainModalContent from "./MainModalContent";
import ExploreGalleryInfo from "./ExploreGalleryInfo";
import UploadImageInfo from "./UploadImageInfo";
import PexelsGallery from "./PexelsGallery";
import UploadImage from "./UploadImage";
import ConfirmExclusion from "./ConfirmExclusion";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { trackBlockAdded } from "#/lib/analytics/track";
import {
  TeamMember,
  Result,
  ExpertiseTopic,
  Testimonial,
  StepTopic,
  FAQItem,
  AboutUsItem,
  IntroductionService,
} from "#/types/template-data";

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "team" | "results" | "expertise" | "testimonials" | "steps" | "faq" | "aboutUs" | "introServices";
  items: (
    | TeamMember
    | Result
    | ExpertiseTopic
    | Testimonial
    | StepTopic
    | FAQItem
    | AboutUsItem
    | IntroductionService
  )[];
  currentItemId: string | null;
  onUpdateItem: (
    itemId: string,
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | Partial<StepTopic>
      | Partial<FAQItem>
      | Partial<AboutUsItem>
      | Partial<IntroductionService>
  ) => void;
  onReorderItems: (
    items:
      | TeamMember[]
      | Result[]
      | ExpertiseTopic[]
      | Testimonial[]
      | StepTopic[]
      | FAQItem[]
      | AboutUsItem[]
      | IntroductionService[]
  ) => void;
  onUpdateSection?: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
}

type TabType = "conteudo" | "imagem" | "organizar";

export default function ItemEditorModal({
  isOpen,
  onClose,
  itemType,
  items,
  currentItemId,
  onUpdateItem,
  onReorderItems,
  onUpdateSection,
  hideIcon,
}: ItemEditorModalProps) {
  const { projectData } = useEditor();
  const [activeTab, setActiveTab] = useState<TabType>("conteudo");
  const [showExploreGalleryInfo, setShowExploreGalleryInfo] = useState(false);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [showUploadImageInfo, setShowUploadImageInfo] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showConfirmExclusion, setShowConfirmExclusion] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    currentItemId
  );
  const [pendingChanges, setPendingChanges] = useState<{
    itemUpdates: Record<
      string,
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | Partial<StepTopic>
      | Partial<FAQItem>
      | Partial<AboutUsItem>
      | Partial<IntroductionService>
    >;
    reorderedItems?: (
      | TeamMember
      | Result
      | ExpertiseTopic
      | Testimonial
      | StepTopic
      | FAQItem
      | AboutUsItem
      | IntroductionService
    )[];
    deletedItems: string[];
    newItems: (
      | TeamMember
      | Result
      | ExpertiseTopic
      | Testimonial
      | StepTopic
      | FAQItem
      | AboutUsItem
      | IntroductionService
    )[];
    sectionUpdates?: { hideIcon?: boolean };
  }>({
    itemUpdates: {},
    reorderedItems: undefined,
    deletedItems: [],
    newItems: [],
    sectionUpdates: undefined,
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    setSelectedItemId(currentItemId);
    setPendingChanges({
      itemUpdates: {},
      reorderedItems: undefined,
      deletedItems: [],
      newItems: [],
      sectionUpdates: undefined,
    });
  }, [currentItemId, itemType]);

  // Separate effect to handle steps tab behavior - doesn't reset pending changes
  useEffect(() => {
    if (itemType === "steps" && activeTab === "imagem") {
      setActiveTab("conteudo");
    }
  }, [itemType, activeTab]);

  const currentItem =
    items.find((item) => item.id === selectedItemId) ||
    pendingChanges.newItems.find((item) => item.id === selectedItemId) ||
    null;

  const getCurrentItemWithChanges = () => {
    if (!currentItem) return null;
    const pendingUpdates = pendingChanges.itemUpdates[currentItem.id!] || {};
    return { ...currentItem, ...pendingUpdates };
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleAddItem = () => {
    const totalItems = items.length + pendingChanges.newItems.length;

    // Define maximum items per section type
    const maxItems =
      itemType === "steps" || itemType === "faq"
        ? 10
        : itemType === "expertise"
          ? 9
          : 6; // team, results, testimonials

    if (totalItems < maxItems) {
      const newItem:
        | TeamMember
        | Result
        | ExpertiseTopic
        | Testimonial
        | StepTopic
        | FAQItem =
        itemType === "team"
          ? {
              id: `temp-${Date.now()}`,
              name: "",
              role: "",
              image: "",
              sortOrder: totalItems,
              hidePhoto: false,
            }
          : itemType === "results"
            ? {
                id: `temp-${Date.now()}`,
                client: "",
                instagram: "",
                investment: "",
                roi: "",
                photo: "",
                sortOrder: totalItems,
                hidePhoto: false,
              }
            : itemType === "expertise"
              ? {
                  id: `temp-${Date.now()}`,
                  title: "",
                  description: "",
                  icon: "",
                  sortOrder: totalItems,
                  hideTitleField: false,
                  hideDescription: false,
                }
              : itemType === "steps"
                ? {
                    id: `temp-${Date.now()}`,
                    title: "",
                    description: "",
                    sortOrder: totalItems,
                    hideStepName: false,
                    hideStepDescription: false,
                  }
                : itemType === "faq"
                  ? {
                      id: `temp-${Date.now()}`,
                      question: "",
                      answer: "",
                      sortOrder: totalItems,
                      hideQuestion: false,
                      hideAnswer: false,
                    }
                  : {
                      id: `temp-${Date.now()}`,
                      name: "",
                      role: "",
                      testimonial: "",
                      photo: "",
                      sortOrder: totalItems,
                      hidePhoto: false,
                    };

      setPendingChanges((prev) => ({
        ...prev,
        newItems: [...prev.newItems, newItem],
      }));

      setSelectedItemId(newItem.id!);
      setActiveTab("conteudo");
      
      // Track block added
      if (projectData?.id) {
        trackBlockAdded({
          proposal_id: projectData.id,
          block_type: itemType,
        });
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setShowConfirmExclusion(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const itemIdToDelete = itemToDelete; // Store the ID before resetting
      console.log("Confirming deletion of:", itemIdToDelete);

      setPendingChanges((prev) => {
        // Check if the item to delete is a newly added item
        const isNewItem = prev.newItems.some(
          (item) => item.id === itemIdToDelete
        );

        // Update selectedItemId if the current item is being deleted
        if (selectedItemId === itemIdToDelete) {
          const allItems = [...items, ...prev.newItems];
          const remainingItems = allItems.filter(
            (item) =>
              item.id !== itemIdToDelete &&
              !prev.deletedItems.includes(item.id!)
          );
          setSelectedItemId(
            remainingItems.length > 0 ? remainingItems[0].id || null : null
          );
        }

        if (isNewItem) {
          // If it's a new item, just remove it from newItems
          return {
            ...prev,
            newItems: prev.newItems.filter(
              (item) => item.id !== itemIdToDelete
            ),
          };
        } else {
          // If it's an existing item, add it to deletedItems
          return {
            ...prev,
            deletedItems: [...prev.deletedItems, itemIdToDelete],
          };
        }
      });

      setItemToDelete(null);
      setShowConfirmExclusion(false);
    }
  };

  const handleUpdateItem = (
    data:
      | Partial<TeamMember>
      | Partial<Result>
      | Partial<ExpertiseTopic>
      | Partial<Testimonial>
      | {
          reorderedItems: (
            | TeamMember
            | Result
            | ExpertiseTopic
            | Testimonial
          )[];
        }
  ) => {
    if ("reorderedItems" in data) {
      setPendingChanges((prev) => ({
        ...prev,
        reorderedItems: data.reorderedItems,
      }));
    } else if (selectedItemId) {
      setPendingChanges((prev) => ({
        ...prev,
        itemUpdates: {
          ...prev.itemUpdates,
          [selectedItemId]: {
            ...prev.itemUpdates[selectedItemId],
            ...data,
          },
        },
      }));
    }
  };

  const handleUpdateSection = (data: { hideIcon?: boolean }) => {
    setPendingChanges((prev) => ({
      ...prev,
      sectionUpdates: {
        ...prev.sectionUpdates,
        ...data,
      },
    }));
  };

  const handleSave = () => {
    const hasChanges =
      Object.keys(pendingChanges.itemUpdates).length > 0 ||
      pendingChanges.deletedItems.length > 0 ||
      pendingChanges.reorderedItems ||
      pendingChanges.newItems.length > 0 ||
      pendingChanges.sectionUpdates;

    if (!hasChanges) return;

    // Process section updates
    if (pendingChanges.sectionUpdates && onUpdateSection) {
      onUpdateSection(pendingChanges.sectionUpdates);
    }

    // Handle deletions, new items, or reordering by creating/updating the full array
    if (
      pendingChanges.deletedItems.length > 0 ||
      pendingChanges.newItems.length > 0 ||
      pendingChanges.reorderedItems
    ) {
      let finalItems;

      if (pendingChanges.reorderedItems) {
        // If items were reordered, use that as the base and apply any pending updates
        finalItems = pendingChanges.reorderedItems.map((item) => ({
          ...item,
          ...pendingChanges.itemUpdates[item.id!],
        }));
      } else {
        // Otherwise, start with current items
        const currentItems = items.filter(
          (item) => !pendingChanges.deletedItems.includes(item.id!)
        );

        // Apply any pending updates to remaining items
        const updatedItems = currentItems.map((item) => ({
          ...item,
          ...pendingChanges.itemUpdates[item.id!],
        }));

        // Add new items with their updates
        const newItemsWithUpdates = pendingChanges.newItems.map((item) => ({
          ...item,
          ...pendingChanges.itemUpdates[item.id!],
        }));

        finalItems = [...updatedItems, ...newItemsWithUpdates];
      }

      // Use reorderItems to set the final state
      onReorderItems(finalItems);
    } else {
      // If only individual field updates (no reordering/deletion/addition), use onUpdateItem
      Object.entries(pendingChanges.itemUpdates).forEach(
        ([itemId, updates]) => {
          onUpdateItem(itemId, updates);
        }
      );
    }

    setPendingChanges({
      itemUpdates: {},
      reorderedItems: undefined,
      deletedItems: [],
      newItems: [],
    });

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleClose = () => {
    // Reset all local state
    setPendingChanges({
      itemUpdates: {},
      reorderedItems: undefined,
      deletedItems: [],
      newItems: [],
      sectionUpdates: undefined,
    });
    setActiveTab("conteudo");
    setSelectedItemId(currentItemId);

    // Reset any other modal-specific state
    setShowExploreGalleryInfo(false);
    setShowPexelsGallery(false);
    setShowUploadImageInfo(false);
    setShowUploadImage(false);
    setShowConfirmExclusion(false);
    setItemToDelete(null);

    onClose();
  };

  const getTitle = () => {
    switch (itemType) {
      case "team":
        return "Time";
      case "results":
        return "Resultados";
      case "expertise":
        return "Especialidades";
      case "testimonials":
        return "Depoimentos";
      case "steps":
        return "Etapas do processo";
      case "faq":
        return "Perguntas Frequentes";
      default:
        return "Passos";
    }
  };

  const getItemsWithChanges = () => {
    let itemsToReturn = items
      .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
      .map((item) => ({
        ...item,
        ...pendingChanges.itemUpdates[item.id!],
      }));

    // Add new items
    const newItemsWithUpdates = pendingChanges.newItems.map((item) => ({
      ...item,
      ...pendingChanges.itemUpdates[item.id!],
    }));
    itemsToReturn = [...itemsToReturn, ...newItemsWithUpdates];

    // Apply reordered items if they exist
    if (pendingChanges.reorderedItems) {
      itemsToReturn = pendingChanges.reorderedItems
        .filter((item) => !pendingChanges.deletedItems.includes(item.id!))
        .map((item) => ({
          ...item,
          ...pendingChanges.itemUpdates[item.id!],
        }));
    }

    return itemsToReturn;
  };

  if (!isOpen) return null;

  return (
    <>
      <EditableModal
        isOpen={isOpen}
        className="flex min-h-[355px] cursor-default flex-col items-stretch"
        preferredPlacement={
          itemType === "steps" || itemType === "faq" ? "top" : "right"
        }
      >
        {!showExploreGalleryInfo &&
          !showPexelsGallery &&
          !showUploadImageInfo &&
          !showUploadImage &&
          !showConfirmExclusion && (
            <MainModalContent
              title={getTitle()}
              items={getItemsWithChanges()}
              selectedItemId={selectedItemId}
              currentItem={getCurrentItemWithChanges()}
              activeTab={activeTab}
              pendingChanges={pendingChanges}
              onClose={handleClose}
              onItemSelect={handleItemSelect}
              onAddItem={handleAddItem}
              onTabChange={setActiveTab}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              onSave={handleSave}
              setShowExploreGalleryInfo={setShowExploreGalleryInfo}
              setShowPexelsGallery={setShowPexelsGallery}
              setShowUploadImageInfo={setShowUploadImageInfo}
              setShowUploadImage={setShowUploadImage}
              setShowConfirmExclusion={setShowConfirmExclusion}
              onUpdateSection={handleUpdateSection}
              hideIcon={hideIcon}
              pendingHideIcon={pendingChanges.sectionUpdates?.hideIcon}
            />
          )}

        {showExploreGalleryInfo && (
          <ExploreGalleryInfo
            onExploreGallery={() => {
              setShowPexelsGallery(true);
              setShowExploreGalleryInfo(false);
            }}
            onClose={() => setShowExploreGalleryInfo(false)}
          />
        )}

        {showUploadImageInfo && (
          <UploadImageInfo
            onUploadImage={() => {
              setShowUploadImage(true);
              setShowUploadImageInfo(false);
            }}
            onClose={() => setShowUploadImageInfo(false)}
          />
        )}

        {showPexelsGallery && (
          <PexelsGallery
            onClose={() => setShowPexelsGallery(false)}
            onSelectImage={(imageUrl) => {
              handleUpdateItem(
                itemType === "team" ? { image: imageUrl } : { photo: imageUrl }
              );
              setShowPexelsGallery(false);
            }}
          />
        )}

        {showUploadImage && itemType !== "expertise" && (
          <UploadImage
            onClose={() => setShowUploadImage(false)}
            itemType={itemType as "team" | "results"}
            items={getItemsWithChanges() as (TeamMember | Result)[]}
            onUpdate={
              handleUpdateItem as (
                data: Partial<TeamMember> | Partial<Result>
              ) => void
            }
          />
        )}

        {showConfirmExclusion && (
          <ConfirmExclusion
            onClose={() => {
              setShowConfirmExclusion(false);
              setItemToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
      </EditableModal>
    </>
  );
}
