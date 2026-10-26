"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import AddProductForm from "@/components/forms/addProduct";
import ProductTable from "@/components/tables/product";
import useCategory from "@/hooks/useCategory";
import { GET_PRODUCTS_QUERY_KEYS } from "@/lib/constants";

export default function ProductsPageComponent() {
    const queryClient = useQueryClient();
    const { categories, setLimit } = useCategory();
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        setLimit(100);
    }, [setLimit]);

    const openCreate = () => {
        setEditingId(null);
        setOpen(true);
    };

    const openEdit = (id: number) => {
        setEditingId(id);
        setOpen(true);
    };

    const handleSaved = () => {
        queryClient.invalidateQueries({ queryKey: GET_PRODUCTS_QUERY_KEYS });
        setNotice(editingId ? "Product updated" : "Product created");
    };

    return (
        <main className="min-h-screen bg-[#f7f6f2] text-[#20221f]">
            <header className="border-b border-[#e5e3dc] bg-[#fbfaf7] px-5 py-5 md:px-10">
                <div className="mx-auto flex max-w-[1380px] items-center justify-between">
                    <div>
                        <Link
                            href="/"
                            className="mb-3 flex items-center gap-2 text-xs text-[#8d8e87]"
                        >
                            <ArrowLeft size={14} /> Back to overview
                        </Link>
                        <h1 className="font-serif text-4xl">Products</h1>
                        <p className="mt-1 text-sm text-[#85867f]">
                            Manage your perfumes, attars and fragrance variants.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-xl bg-[#20221f] px-4 py-3 text-xs font-medium text-white"
                    >
                        <Plus size={16} /> Add product
                    </button>
                </div>
            </header>
            <ProductTable onEdit={openEdit} />
            {notice && (
                <div className="fixed bottom-5 right-5 rounded-xl bg-[#20221f] px-4 py-3 text-xs text-white">
                    {notice}
                </div>
            )}
            {open && (
                <AddProductForm
                    setOpen={setOpen}
                    categories={categories}
                    onSaved={handleSaved}
                    productId={editingId ?? undefined}
                />
            )}
        </main>
    );
}
