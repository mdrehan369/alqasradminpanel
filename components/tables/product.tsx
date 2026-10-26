"use client";

import useProduct from "@/hooks/useProduct";
import { catalogApi } from "@/lib/api";
import { ProductListItem } from "@/types/product";
import {
    Copy,
    Eye,
    EyeOff,
    Package,
    Pencil,
    Power,
    PowerOff,
    Search,
    Trash2,
} from "lucide-react";
import { Fragment, useState } from "react";
import { Loader } from "../ui/loader";
import PaginationComponent from "../pagination";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ProductTable({
    onEdit,
}: {
    onEdit?: (id: number) => void;
}) {
    const {
        products,
        pagination,
        search,
        setSearch,
        page,
        setPage,
        refetch,
        isFetching,
        isLoading,
    } = useProduct();
    const [busyId, setBusyId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [notice, setNotice] = useState("");

    const toggleActive = async (product: ProductListItem) => {
        setBusyId(product.id);
        try {
            await catalogApi.updateProduct(product.id, {
                is_active: !product.is_active,
            });
            await refetch();
            setNotice(
                product.is_active
                    ? "Product moved to draft"
                    : "Product activated",
            );
        } catch {
            setNotice("Could not update product status.");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (product: ProductListItem) => {
        if (!window.confirm(`Delete ${product.title}?`)) return;
        setBusyId(product.id);
        try {
            await catalogApi.deleteProduct(product.id);
            await refetch();
            setNotice("Product deleted");
        } catch {
            setNotice("Product could not be deleted.");
        } finally {
            setBusyId(null);
        }
    };

    const copySlug = async (slug: string) => {
        try {
            await navigator.clipboard.writeText(slug);
            setNotice("Slug copied");
        } catch {
            setNotice("Could not copy slug.");
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
                        placeholder="Search products"
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </div>
            </section>

            <div className="overflow-x-auto rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7]">
                <table className="w-full min-w-175 text-left">
                    <thead>
                        <tr className="border-b border-[#ebe9e2] text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                            <th className="p-5">Product</th>
                            <th>Category</th>
                            <th>Variants</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <Loader label="Loading products..." />
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-sm text-[#92938c]"
                                >
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const busy = busyId === product.id;
                                const expanded = expandedId === product.id;

                                return (
                                    <Fragment key={product.id}>
                                        <tr className="border-b border-[#f0eee8] last:border-0">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    {product.primary_image
                                                        ?.image.url ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .primary_image
                                                                    .image.url
                                                            }
                                                            alt={product.title}
                                                            className="h-11 w-11 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eee9df]">
                                                            <Package
                                                                size={17}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium">
                                                            {product.title}
                                                        </p>
                                                        <p className="mt-0.5 max-w-[180px] truncate font-mono text-[10px] text-[#a0a19b]">
                                                            {product.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm text-[#777971]">
                                                {product.category?.name ?? "—"}
                                            </td>
                                            <td className="text-sm text-[#777971]">
                                                {product.variant_count}{" "}
                                                {product.variant_count === 1
                                                    ? "variant"
                                                    : "variants"}
                                            </td>
                                            <td className="text-sm text-[#777971]">
                                                {formatDate(product.created_at)}
                                            </td>
                                            <td>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-[10px] ${product.is_active ? "bg-[#e5ede5] text-[#55715a]" : "bg-[#eee9e4] text-[#8c7568]"}`}
                                                >
                                                    {product.is_active
                                                        ? "Active"
                                                        : "Draft"}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        aria-label="Edit product"
                                                        onClick={() =>
                                                            onEdit?.(product.id)
                                                        }
                                                        className="rounded-lg p-2 text-[#92938c] hover:bg-[#f0efe9]"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        aria-label={
                                                            expanded
                                                                ? "Hide details"
                                                                : "View details"
                                                        }
                                                        onClick={() =>
                                                            setExpandedId(
                                                                expanded
                                                                    ? null
                                                                    : product.id,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-[#92938c] hover:bg-[#f0efe9]"
                                                    >
                                                        {expanded ? (
                                                            <EyeOff size={15} />
                                                        ) : (
                                                            <Eye size={15} />
                                                        )}
                                                    </button>
                                                    <button
                                                        aria-label="Copy slug"
                                                        onClick={() =>
                                                            copySlug(
                                                                product.slug,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-[#92938c] hover:bg-[#f0efe9]"
                                                    >
                                                        <Copy size={15} />
                                                    </button>
                                                    <button
                                                        aria-label={
                                                            product.is_active
                                                                ? "Set to draft"
                                                                : "Activate"
                                                        }
                                                        onClick={() =>
                                                            toggleActive(
                                                                product,
                                                            )
                                                        }
                                                        disabled={busy}
                                                        className="rounded-lg p-2 text-[#92938c] hover:bg-[#f0efe9] disabled:opacity-40"
                                                    >
                                                        {product.is_active ? (
                                                            <PowerOff
                                                                size={15}
                                                            />
                                                        ) : (
                                                            <Power size={15} />
                                                        )}
                                                    </button>
                                                    <button
                                                        aria-label="Delete product"
                                                        onClick={() =>
                                                            remove(product)
                                                        }
                                                        disabled={busy}
                                                        className="rounded-lg p-2 text-[#92938c] hover:bg-[#f4e7e3] hover:text-[#a56b6b] disabled:opacity-40"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expanded && (
                                            <tr className="border-b border-[#f0eee8] bg-[#f7f6f2]">
                                                <td
                                                    colSpan={6}
                                                    className="px-5 py-4"
                                                >
                                                    <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                                                        <div>
                                                            <dt className="text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                                                                ID
                                                            </dt>
                                                            <dd className="mt-1 font-medium">
                                                                #{product.id}
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                                                                Slug
                                                            </dt>
                                                            <dd className="mt-1 font-mono">
                                                                {product.slug}
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                                                                Category
                                                            </dt>
                                                            <dd className="mt-1 font-medium">
                                                                {product
                                                                    .category
                                                                    ?.name ??
                                                                    "—"}
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                                                                Created
                                                            </dt>
                                                            <dd className="mt-1 font-medium">
                                                                {formatDate(
                                                                    product.created_at,
                                                                )}
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
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
            />
            {notice && (
                <div className="fixed bottom-5 right-5 rounded-xl bg-[#20221f] px-4 py-3 text-xs text-white">
                    {notice}
                </div>
            )}
        </>
    );
}
