export type Category = {
    id: number;
    name: string;
    created_at: string;
};

export type CategoryListItem = Category & {
    product_count?: number;
};
