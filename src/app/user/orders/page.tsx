"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Package, Clock, ChevronRight, Loader2, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserProfileOrders() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (status !== "authenticated") return;
            try {
                const res = await fetch("/api/user/orders", { cache: "no-store" });
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to load user orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [status]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-honey-gold" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#FDFDF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-10">

                {/* User Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-honey-gold/20 mb-4 bg-gray-50 flex items-center justify-center">
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="Profile" width={96} height={96} className="object-cover" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">{session.user?.name || "Bee Lover"}</h2>
                        <p className="text-gray-500 text-sm mb-6 text-center">{session.user?.email}</p>

                        <div className="w-full border-t border-gray-100 pt-6 space-y-2">
                            <button className="flex justify-between items-center w-full px-4 py-3 rounded-lg bg-honey-gold/10 text-forest-green font-medium transition-colors">
                                <span className="flex items-center gap-3"><Package className="w-5 h-5 text-honey-gold" /> My Orders</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button onClick={handleLogout} className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors">
                                <span className="flex items-center gap-3"><LogOut className="w-5 h-5" /> Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Content */}
                <div className="w-full md:w-3/4">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Package className="text-honey-gold" /> Order History
                    </h1>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-serif font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't indulged in our luxury honey collections yet.</p>
                            <Link href="/products" className="bg-forest-green text-white px-8 py-3 rounded-full hover:bg-forest-green/90 transition-transform hover:scale-105 shadow-md">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Placed</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                                                <p className="font-medium text-forest-green">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order #</p>
                                                <p className="font-medium text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <Link href={`/user/orders/${order._id}`} className="text-honey-gold border border-honey-gold px-4 py-2 rounded-lg text-sm font-medium hover:bg-honey-gold hover:text-white transition-colors text-center">
                                            View Details
                                        </Link>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                <Clock className={`w-5 h-5 ${order.status === 'Delivered' ? 'text-green-500' :
                                                        order.status === 'Cancelled' ? 'text-red-500' : 'text-honey-gold'
                                                    }`} />
                                                <span className={`
                                                    ${order.status === 'Delivered' ? 'text-green-600' : ''}
                                                    ${order.status === 'Cancelled' ? 'text-red-600' : ''}
                                                    ${['Pending', 'Processing', 'Shipped'].includes(order.status) ? 'text-honey-gold' : ''}
                                                `}>
                                                    {order.status === 'Pending' ? 'Order Placed' :
                                                        order.status === 'Processing' ? 'Preparing to Ship' :
                                                            order.status === 'Shipped' ? 'On the Way' :
                                                                order.status}
                                                </span>
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border relative flex-shrink-0">
                                                        <Image src={item.image || "/honey.jpg"} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Size: {item.size || "Standard"} • Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-gray-500 italic">+ {order.items.length - 2} more item(s)</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
