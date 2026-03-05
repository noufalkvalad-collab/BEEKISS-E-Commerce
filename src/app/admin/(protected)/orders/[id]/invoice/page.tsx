"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Printer, Loader2 } from "lucide-react";
import Image from "next/image";

export default function OrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-honey-gold" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Order Not Found</h1>
                <Link href="/admin/orders" className="bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const subtotal = order.totalAmount + (order.discountAmount || 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
            {/* Action Bar (Hidden in Print) */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link href={`/admin/orders/${order._id}`} className="text-gray-500 hover:text-honey-gold transition-colors flex items-center gap-1 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Back to Order
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-forest-green text-white px-5 py-2.5 rounded-lg shadow hover:bg-forest-green/90 transition-colors font-medium"
                >
                    <Printer className="w-4 h-4" /> Print Invoice
                </button>
            </div>

            {/* A4 Printable Canvas */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 md:p-12 print:shadow-none print:p-0">

                {/* Header Section */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                    <div>
                        <div className="w-10 h-10 relative mb-4">
                            <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm" />
                            <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-xl z-10">B</div>
                        </div>
                        <h1 className="text-2xl font-serif font-bold tracking-wider text-forest-green uppercase">BEEKISS HONEY</h1>
                        <p className="text-gray-500 text-sm mt-1">Premium Raw Organic Honey</p>
                        <p className="text-gray-500 text-sm">support@beekiss.com</p>
                        <p className="text-gray-500 text-sm">+91 99999 99999</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-300 uppercase tracking-widest mb-2">Invoice</h2>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">Order No:</span> <span className="font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</span></p>
                            <p><span className="text-gray-500 w-24 inline-block">Date:</span> <span className="font-medium text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span></p>
                            <p><span className="text-gray-500 w-24 inline-block">Payment:</span> <span className="font-medium text-gray-900">{order.paymentMethod}</span></p>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="flex flex-col sm:flex-row justify-between gap-8 mb-10">
                    <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Billed To</h3>
                        <div className="text-sm text-gray-800 space-y-1">
                            <p className="font-bold text-base text-gray-900">{order.address?.name}</p>
                            <p>{order.userEmail}</p>
                            <p>Ph: {order.address?.phone}</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Shipped To</h3>
                        <div className="text-sm text-gray-800 space-y-1">
                            <p className="font-medium text-gray-900">{order.address?.houseName}</p>
                            {order.address?.landmark && <p>Near {order.address.landmark}</p>}
                            <p>{order.address?.district}, {order.address?.state}</p>
                            <p>India - {order.address?.pincode}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-forest-green/20 text-forest-green text-sm uppercase tracking-wider">
                                <th className="py-3 px-4 font-bold">Item Description</th>
                                <th className="py-3 px-4 font-bold text-center">Size</th>
                                <th className="py-3 px-4 font-bold text-center">Qty</th>
                                <th className="py-3 px-4 font-bold text-right">Price</th>
                                <th className="py-3 px-4 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm border-b border-gray-200">
                            {order.items.map((item: any, idx: number) => (
                                <tr key={item._id || idx} className="border-b border-gray-100 last:border-0">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded border relative flex-shrink-0 hidden sm:block print:hidden">
                                                <Image src={item.image || "/honey.jpg"} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center text-gray-600">{item.size || "Standard"}</td>
                                    <td className="py-4 px-4 text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-4 px-4 text-right text-gray-600">₹{item.price?.toLocaleString('en-IN')}</td>
                                    <td className="py-4 px-4 text-right font-medium text-gray-900">
                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Totals */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div className="text-xs text-gray-500 sm:w-1/2 space-y-2 print:text-[10px]">
                        <p className="font-bold text-gray-700 uppercase">Terms & Conditions</p>
                        <p>1. Returns are accepted within 7 days of delivery only for sealed products.</p>
                        <p>2. Please contact support@beekiss.com for any quality concerns.</p>
                        <p>3. Thank you for supporting pure, organic honey harvested with care.</p>
                    </div>

                    <div className="sm:w-1/3 min-w-[250px]">
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            {order.discountAmount > 0 && (
                                <div className="flex justify-between border-b border-gray-100 pb-2 text-red-600">
                                    <span>Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                                    <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className="flex justify-between pt-2 text-lg font-bold text-forest-green">
                                <span>Total</span>
                                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center text-gray-400 text-sm font-serif italic print:mt-12">
                    <p>— Spread the Sweetness —</p>
                </div>

            </div>
        </div>
    );
}
