"use client";

import useProduct from "@/hooks/useProduct";
import { Search } from "lucide-react";
import { Loader } from "../ui/loader";
import Link from "next/link";

export default function HeroProductTable() {
    const { products, search, setSearch, isFetching } = useProduct();

    return (
        <section className="rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7] p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-xl">Recent products</h2>
                    <p className="mt-1 text-xs text-[#92938c]">
                        Your latest additions to the catalog
                    </p>
                </div>
                <Link
                    href={"/products"}
                    className="text-xs font-medium text-[#a17943] hover:underline"
                >
                    View all
                </Link>
            </div>
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#e5e3dc] bg-white px-3 py-2.5">
                <Search size={15} className="text-[#aaa9a2]" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-[#aaa9a2]"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                    <thead>
                        <tr className="border-b border-[#ebe9e2] text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                            <th className="pb-3 font-medium">Product</th>
                            <th className="pb-3 font-medium">Category</th>
                            <th className="pb-3 font-medium">Variants</th>
                            <th className="pb-3 text-right font-medium">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <div>
                                        <Loader label="Loading products..." />
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-12 text-center text-xs text-[#92938c]"
                                >
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b border-[#f0eee8] last:border-0"
                                >
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            {p.primary_image?.image
                                                .url && (
                                                <img
                                                    src={
                                                        p.primary_image.image
                                                            .url
                                                    }
                                                    alt={p.title}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="text-xs font-medium">
                                                    {p.title}
                                                </p>
                                                <p className="mt-0.5 text-[10px] text-[#a0a19b]">
                                                    {p.category?.name} ·{" "}
                                                    {p.variant_count}{" "}
                                                    {p.variant_count === 1
                                                        ? "variant"
                                                        : "variants"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-xs text-[#777971]">
                                        {p.category?.name}
                                    </td>
                                    <td className="text-xs font-medium">
                                        {p.variant_count}
                                    </td>
                                    <td className="text-right">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-[10px] ${p.is_active ? "text-[#55715a]" : "text-[#a56b6b]"}`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {p.is_active ? "Active" : "Draft"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
