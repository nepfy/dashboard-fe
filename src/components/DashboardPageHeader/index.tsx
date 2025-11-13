"use client";

interface DashboardPageHeaderProps {
  title: string;
  children: React.ReactNode;
  disableBorder?: boolean;
}

export default function DashboardPageHeader({
  title,
  children,
  disableBorder = false,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`w-full p-7 ${disableBorder ? "" : "border-white-neutral-light-300 border-b"}`}
    >
      <h3 className="text-white-neutral-light-900 mb-4 text-2xl font-medium">
        {title}
      </h3>
      {children}
    </header>
  );
}
