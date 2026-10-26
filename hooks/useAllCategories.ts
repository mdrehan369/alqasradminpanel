"use client";

import { GET_CATEGORIES_QUERY_KEYS } from "@/lib/constants";
import { getAllCategories } from "@/queries/category";
import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export default function useAllCategories() {
    const { data, error, isFetching, refetch } = useQuery<Category[]>({
        initialData: [],
        queryKey: [...GET_CATEGORIES_QUERY_KEYS, "all"],
        queryFn: () => getAllCategories(),
    });

    return {
        categories: data ?? [],
        error,
        isFetching,
        refetch,
    };
}
