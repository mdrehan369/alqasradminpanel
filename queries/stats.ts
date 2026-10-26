import { catalogApi } from "@/lib/api";

export const getDasboardStats = async () => {
    try {
        const response = await catalogApi.getDashboardStats();
        return response.data.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};
