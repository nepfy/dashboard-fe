import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showArrows?: boolean;
  maxVisiblePages?: number;
}

const Pagination = ({
  totalPages = 5,
  currentPage = 1,
  onPageChange = () => {},
  showArrows = true,
  maxVisiblePages = 5,
}: PaginationProps) => {
  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    let startPage: number, endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-0 sm:gap-2">
      {showArrows && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-2xl disabled:opacity-40 sm:h-12 sm:w-12"
          aria-label="Página anterior"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Mobile view - only show current page */}
      <button
        className="rounded-2xs text-white-neutral-light-900 flex h-10 w-10 items-center justify-center bg-gray-100 text-lg font-medium sm:hidden"
        aria-current="page"
        aria-label={`Página ${currentPage}`}
      >
        {currentPage}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`rounded-2xs text-white-neutral-light-900 flex h-10 w-10 cursor-pointer items-center justify-center text-lg font-normal transition-colors ${
              currentPage === number
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
            aria-label={`Página ${number}`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            <span className="text-sm">{number}</span>
          </button>
        ))}
      </div>

      {showArrows && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-2xl disabled:opacity-40 sm:h-12 sm:w-12"
          aria-label="Próxima página"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
