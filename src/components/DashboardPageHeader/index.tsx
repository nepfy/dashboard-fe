"use client";

interface DashboardPageHeaderProps {
  title: string;
  children: React.ReactNode;
  disableBorder?: boolean;
}

export default function DashboardPageHeader({
  title,
  children,
  disableBorder = true,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`flex w-full items-center justify-between p-7 ${disableBorder ? "" : "border-white-neutral-light-300 border-b"}`}
    >
      <h3 className="text-white-neutral-light-900 text-2xl font-medium">
        {title}
      </h3>
      {children}
    </header>
  );
}
