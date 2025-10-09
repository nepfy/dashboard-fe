import Link from "next/link";
import CloseIcon from "#/components/icons/CloseIcon";
import Logo from "#/components/icons/Logo";

export default function EditarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <nav className="px-7 py-3 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo fill="#1C1A22" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/dashboard"
            className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            <CloseIcon width="10" height="10" fill="#1C1A22" />
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
