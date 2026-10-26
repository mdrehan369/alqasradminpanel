"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "./auth-guard";
import { Analytics } from "@vercel/analytics/next";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    const [client] = React.useState(() => new QueryClient());
    return (
        <QueryClientProvider client={client}>
            <AuthGuard>{children}</AuthGuard>
            {process.env.NODE_ENV === "production" && <Analytics />}
        </QueryClientProvider>
    );
}
