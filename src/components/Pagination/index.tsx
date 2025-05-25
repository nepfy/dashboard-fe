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
          className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-2xl disabled:opacity-40 cursor-pointer"
          aria-label="Página anterior"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Mobile view - only show current page */}
      <button
        className="sm:hidden w-10 h-10 flex items-center justify-center rounded-2xs text-lg font-medium bg-gray-100 text-white-neutral-light-900"
        aria-current="page"
        aria-label={`Página ${currentPage}`}
      >
        {currentPage}
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xs text-lg font-normal transition-colors text-white-neutral-light-900 cursor-pointer ${
              currentPage === number
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
            aria-label={`Página ${number}`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        ))}
      </div>

      {showArrows && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-2xl disabled:opacity-40 cursor-pointer"
          aria-label="Próxima página"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
