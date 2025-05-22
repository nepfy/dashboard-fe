import React from "react";

interface PageCounterProps {
  currentPage: number;
  totalPages: number;
  label?: string; // "páginas" by default but can be customized
  className?: string;
}

const PageCounter: React.FC<PageCounterProps> = ({
  currentPage,
  totalPages,
  label = "páginas",
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-white-neutral-light-900 border-b-white-neutral-light-400 border-b-2">
        {currentPage}
      </span>
      <span className="text-white-neutral-light-900 mx-1">de</span>
      <span className="text-white-neutral-light-900">
        {totalPages} {label}
      </span>
    </div>
  );
};

export default PageCounter;
