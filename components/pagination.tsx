import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
    page: number;
    isFetching: boolean;
    setPage: (page: number) => void;
    singular?: string;
    plural?: string;
};

export default function PaginationComponent({
    has_prev,
    has_next,
    page,
    total_pages,
    total,
    setPage,
    isFetching,
    singular = "product",
    plural = "products",
}: PaginationProps) {
    return (
        <div className="flex items-center justify-between border-t border-[#e5e3dc] px-5 py-3 text-xs text-[#777971]">
            <span>
                {total} {total === 1 ? singular : plural}
                {total_pages > 0 ? ` · Page ${page} of ${total_pages}` : ""}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={!has_prev || isFetching}
                    className="flex items-center gap-1 rounded-lg border border-[#e2e0d8] px-3 py-1.5 disabled:opacity-40"
                >
                    <ChevronLeft size={14} /> Prev
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!has_next || isFetching}
                    className="flex items-center gap-1 rounded-lg border border-[#e2e0d8] px-3 py-1.5 disabled:opacity-40"
                >
                    Next <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
