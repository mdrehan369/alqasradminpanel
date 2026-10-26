"use client";
import { getDasboardStats } from "@/queries/stats";
import { DashboardStatsResponse } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";

// Add more stats parts like prev months and all
export default function Stats() {
    const { data, isLoading } = useQuery<DashboardStatsResponse | null>({
        initialData: null,
        queryKey: ["stats"],
        queryFn: getDasboardStats,
    });

    return (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data ? (
                [
                    [
                        "Total products",
                        data.total_products,
                        "+6.4%",
                        "from last month",
                    ],
                    [
                        "Active categories",
                        data.active_categories,
                        "+1 new",
                        "this month",
                    ],
                    [
                        "Low stock items",
                        data.low_stock_products,
                        "Needs attention",
                        "right now",
                    ],
                    [
                        "Catalog value",
                        "₹" + data.total_catalog_value,
                        "+12.8%",
                        "from last month",
                    ],
                ].map(([title, value, delta, sub], i) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7] p-5"
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <p className="text-xs text-[#85867f]">{title}</p>
                            <span
                                className={`rounded-full px-2 py-1 text-[10px] ${i === 2 ? "bg-[#f3e6d8] text-[#a66b32]" : "bg-[#e5ede5] text-[#55715a]"}`}
                            >
                                {delta}
                            </span>
                        </div>
                        <p className="font-serif text-3xl">{value}</p>
                        <p className="mt-1 text-[11px] text-[#a0a19b]">{sub}</p>
                    </div>
                ))
            ) : isLoading ? (
                <Loader />
            ) : (
                <div className="">
                    Some error occured while fetching dashboard stats!
                </div>
            )}
        </div>
    );
}
