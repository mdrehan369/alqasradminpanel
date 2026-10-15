import axios from "axios";

export const TOKEN_KEY = "access_token";

export const getAuthToken = () =>
  typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") sessionStorage.removeItem(TOKEN_KEY);
};

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  signIn: (payload: { email: string; password: string }) =>
    api.post("/api/v1/admin/auth/", payload),
  me: () => api.get("/api/v1/admin/auth/me"),
};

export const catalogApi = {
  categories: (params?: { page?: number; limit?: number }) =>
    api.get("/api/v1/admin/categories/", { params }),
  createCategory: (payload: { name: string }) =>
    api.post("/api/v1/admin/categories/", payload),
  updateCategory: (id: number, payload: { name?: string | null }) =>
    api.patch(`/api/v1/admin/categories/${id}`, payload),
  deleteCategory: (id: number) => api.delete(`/api/v1/admin/categories/${id}`),
  products: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/api/v1/admin/products/", { params }),
  createProduct: (payload: unknown) =>
    api.post("/api/v1/admin/products/", payload),
  updateProduct: (id: number, payload: unknown) =>
    api.patch(`/api/v1/admin/products/${id}`, payload),
  uploadImages: (payload: FormData) =>
    api.post("/api/v1/admin/images/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  addProductImage: (id: number, payload: unknown) =>
    api.post(`/api/v1/admin/products/${id}/images`, payload),
  deleteProductImage: (productId: number, imageId: number) =>
    api.delete(`/api/v1/admin/products/${productId}/images/${imageId}`),
};

export default api;

// Change the baseURL above when the backend is deployed; all requests use this instance.
