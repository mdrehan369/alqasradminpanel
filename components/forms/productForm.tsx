"use client";

import { catalogApi } from "@/lib/api";
import { ProductType, SizeUnit } from "@/types/enums";
import { Category } from "@/types/category";
import {
    ProductDetail,
    ProductFormValues,
    ProductVariantFormValue,
} from "@/types/product";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    Loader2,
    Plus,
    Trash2,
    X,
} from "lucide-react";

type ImageEntry = {
    key: string;
    linkId?: number;
    imageId?: number;
    url: string;
    file?: File;
    isPrimary: boolean;
};

type ProductFormProps = {
    categories: Category[];
    initialProduct?: ProductDetail | null;
    productId?: number;
    onCancel: () => void;
    onSaved: () => void;
};

function emptyVariant(): ProductVariantFormValue {
    return {
        size: "1",
        unit: SizeUnit.CM,
        price: "",
        compare_price: "0",
        stock: "",
        product_type: ProductType.PERFUME,
    };
}

function buildDefaults(product?: ProductDetail | null): ProductFormValues {
    if (!product) {
        return {
            title: "",
            category_id: "",
            ingredients: "",
            details: "",
            is_active: true,
            variants: [emptyVariant()],
        };
    }

    return {
        title: product.title,
        category_id: String(product.category_id),
        ingredients: product.ingredients,
        details: product.details,
        is_active: product.is_active,
        variants: product.variants.map((variant) => ({
            variantId: variant.id,
            size: String(variant.size),
            unit: variant.unit,
            price: String(variant.price),
            compare_price: String(variant.compare_price),
            stock: String(variant.stock),
            product_type: variant.product_type,
        })),
    };
}

function buildImages(product?: ProductDetail | null): ImageEntry[] {
    if (!product) return [];

    return product.images
        .slice()
        .sort((a, b) => a.display_order - b.display_order)
        .map((image) => ({
            key: `existing-${image.id}`,
            linkId: image.id,
            imageId: image.image.id,
            url: image.image.url,
            isPrimary: image.is_primary,
        }));
}

function toVariantPayload(row: ProductVariantFormValue) {
    return {
        size: Number(row.size),
        unit: row.unit,
        price: Number(row.price),
        compare_price: Number(row.compare_price || 0),
        stock: Number(row.stock),
        product_type: row.product_type,
    };
}

export default function ProductForm({
    categories,
    initialProduct,
    productId,
    onCancel,
    onSaved,
}: ProductFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        defaultValues: buildDefaults(initialProduct),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const [images, setImages] = useState<ImageEntry[]>(() =>
        buildImages(initialProduct),
    );
    const [imageError, setImageError] = useState("");

    const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setImages((previous) => {
            const additions: ImageEntry[] = files.map((file) => ({
                key: `new-${crypto.randomUUID()}`,
                file,
                url: URL.createObjectURL(file),
                isPrimary: false,
            }));
            const next = [...previous, ...additions];
            if (!next.some((entry) => entry.isPrimary)) {
                next[0] = { ...next[0], isPrimary: true };
            }
            return next;
        });
        setImageError("");
        event.target.value = "";
    };

    const setPrimary = (key: string) => {
        setImages((previous) =>
            previous.map((entry) => ({
                ...entry,
                isPrimary: entry.key === key,
            })),
        );
    };

    const removeImage = (key: string) => {
        setImages((previous) => {
            const next = previous.filter((entry) => entry.key !== key);
            if (next.length && !next.some((entry) => entry.isPrimary)) {
                next[0] = { ...next[0], isPrimary: true };
            }
            return next;
        });
    };

    const moveImage = (index: number, direction: -1 | 1) => {
        setImages((previous) => {
            const target = index + direction;
            if (target < 0 || target >= previous.length) return previous;
            const next = [...previous];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const syncVariants = async (
        id: number,
        rows: ProductVariantFormValue[],
    ) => {
        const originalIds = initialProduct?.variants.map((item) => item.id) ?? [];
        const keptIds = rows
            .map((row) => (row.variantId ? Number(row.variantId) : undefined))
            .filter(
                (value): value is number =>
                    typeof value === "number" && Number.isFinite(value),
            );

        for (const variantId of originalIds) {
            if (!keptIds.includes(variantId)) {
                await catalogApi.deleteProductVariant(id, variantId);
            }
        }

        for (const row of rows) {
            const payload = toVariantPayload(row);
            const variantId = row.variantId ? Number(row.variantId) : undefined;
            if (variantId && Number.isFinite(variantId)) {
                await catalogApi.updateProductVariant(id, variantId, payload);
            } else {
                await catalogApi.addProductVariant(id, payload);
            }
        }
    };

    const syncImages = async (id: number, entries: ImageEntry[]) => {
        const originalLinkIds = initialProduct?.images.map((item) => item.id) ?? [];
        const keptLinkIds = entries
            .map((entry) => entry.linkId)
            .filter((value): value is number => typeof value === "number");

        for (const linkId of originalLinkIds) {
            if (!keptLinkIds.includes(linkId)) {
                await catalogApi.deleteProductImage(id, linkId);
            }
        }

        for (let index = 0; index < entries.length; index++) {
            const entry = entries[index];
            let linkId = entry.linkId;

            if (!linkId && entry.imageId) {
                const response = await catalogApi.addProductImage(
                    id,
                    entry.imageId,
                );
                linkId = response.data?.data?.id;
            }

            if (linkId) {
                await catalogApi.updateProductImage(id, linkId, {
                    display_order: index,
                    is_primary: entry.isPrimary,
                });
            }
        }
    };

    const onSubmit = async (values: ProductFormValues) => {
        if (!images.length) {
            setImageError("Add at least one image.");
            return;
        }

        const primaryIndex = images.findIndex((entry) => entry.isPrimary);
        const normalized = images.map((entry, index) => ({
            ...entry,
            isPrimary: index === (primaryIndex === -1 ? 0 : primaryIndex),
        }));

        try {
            const newEntries = normalized.filter((entry) => entry.file);
            let uploaded: { id: number }[] = [];

            if (newEntries.length) {
                const formData = new FormData();
                newEntries.forEach((entry) => {
                    formData.append("files", entry.file as File);
                });
                const response = await catalogApi.uploadImages(formData);
                uploaded = response.data?.data ?? [];
                if (uploaded.length !== newEntries.length) {
                    throw new Error("Image upload failed");
                }
            }

            let uploadIndex = 0;
            const resolvedImages = normalized.map((entry) => {
                if (entry.file) {
                    const uploadedImage = uploaded[uploadIndex++];
                    return {
                        ...entry,
                        imageId: uploadedImage?.id,
                    };
                }
                return entry;
            });

            if (resolvedImages.some((entry) => !entry.imageId)) {
                throw new Error("Image upload failed");
            }

            if (productId) {
                await catalogApi.updateProduct(productId, {
                    title: values.title,
                    ingredients: values.ingredients,
                    details: values.details,
                    is_active: values.is_active,
                    category_id: Number(values.category_id),
                });
                await syncVariants(productId, values.variants);
                await syncImages(productId, resolvedImages);
            } else {
                await catalogApi.createProduct({
                    title: values.title,
                    ingredients: values.ingredients,
                    details: values.details,
                    is_active: values.is_active,
                    category_id: Number(values.category_id),
                    variants: values.variants.map(toVariantPayload),
                    images: resolvedImages.map((entry, index) => ({
                        image_id: entry.imageId as number,
                        is_primary: entry.isPrimary,
                        display_order: index,
                    })),
                });
            }

            onSaved();
        } catch {
            setError("root", {
                message:
                    "Product could not be saved. Check required fields and API response.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium sm:col-span-2">
                    Product title
                    <input
                        className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                        {...register("title", {
                            required: "Product title is required",
                            maxLength: {
                                value: 100,
                                message: "Title must be 100 characters or less",
                            },
                        })}
                    />
                    {errors.title && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {errors.title.message}
                        </p>
                    )}
                </label>
                <label className="text-xs font-medium">
                    Category
                    <select
                        className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                        {...register("category_id", {
                            required: "Category is required",
                        })}
                    >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {errors.category_id.message}
                        </p>
                    )}
                </label>
                <label className="flex items-center gap-2 pt-6 text-xs font-medium">
                    <input type="checkbox" {...register("is_active")} />
                    Active
                </label>
                <label className="text-xs font-medium sm:col-span-2">
                    Ingredients
                    <textarea
                        className="mt-2 min-h-20 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                        {...register("ingredients", {
                            required: "Ingredients are required",
                        })}
                    />
                    {errors.ingredients && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {errors.ingredients.message}
                        </p>
                    )}
                </label>
                <label className="text-xs font-medium sm:col-span-2">
                    Details
                    <textarea
                        className="mt-2 min-h-20 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                        {...register("details", {
                            required: "Details are required",
                        })}
                    />
                    {errors.details && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {errors.details.message}
                        </p>
                    )}
                </label>

                <div className="sm:col-span-2">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium">Variants</span>
                        <button
                            type="button"
                            onClick={() => append(emptyVariant())}
                            className="flex items-center gap-1 rounded-lg border border-[#e2e0d8] px-2.5 py-1.5 text-[11px] text-[#7a6a52]"
                        >
                            <Plus size={13} /> Add variant
                        </button>
                    </div>
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="rounded-xl border border-[#e2e0d8] bg-white p-3"
                            >
                                <input
                                    type="hidden"
                                    {...register(
                                        `variants.${index}.variantId`,
                                    )}
                                />
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-[11px] text-[#92938c]">
                                        Variant {index + 1}
                                    </p>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            aria-label="Remove variant"
                                            onClick={() => remove(index)}
                                            className="rounded-lg p-1.5 text-[#92938c] hover:bg-[#f4e7e3] hover:text-[#a56b6b]"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <label className="text-[11px] font-medium">
                                        Size
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.size`,
                                                {
                                                    required:
                                                        "Size is required",
                                                    validate: (value) =>
                                                        Number(value) > 0 ||
                                                        "Size must be greater than 0",
                                                },
                                            )}
                                        />
                                        {errors.variants?.[index]?.size && (
                                            <p className="mt-1 text-[10px] text-[#a56b6b]">
                                                {
                                                    errors.variants[index].size
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                    </label>
                                    <label className="text-[11px] font-medium">
                                        Unit
                                        <select
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.unit`,
                                            )}
                                        >
                                            <option value={SizeUnit.CM}>
                                                cm
                                            </option>
                                            <option value={SizeUnit.INCH}>
                                                inch
                                            </option>
                                        </select>
                                    </label>
                                    <label className="text-[11px] font-medium">
                                        Type
                                        <select
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.product_type`,
                                            )}
                                        >
                                            <option value={ProductType.PERFUME}>
                                                perfume
                                            </option>
                                            <option value={ProductType.AATR}>
                                                aatr
                                            </option>
                                        </select>
                                    </label>
                                    <label className="text-[11px] font-medium">
                                        Price
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.price`,
                                                {
                                                    required:
                                                        "Price is required",
                                                    validate: (value) =>
                                                        Number(value) >= 0 ||
                                                        "Price must be 0 or more",
                                                },
                                            )}
                                        />
                                        {errors.variants?.[index]?.price && (
                                            <p className="mt-1 text-[10px] text-[#a56b6b]">
                                                {
                                                    errors.variants[index].price
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                    </label>
                                    <label className="text-[11px] font-medium">
                                        Compare price
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.compare_price`,
                                                {
                                                    required:
                                                        "Compare price is required",
                                                    validate: (value) =>
                                                        Number(value) >= 0 ||
                                                        "Compare price must be 0 or more",
                                                },
                                            )}
                                        />
                                        {errors.variants?.[index]
                                            ?.compare_price && (
                                            <p className="mt-1 text-[10px] text-[#a56b6b]">
                                                {
                                                    errors.variants[index]
                                                        .compare_price?.message
                                                }
                                            </p>
                                        )}
                                    </label>
                                    <label className="text-[11px] font-medium">
                                        Stock
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="mt-1 w-full rounded-lg border border-[#e2e0d8] px-2.5 py-2 text-sm"
                                            {...register(
                                                `variants.${index}.stock`,
                                                {
                                                    required:
                                                        "Stock is required",
                                                    validate: (value) =>
                                                        (Number(value) >= 0 &&
                                                            Number.isInteger(
                                                                Number(value),
                                                            )) ||
                                                        "Stock must be a whole number",
                                                },
                                            )}
                                        />
                                        {errors.variants?.[index]?.stock && (
                                            <p className="mt-1 text-[10px] text-[#a56b6b]">
                                                {
                                                    errors.variants[index].stock
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <span className="text-xs font-medium">Images</span>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {images.map((entry, index) => (
                            <div
                                key={entry.key}
                                className={`relative rounded-xl border p-2 ${entry.isPrimary ? "border-[#a17943]" : "border-[#e2e0d8]"}`}
                            >
                                <img
                                    src={entry.url}
                                    alt=""
                                    className="h-28 w-full rounded-lg object-cover"
                                />
                                <div className="mt-2 flex items-center justify-between gap-1">
                                    <label className="flex items-center gap-1 text-[10px]">
                                        <input
                                            type="radio"
                                            checked={entry.isPrimary}
                                            onChange={() =>
                                                setPrimary(entry.key)
                                            }
                                        />
                                        Primary
                                    </label>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            aria-label="Move image left"
                                            disabled={index === 0}
                                            onClick={() =>
                                                moveImage(index, -1)
                                            }
                                            className="rounded p-1 text-[#92938c] disabled:opacity-30"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Move image right"
                                            disabled={
                                                index === images.length - 1
                                            }
                                            onClick={() => moveImage(index, 1)}
                                            className="rounded p-1 text-[#92938c] disabled:opacity-30"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Remove image"
                                            onClick={() =>
                                                removeImage(entry.key)
                                            }
                                            className="rounded p-1 text-[#92938c] hover:text-[#a56b6b]"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#d5d1c6] bg-[#f7f5ef] p-4 text-xs text-[#888980]">
                            <ImagePlus size={17} />
                            Add images
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={onFilesSelected}
                            />
                        </label>
                    </div>
                    {imageError && (
                        <p className="mt-1.5 text-[11px] text-[#a56b6b]">
                            {imageError}
                        </p>
                    )}
                </div>
            </div>

            {errors.root && (
                <p className="mt-4 rounded-xl bg-[#f4e7e3] px-3 py-3 text-xs text-[#a56b6b]">
                    {errors.root.message}
                </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
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
                    {productId ? "Update product" : "Save product"}
                </button>
            </div>
        </form>
    );
}
