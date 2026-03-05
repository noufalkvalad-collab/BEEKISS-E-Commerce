"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function UserOrderDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (status !== "authenticated") return;
            try {
                // We reuse the user orders list endpoint and filter it here to guarantee security limits (only own orders)
                const res = await fetch("/api/user/orders", { cache: "no-store" });
                const data = await res.json();
                if (data.success) {
                    const match = data.orders.find((o: any) => o._id === resolvedParams.id);
                    if (match) {
                        setOrder(match);
                    }
                }
            } catch (error) {
                console.error("Failed to load order details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (resolvedParams.id) fetchOrderDetails();
    }, [status, resolvedParams.id]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim() && cancelReason.length < 5) {
            toast.error("Please provide a brief reason for cancellation.");
            return;
        }

        setIsCancelling(true);
        try {
            const res = await fetch(`/api/user/orders/${order._id}/cancel`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: cancelReason })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Order cancelled successfully.");
                setOrder({ ...order, status: "Cancelled", cancellationReason: cancelReason });
                setShowCancelModal(false);
            } else {
                toast.error(data.error || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            toast.error("Internal server error.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-honey-gold" />
            </div>
        );
    }

    if (!session || !order) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Order Not Found</h2>
                <Link href="/user/orders" className="bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const canCancel = order.status === "Pending" || order.status === "Processing";

    return (
        <div className="min-h-screen bg-[#FDFDF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mt-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <Link href="/user/orders" className="text-gray-500 hover:text-honey-gold transition-colors flex items-center gap-1 text-sm font-medium mb-2 w-fit">
                            <ChevronLeft className="w-4 h-4" /> Back to My Orders
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-serif font-bold text-gray-900 uppercase">Order #{order._id.slice(-8)}</h1>
                        </div>
                        <p className="text-gray-500 mt-1 text-sm">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="border border-red-500 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <XCircle className="w-4 h-4" /> Cancel Order
                            </button>
                        )}
                        <span className={`px-4 py-2 text-sm font-bold rounded-lg uppercase tracking-wider
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-honey-gold/20 text-forest-green'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                            <p className="text-sm text-gray-500 mb-4">Are you sure you want to cancel Order #{order._id.slice(-8)}? Please provide a reason to help us improve.</p>

                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="E.g., Ordered by mistake, found a cheaper alternative..."
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px] mb-6"
                            />

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={isCancelling}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Cancel"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Timeline & Items Column */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Status Timeline */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                            <h2 className="text-lg font-bold text-forest-green mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-honey-gold" /> Order Status
                            </h2>

                            {order.status === "Cancelled" ? (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-5 relative overflow-hidden">
                                    <h4 className="font-bold text-red-700 text-lg mb-1 relative z-10">Order Cancelled</h4>
                                    <p className="text-red-600/80 text-sm relative z-10">Reason: {order.cancellationReason || "No reason provided."}</p>
                                    <XCircle className="absolute -bottom-6 -right-6 w-32 h-32 text-red-500/10 z-0" />
                                </div>
                            ) : (
                                <div className="relative pl-6 border-l-2 border-honey-gold space-y-8">
                                    <div className="relative">
                                        <span className="absolute -left-[31px] bg-honey-gold w-4 h-4 rounded-full border-4 border-white shadow-sm" />
                                        <h4 className="font-medium text-gray-900 leading-none">Placed</h4>
                                        <p className="text-sm text-gray-500 mt-1">Order registered securely.</p>
                                    </div>
                                    <div className={`relative ${order.status === 'Pending' ? 'opacity-40' : ''}`}>
                                        <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                            ${order.status === 'Pending' ? 'bg-gray-200 border-gray-50' : 'bg-honey-gold'}`} />
                                        <h4 className={`font-medium leading-none ${order.status === 'Pending' ? 'text-gray-500' : 'text-gray-900'}`}>Processing</h4>
                                        <p className="text-sm text-gray-500 mt-1">We are actively packing your honey.</p>
                                    </div>
                                    <div className={`relative ${['Pending', 'Processing'].includes(order.status) ? 'opacity-40' : ''}`}>
                                        <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                            ${['Pending', 'Processing'].includes(order.status) ? 'bg-gray-200 border-gray-50' : 'bg-honey-gold'}`} />
                                        <h4 className={`font-medium leading-none ${['Pending', 'Processing'].includes(order.status) ? 'text-gray-500' : 'text-gray-900'}`}>Shipped</h4>
                                        <p className="text-sm text-gray-500 mt-1">Handed over to delivery partners.</p>
                                    </div>
                                    <div className={`relative ${order.status !== 'Delivered' ? 'opacity-40' : ''}`}>
                                        <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                            ${order.status !== 'Delivered' ? 'bg-gray-200 border-gray-50' : 'bg-honey-gold'}`} />
                                        <h4 className={`font-medium leading-none ${order.status !== 'Delivered' ? 'text-gray-500' : 'text-gray-900'}`}>Delivered</h4>
                                        <p className="text-sm text-gray-500 mt-1">Package arrived safely.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-forest-green mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-honey-gold" /> Items Summary
                            </h2>

                            <div className="space-y-5">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative flex-shrink-0">
                                            <Image src={item.image || "/honey.jpg"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Size: {item.size || "Standard"}</p>
                                            <p className="text-sm font-medium text-forest-green mt-1">₹{item.price?.toLocaleString('en-IN')} × {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-bold text-gray-900 text-lg">
                                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Meta Sidebar */}
                    <div className="space-y-6">

                        {/* Payment & Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-forest-green mb-4 pb-3 border-b border-gray-50">
                                Summary
                            </h2>
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Method:</span>
                                    <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Payment Status:</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider
                                        ${order.paymentMethod === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.paymentMethod === 'ONLINE' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{(order.totalAmount + (order.discountAmount || 0)).toLocaleString('en-IN')}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                                        <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-forest-green pt-3 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2 pb-3 border-b border-gray-50">
                                <MapPin className="w-5 h-5 text-honey-gold" /> Delivery
                            </h2>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-bold text-gray-900 text-base">{order.address?.name}</p>
                                <p>{order.address?.houseName}</p>
                                {order.address?.landmark && <p>Near: {order.address.landmark}</p>}
                                <p>{order.address?.district}, {order.address?.state}</p>
                                <p className="font-medium mt-1">PIN: {order.address?.pincode}</p>
                                <p className="mt-2 pt-2 border-t border-gray-50 break-all w-full flex align-center">
                                    <span className="font-semibold w-12 shrink-0">Ph:</span> {order.address?.phone}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
