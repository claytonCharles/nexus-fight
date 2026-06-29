import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    if (end - start + 1 < 3) {
      start = Math.max(1, end - 2);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 border-t px-4 py-4">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="rounded border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Primeira página"
      >
        <ChevronFirst className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 shadow-sm">
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-full text-sm font-medium transition ${
              page === currentPage
                ? "bg-blue-600 text-white shadow"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="rounded border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Última página"
      >
        <ChevronLast className="h-4 w-4" />
      </button>
    </div>
  );
}
