import { authApi } from "@/lib/api";

export const getAuth = async () => {
    try {
        const result = await authApi.me();
        return result.data.success;
    } catch (err) {
        console.log(err);
        return false;
    }
};
