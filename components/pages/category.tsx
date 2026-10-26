"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import CategoryForm from "@/components/forms/categoryForm";
import CategoryTable from "@/components/tables/category";
import { GET_CATEGORIES_QUERY_KEYS } from "@/lib/constants";
import { CategoryListItem } from "@/types/category";

export default function CategoriesPageComponent() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryListItem | null>(null);
    const [notice, setNotice] = useState("");

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (category: CategoryListItem) => {
        setEditing(category);
        setOpen(true);
    };

    const handleSaved = () => {
        queryClient.invalidateQueries({ queryKey: GET_CATEGORIES_QUERY_KEYS });
        setNotice(editing ? "Category updated" : "Category created");
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
                        <h1 className="font-serif text-4xl">Categories</h1>
                        <p className="mt-1 text-sm text-[#85867f]">
                            Organize the collections in your fragrance catalog.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-xl bg-[#20221f] px-4 py-3 text-xs font-medium text-white"
                    >
                        <Plus size={16} /> Add category
                    </button>
                </div>
            </header>
            <CategoryTable onEdit={openEdit} />
            {notice && (
                <div className="fixed bottom-5 right-5 rounded-xl bg-[#20221f] px-4 py-3 text-xs text-white">
                    {notice}
                </div>
            )}
            {open && (
                <CategoryForm
                    category={editing}
                    onClose={() => setOpen(false)}
                    onSaved={handleSaved}
                />
            )}
        </main>
    );
}
