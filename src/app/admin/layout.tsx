import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-forest-green text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin" className="text-xl font-serif font-bold tracking-wider">
                        BEE KISS
                        <span className="block text-xs font-sans text-honey-gold uppercase mt-1">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-honey-gold">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Orders</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Customers</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/5 text-red-300 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-forest-green text-white p-4 flex justify-between items-center">
                    <span className="font-serif font-bold">BEE KISS Admin</span>
                    <button><LayoutDashboard className="w-6 h-6" /></button>
                </header>

                <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
