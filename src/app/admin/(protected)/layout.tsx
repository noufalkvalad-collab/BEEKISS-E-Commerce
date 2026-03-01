"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, FolderTree, Tag, Users, ShoppingCart, Settings, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
        { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
        { href: "/admin/products", icon: ShoppingBag, label: "Products" },
        { href: "/admin/categories", icon: FolderTree, label: "Categories" },
        { href: "/admin/offers", icon: Tag, label: "Offers" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDF9] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-[#0F2E1D] text-white hidden md:flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-white/10 relative overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/5 blur-3xl transform rotate-12 pointer-events-none"></div>

                    <Link href="/admin" className="relative z-10 block">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative">
                                <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm shadow-md" />
                                <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-sm z-10">B</div>
                            </div>
                            <div>
                                <span className="text-xl font-serif font-bold tracking-wider block leading-none">BEE KISS</span>
                                <span className="text-[10px] font-sans text-[#D4A017] uppercase tracking-widest block mt-1">Admin Portal</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-[#D4A017] text-[#0F2E1D] shadow-md font-bold"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-[#0F2E1D]" : "text-white/50 group-hover:text-white transition-colors"}`} />
                                <span className="font-sans text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 relative z-10">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#0F2E1D] text-white p-4 flex justify-between items-center z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                            <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm shadow-md" />
                            <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-[10px] z-10">B</div>
                        </div>
                        <span className="font-serif font-bold text-lg">BEE KISS Admin</span>
                    </div>
                    <button className="text-[#D4A017] p-1"><LayoutDashboard className="w-6 h-6" /></button>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
