import React, { useState } from "react";
import SelectionButton from "#/app/onboarding/components/SelectionButton";
import OtherOption from "#/app/onboarding/components/OtherOption";

interface SelectionGridProps {
  options: (string | { id: string; name: string })[];
  fieldName: string;
  isMultiSelect?: boolean;
  checkmark?: boolean;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({
  options,
  fieldName,
  isMultiSelect = true,
  checkmark = true,
}) => {
  const [otherOption, setOtherOption] = useState<boolean>(false);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {options.map((option) => {
        const optionKey = typeof option === "object" ? option.id : option;

        return (
          <React.Fragment key={optionKey}>
            <SelectionButton
              option={option}
              fieldName={fieldName}
              isMultiSelect={isMultiSelect}
              checkmark={checkmark}
              otherOption={otherOption}
              onClick={
                typeof option === "object" && option.id === "outro"
                  ? () => setOtherOption(!otherOption)
                  : undefined
              }
            />
            {typeof option === "object" &&
              option.id === "outro" &&
              otherOption && <OtherOption placeholder="Outro..." />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SelectionGrid;
