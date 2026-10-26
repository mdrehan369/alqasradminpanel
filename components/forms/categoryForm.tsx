"use client";

import { catalogApi } from "@/lib/api";
import { CategoryListItem } from "@/types/category";
import axios from "axios";
import { FolderKanban, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = { name: string };

export default function CategoryForm({
    category,
    onClose,
    onSaved,
}: {
    category?: CategoryListItem | null;
    onClose: () => void;
    onSaved?: () => void;
}) {
    const editing = Boolean(category);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { name: category?.name ?? "" },
    });

    const submit = async (values: FormValues) => {
        setError("");
        const name = values.name.trim();
        try {
            if (category) {
                await catalogApi.updateCategory(category.id, { name });
            } else {
                await catalogApi.createCategory({ name });
            }
            onSaved?.();
            onClose();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                        "Category could not be saved.",
                );
            } else {
                setError("Category could not be saved.");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#20221f]/35 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#fbfaf7] p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eee9df]">
                            <FolderKanban
                                size={17}
                                className="text-[#777971]"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl">
                                {editing ? "Edit category" : "Add category"}
                            </h2>
                            <p className="mt-1 text-xs text-[#92938c]">
                                {editing
                                    ? "Rename this collection in your catalog."
                                    : "Create a new collection for your fragrance catalog."}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(submit)}>
                    <label className="text-xs font-medium">
                        Name
                        <input
                            {...register("name", {
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Category name is required",
                            })}
                            autoFocus
                            placeholder="e.g. Luxury perfumes"
                            className="mt-1.5 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm outline-none focus:border-[#b28b58]"
                        />
                    </label>
                    {errors.name && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {errors.name.message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 rounded-xl bg-[#f4e7e3] px-3 py-3 text-xs text-[#a56b6b]">
                            {error}
                        </p>
                    )}

                    <div className="mt-7 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-[#20221f] px-5 py-2.5 text-xs font-medium text-white disabled:opacity-60"
                        >
                            {isSubmitting && (
                                <Loader2 size={14} className="animate-spin" />
                            )}
                            {editing ? "Update category" : "Save category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
