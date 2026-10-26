"use client";

import useCategory from "@/hooks/useCategory";
import { catalogApi } from "@/lib/api";
import { CategoryListItem } from "@/types/category";
import { FolderKanban, Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import PaginationComponent from "../pagination";
import { Loader } from "../ui/loader";

const tints = ["bg-[#ede7dc]", "bg-[#e4ebe5]", "bg-[#eee5e9]"];

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function CategoryTable({
    onEdit,
}: {
    onEdit?: (category: CategoryListItem) => void;
}) {
    const {
        categories,
        pagination,
        search,
        setSearch,
        page,
        setPage,
        refetch,
        isFetching,
    } = useCategory();
    const [busyId, setBusyId] = useState<number | null>(null);
    const [notice, setNotice] = useState("");

    const remove = async (category: CategoryListItem) => {
        if (!window.confirm(`Delete ${category.name}?`)) return;
        setBusyId(category.id);
        try {
            await catalogApi.deleteCategory(category.id);
            await refetch();
            setNotice("Category deleted");
        } catch {
            setNotice(
                "Category could not be deleted. Products may still use it.",
            );
        } finally {
            setBusyId(null);
        }
    };

    return (
        <>
            <section className="mx-auto max-w-[1380px] px-5 py-8 md:px-10">
                <div className="mb-5 flex max-w-sm items-center gap-2 rounded-xl border border-[#e5e3dc] bg-[#fbfaf7] px-3 py-3">
                    <Search size={15} className="text-[#aaa9a2]" />
                    <input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Search categories"
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </div>
            </section>

            <div className="overflow-x-auto rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7]">
                <table className="w-full min-w-125 text-left">
                    <thead>
                        <tr className="border-b border-[#ebe9e2] text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                            <th className="p-5">Category</th>
                            <th>Products</th>
                            <th>Created</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching && categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <Loader label="Loading categories..." />
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-12 text-center text-sm text-[#92938c]"
                                >
                                    No categories found.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category, index) => {
                                const busy = busyId === category.id;
                                const count = category.product_count ?? 0;

                                return (
                                    <tr
                                        key={category.id}
                                        className="border-b border-[#f0eee8] last:border-0"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${tints[index % tints.length]}`}
                                                >
                                                    <FolderKanban
                                                        size={17}
                                                        className="text-[#777971]"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {category.name}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[10px] text-[#a0a19b]">
                                                        #{category.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm text-[#777971]">
                                            {count}{" "}
                                            {count === 1
                                                ? "product"
                                                : "products"}
                                        </td>
                                        <td className="text-sm text-[#777971]">
                                            {formatDate(category.created_at)}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    aria-label={`Edit ${category.name}`}
                                                    onClick={() =>
                                                        onEdit?.(category)
                                                    }
                                                    className="rounded-lg p-2 text-[#92938c] hover:bg-[#f0efe9]"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    aria-label={`Delete ${category.name}`}
                                                    onClick={() =>
                                                        remove(category)
                                                    }
                                                    disabled={busy}
                                                    className="rounded-lg p-2 text-[#92938c] hover:bg-[#f4e7e3] hover:text-[#a56b6b] disabled:opacity-40"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <PaginationComponent
                isFetching={isFetching}
                setPage={setPage}
                total={pagination.total}
                total_pages={pagination.total_pages}
                page={page}
                has_next={pagination.has_next}
                has_prev={pagination.has_prev}
                singular="category"
                plural="categories"
            />
            {notice && (
                <div className="fixed bottom-5 right-5 rounded-xl bg-[#20221f] px-4 py-3 text-xs text-white">
                    {notice}
                </div>
            )}
        </>
    );
}
