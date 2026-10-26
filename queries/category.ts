import { catalogApi } from "@/lib/api";
import { Category, CategoryListItem } from "@/types/category";
import { Paginated, Pagination, PaginationParams } from "@/types/common";

const emptyPagination = (page = 1, limit = 10): Pagination => ({
    page,
    limit,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
});

export const getCategories = async ({
    page,
    limit,
    search,
}: PaginationParams): Promise<Paginated<CategoryListItem>> => {
    try {
        const response = await catalogApi.categories({
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

export const getAllCategories = async (
    search?: string,
): Promise<Category[]> => {
    try {
        const response = await catalogApi.allCategories(search);
        return response.data?.data ?? [];
    } catch (err) {
        console.log(err);
        return [];
    }
};
