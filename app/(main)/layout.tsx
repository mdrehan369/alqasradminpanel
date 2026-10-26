import Sidebar, { SidebarProvider } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex h-dvh w-full overflow-hidden">
                <Sidebar />
                <div className="min-w-0 flex-1 overflow-y-auto p-10">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
