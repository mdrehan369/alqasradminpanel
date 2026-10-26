import { catalogApi } from "@/lib/api";
import { Paginated, Pagination, PaginationParams } from "@/types/common";
import { ProductDetail, ProductListItem } from "@/types/product";

const emptyPagination = (page = 1, limit = 10): Pagination => ({
    page,
    limit,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
});

export const getProducts = async ({
    page,
    limit,
    search,
}: PaginationParams): Promise<Paginated<ProductListItem>> => {
    try {
        const response = await catalogApi.products({
            page,
            limit,
            search,
        });
        const data = response.data?.data;
        return {
            items: data?.items ?? [],
            pagination: data?.pagination ?? emptyPagination(page, limit),
        };
    } catch (err) {
        console.log(err);
        return {
            items: [],
            pagination: emptyPagination(page, limit),
        };
    }
};

export const getProductById = async (
    id: number,
): Promise<ProductDetail | null> => {
    try {
        const response = await catalogApi.getProduct(id);
        const data = response.data?.data;
        return data?.item ?? data ?? null;
    } catch (err) {
        console.log(err);
        return null;
    }
};
