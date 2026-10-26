export type PaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
};

export type Paginated<T> = {
    items: T[];
    pagination: Pagination;
};
