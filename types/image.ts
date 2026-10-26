export interface ImagekitImage {
    id: number;
    file_id: string;
    url: string;
    file_path: string;
    created_at: Date;
}

export interface ProductImageFull {
    id: number;
    image_id: number;
    product_id: number;
    display_order: number;
    is_primary: boolean;
    image: ImagekitImage;
}
