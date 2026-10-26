import { PaginationParams } from "@/types/common";
import {
    UpdateProductImagePayload,
    UpdateVariantPayload,
    VariantPayload,
} from "@/types/product";
import axios from "axios";

export const TOKEN_KEY = "access_token";

const readCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const entry = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

export const getAuthToken = () => readCookie(TOKEN_KEY);

export const setAuthToken = (token: string) => {
    if (typeof document === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax${secure}`;
};

export const clearAuthToken = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Lax`;
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authApi = {
    signIn: (payload: { email: string; password: string }) =>
        api.post("/auth/", payload),
    me: () => api.get("/auth/me"),
};

export const catalogApi = {
    categories: (params?: PaginationParams) =>
        api.get("/categories/", { params }),
    allCategories: (search?: string) =>
        api.get("/categories/all", { params: { search } }),
    createCategory: (payload: { name: string }) =>
        api.post("/categories/", payload),
    updateCategory: (id: number, payload: { name?: string | null }) =>
        api.patch(`/categories/${id}`, payload),
    deleteCategory: (id: number) => api.delete(`/categories/${id}`),
    products: (params?: PaginationParams) => api.get("/products/", { params }),
    getProduct: (id: number) => api.get(`/products/${id}`),
    createProduct: (payload: unknown) => api.post("/products/", payload),
    updateProduct: (id: number, payload: unknown) =>
        api.patch(`/products/${id}`, payload),
    deleteProduct: (id: number) => api.delete(`/products/${id}`),
    uploadImages: (payload: FormData) =>
        api.post("/images/", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    addProductImage: (productId: number, imageId: number) =>
        api.post(`/products/${productId}/images/${imageId}`),
    updateProductImage: (
        productId: number,
        productImageId: number,
        payload: UpdateProductImagePayload,
    ) => api.patch(`/products/${productId}/images/${productImageId}`, payload),
    deleteProductImage: (productId: number, productImageId: number) =>
        api.delete(`/products/${productId}/images/${productImageId}`),
    addProductVariant: (productId: number, payload: VariantPayload) =>
        api.post(`/products/${productId}/variants`, payload),
    updateProductVariant: (
        productId: number,
        variantId: number,
        payload: UpdateVariantPayload,
    ) => api.patch(`/products/${productId}/variants/${variantId}`, payload),
    deleteProductVariant: (productId: number, variantId: number) =>
        api.delete(`/products/${productId}/variants/${variantId}`),
    getDashboardStats: () => api.get("/stats/dashboard"),
};

export default api;

// Change the baseURL above when the backend is deployed; all requests use this instance.
