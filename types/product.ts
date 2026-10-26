import { Category } from "./category";
import { ProductType, SizeUnit } from "./enums";
import { ProductImageFull } from "./image";

export interface Product {
    id: number;
    title: string;
    details: string;
    ingredients: string;
    category_id: number;
    category: Category;
    is_active: boolean;
    created_at: Date;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    unit: SizeUnit;
    size: number;
    product_type: ProductType;
    price: number;
    compare_price: number;
    stock: number;
    created_at: Date;
}

export interface ProductWithVariants extends Product {
    variants: ProductVariant[];
}

export interface ProductWithImagesVariants extends ProductWithVariants {
    images: ProductImageFull[];
}

export type ProductPrimaryImage = {
    id: number;
    image: {
        id: number;
        url: string;
    };
};

export type ProductListItem = {
    id: number;
    title: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    category: Category;
    primary_image: ProductPrimaryImage | null;
    variant_count: number;
};

export type ImageRecord = {
    id: number;
    file_id: string;
    url: string;
    file_path: string;
};

export type ProductVariantDetail = {
    id: number;
    size: number;
    unit: SizeUnit;
    price: number;
    compare_price: number;
    stock: number;
    product_type: ProductType;
};

export type ProductImageDetail = {
    id: number;
    display_order: number;
    is_primary: boolean;
    image: ImageRecord;
};

export type ProductDetail = {
    id: number;
    title: string;
    ingredients: string;
    details: string;
    is_active: boolean;
    category_id: number;
    created_at: string;
    category: Category;
    slug: string;
    variants: ProductVariantDetail[];
    images: ProductImageDetail[];
};

export type ProductImageInput = {
    image_id: number;
    is_primary?: boolean;
    display_order?: number | null;
};

export type VariantPayload = {
    size: number;
    unit: SizeUnit;
    price: number;
    compare_price: number;
    stock: number;
    product_type: ProductType;
};

export type CreateProductPayload = {
    title: string;
    ingredients: string;
    details: string;
    is_active: boolean;
    category_id: number;
    variants: VariantPayload[];
    images: ProductImageInput[];
};

export type UpdateProductPayload = {
    title?: string;
    ingredients?: string;
    details?: string;
    is_active?: boolean;
    category_id?: number;
};

export type UpdateVariantPayload = Partial<VariantPayload>;

export type UpdateProductImagePayload = {
    is_primary?: boolean;
    display_order?: number;
};

export type ProductVariantFormValue = {
    variantId?: number;
    size: string;
    unit: SizeUnit;
    price: string;
    compare_price: string;
    stock: string;
    product_type: ProductType;
};

export type ProductFormValues = {
    title: string;
    category_id: string;
    ingredients: string;
    details: string;
    is_active: boolean;
    variants: ProductVariantFormValue[];
};
