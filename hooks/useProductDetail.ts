"use client";

import { GET_PRODUCTS_QUERY_KEYS } from "@/lib/constants";
import { getProductById } from "@/queries/product";
import { ProductDetail } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

export default function useProductDetail(id?: number) {
    const { data, error, isFetching } = useQuery<ProductDetail | null>({
        queryKey: [...GET_PRODUCTS_QUERY_KEYS, "detail", id],
        queryFn: () => getProductById(id as number),
        enabled: Boolean(id),
    });

    return {
        product: data ?? null,
        error,
        isFetching,
    };
}
