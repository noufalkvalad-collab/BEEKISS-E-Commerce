"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock, Truck, FileText, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${resolvedParams.id}`);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.order);
                }
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (resolvedParams.id) {
            fetchOrder();
        }
    }, [resolvedParams.id]);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${order._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
                toast.success(`Order status updated to ${newStatus}`);
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Internal server error. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-honey-gold" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Order Not Found</h1>
                <p className="text-gray-500 mb-6">The order you are looking for does not exist or has been deleted.</p>
                <Link href="/admin/orders" className="bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link href="/admin/orders" className="text-gray-500 hover:text-honey-gold transition-colors flex items-center gap-1 text-sm font-medium mb-2 w-fit">
                        <ChevronLeft className="w-4 h-4" /> Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 uppercase">Order #{order._id.slice(-6)}</h1>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            {order.status}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/orders/${order._id}/invoice`} className="flex items-center gap-2 px-4 py-2 border rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" /> Invoice
                    </Link>
                    <div className="relative">
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isUpdating}
                            className="bg-forest-green text-white px-4 py-2 rounded font-medium hover:bg-forest-green/90 transition-colors flex items-center gap-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-honey-gold disabled:opacity-70 pr-10"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-honey-gold" /> Order Items
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item._id || item.productId} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border relative flex-shrink-0">
                                        <Image src={item.image || "/honey.jpg"} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.size || "Standard"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-forest-green">₹{item.price?.toLocaleString('en-IN')}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-semibold text-gray-900 w-24">
                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-6 space-y-3 lg:w-1/2 lg:ml-auto">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (GST Included)</span>
                                <span>—</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-forest-green pt-3 border-t">
                                <span>Total</span>
                                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-honey-gold" /> Order Timeline
                        </h2>

                        <div className="relative pl-6 border-l-2 border-honey-gold space-y-8">
                            <div className="relative">
                                <span className="absolute -left-[31px] bg-honey-gold w-4 h-4 rounded-full border-4 border-white shadow-sm" />
                                <h4 className="font-medium text-gray-900 leading-none">Order Placed</h4>
                                <p className="text-sm text-gray-500 mt-1">Order received and payment confirmed.</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className={`relative ${order.status === 'Pending' ? 'opacity-50' : ''}`}>
                                <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                    ${order.status === 'Pending' ? 'bg-gray-200' : 'bg-honey-gold'}`} />
                                <h4 className={`font-medium leading-none ${order.status === 'Pending' ? 'text-gray-500' : 'text-gray-900'}`}>Order Processed</h4>
                                <p className="text-sm text-gray-500 mt-1">Order is being packed.</p>
                            </div>
                            <div className={`relative ${['Pending', 'Processing'].includes(order.status) ? 'opacity-50' : ''}`}>
                                <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                    ${['Pending', 'Processing'].includes(order.status) ? 'bg-gray-200' : 'bg-honey-gold'}`} />
                                <h4 className={`font-medium leading-none ${['Pending', 'Processing'].includes(order.status) ? 'text-gray-500' : 'text-gray-900'}`}>Shipped</h4>
                                <p className="text-sm text-gray-500 mt-1">Handed over to delivery partner.</p>
                            </div>
                            <div className={`relative ${order.status !== 'Delivered' ? 'opacity-50' : ''}`}>
                                <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm
                                    ${order.status !== 'Delivered' ? 'bg-gray-200' : 'bg-honey-gold'}`} />
                                <h4 className={`font-medium leading-none ${order.status !== 'Delivered' ? 'text-gray-500' : 'text-gray-900'}`}>Delivered</h4>
                                <p className="text-sm text-gray-500 mt-1">Package delivered to customer.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Customer & Payment */}
                <div className="space-y-6">

                    {/* Customer */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <User className="w-5 h-5 text-honey-gold" /> Customer Details
                        </h2>
                        <div className="space-y-3">
                            <p className="font-medium text-gray-900">{order.address?.name || "Guest"}</p>
                            <p className="text-sm text-blue-600 hover:underline cursor-pointer">{order.userEmail}</p>
                            <p className="text-sm text-gray-600">{order.address?.phone || "N/A"}</p>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-honey-gold" /> Shipping Address
                        </h2>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{order.address?.name}</p>
                            <p>{order.address?.houseName}</p>
                            {order.address?.landmark && <p>Near: {order.address.landmark}</p>}
                            <p>{order.address?.district}, {order.address?.state} {order.address?.pincode}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <CreditCard className="w-5 h-5 text-honey-gold" /> Payment Info
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase 
                                    ${order.paymentMethod === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.paymentMethod === 'ONLINE' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Txn ID:</span>
                                <span className="text-gray-900 truncate max-w-[120px]" title="Standard Order">
                                    Standard Order
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
