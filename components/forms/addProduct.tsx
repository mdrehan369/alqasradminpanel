"use client";

import useProductDetail from "@/hooks/useProductDetail";
import { Category } from "@/types/category";
import { X } from "lucide-react";
import { Loader } from "../ui/loader";
import ProductForm from "./productForm";

export default function AddProductForm({
    setOpen,
    categories,
    onSaved,
    productId,
}: {
    setOpen: (val: boolean) => void;
    categories: Category[];
    onSaved?: () => void;
    productId?: number;
}) {
    const editing = Boolean(productId);
    const { product, isFetching } = useProductDetail(productId);

    const close = () => setOpen(false);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#20221f]/35 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#fbfaf7] p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-serif text-2xl">
                            {editing ? "Edit product" : "Add product"}
                        </h2>
                        <p className="mt-1 text-xs text-[#92938c]">
                            {editing
                                ? "Update the catalog entry, variants and images."
                                : "Create the catalog entry with its variants and images."}
                        </p>
                    </div>
                    <button type="button" onClick={close}>
                        <X size={18} />
                    </button>
                </div>

                {editing && isFetching ? (
                    <div className="py-16 text-center">
                        <Loader label="Loading product..." />
                    </div>
                ) : editing && !product ? (
                    <div className="rounded-xl bg-[#f4e7e3] px-3 py-3 text-xs text-[#a56b6b]">
                        Could not load this product.
                    </div>
                ) : (
                    <ProductForm
                        categories={categories}
                        initialProduct={product}
                        productId={productId}
                        onCancel={close}
                        onSaved={() => {
                            close();
                            onSaved?.();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
