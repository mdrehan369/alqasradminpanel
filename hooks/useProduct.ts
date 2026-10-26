"use client";

import { GET_PRODUCTS_QUERY_KEYS } from "@/lib/constants";
import { getProducts } from "@/queries/product";
import { Paginated } from "@/types/common";
import { ProductListItem } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useDebounce from "./useDebounce";

const initialData: Paginated<ProductListItem> = {
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

export default function useProduct() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search);

    const { data, error, isFetching, refetch, isLoading } = useQuery<
        Paginated<ProductListItem>
    >({
        initialData,
        queryKey: [...GET_PRODUCTS_QUERY_KEYS, page, debouncedSearch, limit],
        queryFn: () => getProducts({ page, limit, search }),
    });

    return {
        page,
        setPage,
        search,
        setSearch,
        limit,
        setLimit,
        products: data?.items ?? [],
        pagination: data?.pagination ?? initialData.pagination,
        error,
        isFetching,
        isLoading,
        refetch,
    };
}
