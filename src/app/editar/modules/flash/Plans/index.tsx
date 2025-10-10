interface FlashPlansProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  projectScope: string;
  list: Array<{
    id: string;
    plansSectionId: string;
    title: string;
    description: string;
    price: string;
    planPeriod: string;
    buttonTitle: string;
    hideTitleField: boolean;
    hideDescription: boolean;
    hidePrice: boolean;
    hidePlanPeriod: boolean;
    hideButtonTitle: boolean;
    sortOrder: number;
    includedItems: Array<{
      id: string;
      planId: string;
      description: string;
      hideDescription: boolean;
      sortOrder: number;
    }>;
  }>;
}

export default function FlashPlans({
  id,
  projectId,
  hideSection,
  projectScope,
  list,
}: FlashPlansProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{projectScope}</h1>
          {list?.map((item) => (
            <div key={item.id}>
              <h1>{item.title}</h1>
              <h1>{item.description}</h1>
              <h1>{item.price}</h1>
              <h1>{item.planPeriod}</h1>
              <h1>{item.buttonTitle}</h1>
              {!item.hideTitleField && (
                <>
                  <h1>{item.title}</h1>
                </>
              )}
              {!item.hideDescription && (
                <>
                  <h1>{item.description}</h1>
                </>
              )}
              {!item.hidePrice && (
                <>
                  <h1>{item.price}</h1>
                </>
              )}
              {!item.hidePlanPeriod && (
                <>
                  <h1>{item.planPeriod}</h1>
                </>
              )}
              {!item.hideButtonTitle && (
                <>
                  <h1>{item.buttonTitle}</h1>
                </>
              )}
              <h1>{item.sortOrder}</h1>
              {item.includedItems?.map((includedItem) => (
                <div key={includedItem.id}>
                  <h1>{includedItem.description}</h1>
                  {!includedItem.hideDescription && (
                    <>
                      <h1>{includedItem.description}</h1>
                    </>
                  )}
                  <h1>{includedItem.sortOrder}</h1>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
