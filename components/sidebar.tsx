"use client";

import { clearAuthToken } from "@/lib/api";
import {
    BarChart3,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    Sparkles,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

type NavElems = {
    label: string;
    icon: LucideIcon;
    href: string;
};

const nav: NavElems[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Products", icon: Package, href: "/products" },
    { label: "Categories", icon: FolderKanban, href: "/categories" },
    { label: "Customers", icon: Users, href: "/customers" },
];

type SidebarContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context)
        throw new Error("useSidebar must be used within a SidebarProvider");
    return context;
}

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { open, setOpen } = useSidebar();

    const isActive = (href: string) => href == pathname;
    return (
        <>
            <header
                className="flex lg:hidden h-[76px] items-center justify-between border-b border-[#e5e4de] bg-[#fbfaf7]/80 
                px-5 backdrop-blur md:px-10"
            >
                <div className="flex items-center gap-3">
                    <button className="lg:hidden" onClick={() => setOpen(true)}>
                        <Menu size={21} />
                    </button>
                </div>
            </header>

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-[252px] shrink-0 flex-col overflow-y-auto border-r border-[#e4e3dd] bg-[#fbfaf7] px-5 py-6 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="mb-11 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20221f] text-[#e7cfa0]">
                            <Sparkles size={19} />
                        </div>
                        <div>
                            <p className="font-serif text-[21px] tracking-wide">
                                Al Qasr
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a8b84]">
                                Admin studio
                            </p>
                        </div>
                    </div>
                    <button
                        className="lg:hidden"
                        onClick={() => setOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>
                <nav className="space-y-2">
                    {nav.map(({ label, icon: Icon, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${isActive(href) ? "bg-[#20221f] text-white shadow-sm" : "text-[#777971] hover:bg-[#f0efe9] hover:text-[#20221f]"}`}
                        >
                            <Icon size={17} strokeWidth={1.7} />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-9 border-t border-[#e7e5de] pt-7">
                    <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a29b]">
                        Workspace
                    </p>
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-[#777971] hover:bg-[#f0efe9]">
                        <BarChart3 size={17} strokeWidth={1.7} />
                        Analytics
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-[#777971] hover:bg-[#f0efe9]">
                        <Settings size={17} strokeWidth={1.7} />
                        Settings
                    </button>
                </div>
                <div className="mt-auto rounded-2xl bg-[#f0eee7] p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7b899] text-[11px] font-semibold">
                            AK
                        </div>
                        <div>
                            <p className="text-[12px] font-medium">
                                Aarav Khan
                            </p>
                            <p className="text-[10px] text-[#888980]">
                                Administrator
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            clearAuthToken();
                            router.replace("/signin");
                            router.refresh();
                        }}
                        className="flex items-center gap-2 text-[11px] text-[#888980] hover:text-[#20221f]"
                    >
                        <LogOut size={14} /> Sign out
                    </button>
                </div>
            </aside>
            {open && (
                <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-20 bg-black/20 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
