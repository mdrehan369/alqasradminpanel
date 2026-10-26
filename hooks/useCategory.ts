"use client";

import { GET_CATEGORIES_QUERY_KEYS } from "@/lib/constants";
import { getCategories } from "@/queries/category";
import { CategoryListItem } from "@/types/category";
import { Paginated } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useDebounce from "./useDebounce";

const initialData: Paginated<CategoryListItem> = {
    items: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
    },
};

export default function useCategory() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search);

    const { data, error, isFetching, refetch } = useQuery<
        Paginated<CategoryListItem>
    >({
        initialData,
        queryKey: [...GET_CATEGORIES_QUERY_KEYS, page, debouncedSearch, limit],
        queryFn: () => getCategories({ page, limit, search }),
    });

    return {
        page,
        setPage,
        search,
        setSearch,
        limit,
        setLimit,
        categories: data?.items ?? [],
        pagination: data?.pagination ?? initialData.pagination,
        error,
        isFetching,
        refetch,
    };
}
