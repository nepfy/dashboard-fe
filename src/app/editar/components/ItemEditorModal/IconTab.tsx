"use client";

import { useState, useEffect } from "react";
import { ExpertiseTopic } from "#/types/template-data";
import AwardIcon from "#/app/editar/modules/flash/Expertise/iconsList/AwardIcon";
import BellIcon from "#/app/editar/modules/flash/Expertise/iconsList/BellIcon";
import BubblesIcon from "#/app/editar/modules/flash/Expertise/iconsList/BubblesIcon";
import BulbIcon from "#/app/editar/modules/flash/Expertise/iconsList/BulbIcon";
import CircleIcon from "#/app/editar/modules/flash/Expertise/iconsList/CircleIcon";
import ClockIcon from "#/app/editar/modules/flash/Expertise/iconsList/ClockIcon";
import CrownIcon from "#/app/editar/modules/flash/Expertise/iconsList/CrownIcon";
import CubeIcon from "#/app/editar/modules/flash/Expertise/iconsList/CubeIcon";
import DiamondIcon from "#/app/editar/modules/flash/Expertise/iconsList/DiamondIcon";
import EyeIcon from "#/app/editar/modules/flash/Expertise/iconsList/EyeIcon";
import FolderIcon from "#/app/editar/modules/flash/Expertise/iconsList/FolderIcon";
import GearIcon from "#/app/editar/modules/flash/Expertise/iconsList/GearIcon";
import GlobeIcon from "#/app/editar/modules/flash/Expertise/iconsList/GlobeIcon";
import HeartIcon from "#/app/editar/modules/flash/Expertise/iconsList/HeartIcon";
import HexagonalIcon from "#/app/editar/modules/flash/Expertise/iconsList/HexagonalIcon";
import KeyIcon from "#/app/editar/modules/flash/Expertise/iconsList/KeyIcon";
import PlayIcon from "#/app/editar/modules/flash/Expertise/iconsList/PlayIcon";
import StarIcon from "#/app/editar/modules/flash/Expertise/iconsList/StarIcon";
import SwitchIcon from "#/app/editar/modules/flash/Expertise/iconsList/SwitchIcon";
import ThunderIcon from "#/app/editar/modules/flash/Expertise/iconsList/ThunderIcon";

interface IconTabProps {
  itemType: "expertise";
  currentItem: ExpertiseTopic | null;
  onUpdate: (data: Partial<ExpertiseTopic>) => void;
  onUpdateSection: (data: { hideIcon?: boolean }) => void;
  hideIcon?: boolean;
  pendingHideIcon?: boolean;
}

const iconMap = {
  AwardIcon: AwardIcon,
  BellIcon: BellIcon,
  BubblesIcon: BubblesIcon,
  BulbIcon: BulbIcon,
  CircleIcon: CircleIcon,
  ClockIcon: ClockIcon,
  CrownIcon: CrownIcon,
  CubeIcon: CubeIcon,
  DiamondIcon: DiamondIcon,
  EyeIcon: EyeIcon,
  FolderIcon: FolderIcon,
  GearIcon: GearIcon,
  GlobeIcon: GlobeIcon,
  HeartIcon: HeartIcon,
  HexagonalIcon: HexagonalIcon,
  KeyIcon: KeyIcon,
  PlayIcon: PlayIcon,
  StarIcon: StarIcon,
  SwitchIcon: SwitchIcon,
  ThunderIcon: ThunderIcon,
};

const iconNames = Object.keys(iconMap);

export default function IconTab({
  currentItem,
  onUpdate,
  onUpdateSection,
  hideIcon = false,
  pendingHideIcon,
}: IconTabProps) {
  // Use pending state if available, otherwise fall back to saved state
  const currentHideIcon =
    pendingHideIcon !== undefined ? pendingHideIcon : hideIcon;
  const [selectedIcon, setSelectedIcon] = useState<string>(
    currentItem?.icon || "AwardIcon"
  );

  // Sync selectedIcon with currentItem when it changes (e.g., when switching between items)
  useEffect(() => {
    const defaultIcon = currentItem?.icon || "AwardIcon";
    setSelectedIcon(defaultIcon);

    // If currentItem exists but has no icon, set the default icon
    if (currentItem && !currentItem.icon) {
      onUpdate({ icon: "AwardIcon" });
    }
  }, [currentItem, onUpdate]);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    onUpdate({ icon: iconName });
  };

  const handleToggleIcon = (shouldHide: boolean) => {
    // Only update local state, don't call onUpdateSection immediately
    // The actual update will happen when user clicks "Alterar"
    onUpdateSection({ hideIcon: shouldHide });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    if (!IconComponent) return null;
    return <IconComponent fill="#000000" width="24" height="24" />;
  };

  return (
    <div className="mb-20 space-y-6 sm:mb-0">
      {/* Icon Grid */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-[#2A2A2A]">
          Selecione um ícone
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {iconNames.map((iconName) => (
            <button
              key={iconName}
              onClick={() => handleIconSelect(iconName)}
              className={`flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                selectedIcon === iconName
                  ? "border-primary-light-400 bg-primary-light-10"
                  : "hover:border-primary-light-300 border-[#DBDDDF] bg-white"
              }`}
            >
              {renderIcon(iconName)}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Toggle */}
      <div className="relative z-10 flex items-center gap-4">
        <label className="text-sm font-medium text-[#2A2A2A]">
          Ativar ícone
        </label>
        <button
          onClick={() => handleToggleIcon(!currentHideIcon)}
          className={`relative z-10 inline-flex h-6 w-[46px] cursor-pointer items-center rounded-full transition-colors ${
            !currentHideIcon ? "bg-primary-light-400" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              !currentHideIcon ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
