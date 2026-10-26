"use client";

import useCategory from "@/hooks/useCategory";
import { ChevronDown, FolderKanban } from "lucide-react";
import Link from "next/link";

const tints = ["bg-[#ede7dc]", "bg-[#e4ebe5]", "bg-[#eee5e9]"];

export default function HeroCategoryTable() {
    const { categories } = useCategory();
    return (
        <section className="rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7] p-5 md:p-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h2 className="font-serif text-xl">Categories</h2>
                    <p className="mt-1 text-xs text-[#92938c]">
                        Organize your collection
                    </p>
                </div>
            </div>
            <div className="space-y-3">
                {categories.map((c, index) => (
                    <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-xl border border-[#eceae4] p-3"
                    >
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${tints[index % tints.length]}`}
                        >
                            <FolderKanban
                                size={17}
                                className="text-[#7c7e75]"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium">{c.name}</p>
                            <p className="mt-1 text-[10px] text-[#a0a19b]">
                                {c.product_count ?? 0} products
                            </p>
                        </div>
                        <ChevronDown
                            size={15}
                            className="-rotate-90 text-[#b1b1aa]"
                        />
                    </div>
                ))}
            </div>
            <Link
                href={"/categories"}
                className="my-5 w-full border-[#d8d5cb] py-3 text-[12px] font-medium text-[#8c7659] hover:underline"
            >
                Manage categories
            </Link>
        </section>
    );
}
