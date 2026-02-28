"use client";

import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock, Truck, FileText, Download } from "lucide-react";
import Image from "next/image";

// Mock Data
const orderData = {
    id: "ORD-9012",
    date: "Feb 28, 2026, 10:23 AM",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Razorpay",
    transactionId: "pay_mock_94827163",
    customer: {
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        phone: "+91 98765 43210",
        totalOrders: 4
    },
    shipping: {
        address: "123 Palm Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
    },
    items: [
        { id: 1, name: "Wildflower Reserve", size: "500g", price: 1299, quantity: 2, image: "/honey.jpg" }
    ],
    subtotal: 2598,
    shippingFee: 0,
    tax: 129.9,
    total: 2598
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    // Normally we would fetch the order based on params.id

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link href="/admin/orders" className="text-gray-500 hover:text-honey-gold transition-colors flex items-center gap-1 text-sm font-medium mb-2 w-fit">
                        <ChevronLeft className="w-4 h-4" /> Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Order #{params.id || orderData.id}</h1>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            {orderData.status}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">{orderData.date}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" /> Invoice
                    </button>
                    <button className="bg-forest-green text-white px-4 py-2 rounded font-medium hover:bg-forest-green/90 transition-colors flex items-center gap-2">
                        Update Status
                    </button>
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
                            {orderData.items.map(item => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border relative flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-forest-green">₹{item.price.toLocaleString('en-IN')}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-semibold text-gray-900 w-24">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-6 space-y-3 lg:w-1/2 lg:ml-auto">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{orderData.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{orderData.shippingFee === 0 ? "Free" : `₹${orderData.shippingFee}`}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (GST Included)</span>
                                <span>₹{orderData.tax.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-forest-green pt-3 border-t">
                                <span>Total</span>
                                <span>₹{orderData.total.toLocaleString('en-IN')}</span>
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
                                <p className="text-xs text-gray-400 mt-1">Feb 28, 10:23 AM</p>
                            </div>
                            <div className="relative opacity-50">
                                <span className="absolute -left-[31px] bg-gray-200 w-4 h-4 rounded-full border-4 border-white shadow-sm" />
                                <h4 className="font-medium text-gray-500 leading-none">Order Processed</h4>
                                <p className="text-sm text-gray-500 mt-1">Order is being packed.</p>
                            </div>
                            <div className="relative opacity-50">
                                <span className="absolute -left-[31px] bg-gray-200 w-4 h-4 rounded-full border-4 border-white shadow-sm" />
                                <h4 className="font-medium text-gray-500 leading-none">Shipped</h4>
                                <p className="text-sm text-gray-500 mt-1">Handed over to delivery partner.</p>
                            </div>
                            <div className="relative opacity-50">
                                <span className="absolute -left-[31px] bg-gray-200 w-4 h-4 rounded-full border-4 border-white shadow-sm" />
                                <h4 className="font-medium text-gray-500 leading-none">Delivered</h4>
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
                            <p className="font-medium text-gray-900">{orderData.customer.name}</p>
                            <p className="text-sm text-blue-600 hover:underline cursor-pointer">{orderData.customer.email}</p>
                            <p className="text-sm text-gray-600">{orderData.customer.phone}</p>
                            <p className="text-sm text-gray-500 mt-2">{orderData.customer.totalOrders} total orders</p>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-forest-green mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-honey-gold" /> Shipping Address
                        </h2>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{orderData.customer.name}</p>
                            <p>{orderData.shipping.address}</p>
                            <p>{orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.pincode}</p>
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
                                <span className="font-medium text-gray-900">{orderData.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
                                    {orderData.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Txn ID:</span>
                                <span className="text-gray-900 truncate max-w-[120px]" title={orderData.transactionId}>
                                    {orderData.transactionId}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
