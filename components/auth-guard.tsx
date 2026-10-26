"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/lib/constants";
import { getAuth } from "@/queries/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthRoute = pathname === "/signin";

    const { data: isLoggedin, isFetching } = useQuery<boolean>({
        queryKey: AUTH_KEYS,
        queryFn: getAuth,
        initialData: false,
    });

    useEffect(() => {
        if (isLoggedin && isAuthRoute) router.replace("/");
        else if (!isFetching && !isLoggedin) {
            clearAuthToken();
            router.replace("/signin");
        }
    }, [isFetching]);

    if (isFetching) return;
    return <>{children}</>;
}
