import Link from "next/link";
import Personalize from "../personalize";
import Sections from "../sections";
import Publish from "../publish";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="sm:hidden fixed inset-x-0 top-[53px] z-[9999] bg-black/60 w-full h-full"
      onClick={onClose}
    >
      <div
        className="bg-white-neutral-light-200 mx-4 mt-4 rounded-[16px] p-6 shadow-lg relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Items */}
        <div className="space-y-4">
          <Personalize />
          <Sections />

          {/* Separator */}
          <div className="border-t border-white-neutral-light-300 my-4"></div>

          {/* Publish Button */}
          <Publish />

          {/* Exit Editor Button */}
          <Link
            href="/dashboard"
            className="h-[40px] w-full sm:h-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            Sair do editor
          </Link>
        </div>
      </div>
    </div>
  );
}
